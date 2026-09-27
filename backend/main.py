from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
import numpy as np
import joblib

from sklearn.base import clone
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    roc_curve,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("claimshield_svm.joblib")

df = pd.read_csv("insurance_claims.csv")
df = df.replace("?", np.nan)

features = [
    "months_as_customer",
    "age",
    "policy_annual_premium",
    "policy_deductable",
    "incident_type",
    "collision_type",
    "incident_severity",
    "incident_hour_of_the_day",
    "number_of_vehicles_involved",
    "property_damage",
    "bodily_injuries",
    "witnesses",
    "police_report_available",
    "total_claim_amount",
    "vehicle_claim",
]

X = df[features].copy()
y = df["fraud_reported"].map({"N": 0, "Y": 1})

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)


class ClaimInput(BaseModel):
    months_as_customer: int
    age: int
    policy_annual_premium: float
    policy_deductable: float
    incident_type: str
    collision_type: str
    incident_severity: str
    incident_hour_of_the_day: int
    number_of_vehicles_involved: int
    property_damage: str
    bodily_injuries: int
    witnesses: int
    police_report_available: str
    total_claim_amount: float
    vehicle_claim: float


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(data: ClaimInput):
    input_df = pd.DataFrame([data.model_dump()])

    prediction = int(model.predict(input_df)[0])
    probability = float(model.predict_proba(input_df)[0][1])

    if prediction == 1:
        label = "Potentially Suspicious"
        action = "Manual Review Recommended"
    else:
        label = "Normal"
        action = "Standard Processing"

    return {
        "prediction": label,
        "class": prediction,
        "fraud_probability": round(probability, 4),
        "recommended_action": action,
    }


@app.get("/dashboard")
def dashboard():
    fraud_count = int((df["fraud_reported"] == "Y").sum())
    normal_count = int((df["fraud_reported"] == "N").sum())

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    return {
        "rows": int(len(df)),
        "columns": int(len(df.columns)),
        "selected_features": len(features),
        "accuracy": round(float(accuracy), 4),
        "normal_count": normal_count,
        "fraud_count": fraud_count,
    }


@app.get("/insights")
def insights():
    fraud_distribution = [
        {
            "name": "Normal",
            "value": int((df["fraud_reported"] == "N").sum()),
            "color": "#16a34a",
        },
        {
            "name": "Fraud Reported",
            "value": int((df["fraud_reported"] == "Y").sum()),
            "color": "#dc2626",
        },
    ]

    bins = [0, 20000, 40000, 60000, 80000, float("inf")]
    labels = ["0–20k", "20k–40k", "40k–60k", "60k–80k", "80k+"]

    temp = df.copy()

    temp["claim_range"] = pd.cut(
        temp["total_claim_amount"],
        bins=bins,
        labels=labels,
        right=False,
    )

    claim_amount_by_class = []

    for label in labels:
        part = temp[temp["claim_range"] == label]

        claim_amount_by_class.append(
            {
                "range": label,
                "normal": int((part["fraud_reported"] == "N").sum()),
                "fraud": int((part["fraud_reported"] == "Y").sum()),
            }
        )

    severity_data = []

    for severity, group in df.groupby("incident_severity"):
        fraud_rate = (group["fraud_reported"] == "Y").mean() * 100

        severity_data.append(
            {
                "severity": severity,
                "fraudRate": round(float(fraud_rate), 1),
                "normalRate": round(float(100 - fraud_rate), 1),
            }
        )

    corr_cols = [
        "age",
        "months_as_customer",
        "policy_annual_premium",
        "total_claim_amount",
        "injury_claim",
        "property_claim",
        "vehicle_claim",
        "witnesses",
    ]

    corr_df = df[corr_cols].copy()

    corr_df["fraud_reported"] = df["fraud_reported"].map(
        {"N": 0, "Y": 1}
    )

    corr = corr_df.corr(numeric_only=True).fillna(0)

    return {
        "fraud_distribution": fraud_distribution,
        "claim_amount_by_class": claim_amount_by_class,
        "fraud_rate_by_severity": severity_data,
        "correlation_features": corr.columns.tolist(),
        "correlation_matrix": corr.round(3).values.tolist(),
    }


@app.get("/metrics")
def metrics():
    preprocessor = model.named_steps["preprocessor"]

    kernels = {
        "Linear SVM": SVC(
            kernel="linear",
            probability=True,
            class_weight="balanced",
        ),
        "Polynomial SVM": SVC(
            kernel="poly",
            probability=True,
            class_weight="balanced",
        ),
        "RBF SVM": SVC(
            kernel="rbf",
            probability=True,
            class_weight="balanced",
        ),
    }

    kernel_results = []
    trained_models = {}

    for name, classifier in kernels.items():
        pipe = Pipeline(
            [
                ("preprocessor", clone(preprocessor)),
                ("classifier", classifier),
            ]
        )

        pipe.fit(X_train, y_train)

        pred = pipe.predict(X_test)
        prob = pipe.predict_proba(X_test)[:, 1]

        result = {
            "kernel": name,
            "accuracy": round(
                float(accuracy_score(y_test, pred)),
                4,
            ),
            "precision": round(
                float(
                    precision_score(
                        y_test,
                        pred,
                        zero_division=0,
                    )
                ),
                4,
            ),
            "recall": round(
                float(
                    recall_score(
                        y_test,
                        pred,
                        zero_division=0,
                    )
                ),
                4,
            ),
            "f1": round(
                float(
                    f1_score(
                        y_test,
                        pred,
                        zero_division=0,
                    )
                ),
                4,
            ),
            "rocAuc": round(
                float(
                    roc_auc_score(
                        y_test,
                        prob,
                    )
                ),
                4,
            ),
        }

        kernel_results.append(result)
        trained_models[name] = pipe

    best_result = max(
    kernel_results,
    key=lambda item: (item["f1"], item["rocAuc"]),
    )

    best_name = best_result["kernel"]
    best_model = trained_models[best_name]

    pred = best_model.predict(X_test)
    prob = best_model.predict_proba(X_test)[:, 1]

    tn, fp, fn, tp = confusion_matrix(
        y_test,
        pred,
    ).ravel()

    fpr, tpr, _ = roc_curve(
        y_test,
        prob,
    )

    roc_points = [
        {
            "fpr": round(float(x), 4),
            "tpr": round(float(y_val), 4),
        }
        for x, y_val in zip(fpr, tpr)
    ]

    return {
        "selected_kernel": best_name,
        "metrics": {
            "accuracy": best_result["accuracy"],
            "precision": best_result["precision"],
            "recall": best_result["recall"],
            "f1": best_result["f1"],
            "rocAuc": best_result["rocAuc"],
        },
        "kernel_metrics": kernel_results,
        "confusion_matrix": {
            "tn": int(tn),
            "fp": int(fp),
            "fn": int(fn),
            "tp": int(tp),
        },
        "roc_curve": roc_points,
        "test_size": int(len(y_test)),
    }