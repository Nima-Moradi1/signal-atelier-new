import { sectionHeadingClassNames as styles } from "./section-heading.class-names";

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
    <header className={styles.root}>
      <div className={styles.meta}>
        <span className={styles.index} aria-hidden="true">
          {index}
        </span>
        <p className="text-lg">{eyebrow}</p>
      </div>
      <div className={styles.copy}>
        <h2 className={styles.title} id={id}>
          {title}
        </h2>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </div>
    </header>
  );
}
