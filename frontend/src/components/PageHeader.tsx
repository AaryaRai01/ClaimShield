interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">{title}</h2>
      <p className="text-sm text-navy-500 mt-1">{subtitle}</p>
    </div>
  );
}
