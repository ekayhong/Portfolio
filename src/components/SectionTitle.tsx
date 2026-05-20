type Props = {
  title: string;
  subtitle?: string;
};

export function SectionTitle({ title, subtitle }: Props) {
  return (
    <div className="section-title">
      <h2 className="section-title__title">{title}</h2>
      {subtitle ? <p className="section-title__subtitle">{subtitle}</p> : null}
    </div>
  );
}
