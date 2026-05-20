import type { Experience } from "@/content/profile";

type Props = { items: Experience[] };

export function ExperienceList({ items }: Props) {
  return (
    <div className="exp-list">
      {items.map((exp, i) => (
        <article key={`${exp.company}-${exp.period}`} className="exp-item">
          <span className="exp-item__num">0{i + 1}</span>
          <div className="exp-item__body">
            <div className="exp-item__head">
              <h3 className="exp-item__company">{exp.company}</h3>
              <span className="exp-item__period">{exp.period} · {exp.location}</span>
            </div>
            <p className="exp-item__role">{exp.roleTitle}</p>
            <p className="exp-item__context">{exp.context}</p>
            <ul className="exp-item__list">
              {exp.roleScope.map((item) => <li key={item}>{item}</li>)}
            </ul>
            {exp.results.length ? (
              <ul className="exp-item__list exp-item__list--results">
                {exp.results.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : null}
            {exp.projectNotes?.length ? (
              <p className="detail-line" style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
                {exp.projectNotes.join(" ")}
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
