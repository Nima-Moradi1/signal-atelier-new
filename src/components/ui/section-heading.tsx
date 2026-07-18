type SectionHeadingProps = {
  id?: string;
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <div className="section-heading__meta">
        <span aria-hidden="true">{index}</span>
        <p>{eyebrow}</p>
      </div>
      <div className="section-heading__copy">
        <h2 id={id}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </header>
  );
}
