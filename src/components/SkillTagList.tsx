type Props = {
  items: string[];
  grouped?: boolean;
};

const CATEGORY_MAP: Record<string, string[]> = {
  "Langages & Frameworks": ["C#", ".NET", "ASP.NET Core", "Web API", "TypeScript", "JavaScript", "Entity Framework", "Angular", "Entity Framework"],
  "Bases de données": ["SQL Server", "PostgreSQL", "MySQL", "MongoDB", "Cosmos DB"],
  "Cloud & DevOps": ["Azure Cloud", "Azure DevOps", "Git", "CI/CD", "TFS", "Google Cloud"],
};

function categorize(items: string[]): Array<{ label: string; tags: string[] }> {
  const used = new Set<string>();
  const groups: Array<{ label: string; tags: string[] }> = [];

  for (const [label, known] of Object.entries(CATEGORY_MAP)) {
    const matched = items.filter((item) => known.some((k) => item.includes(k)));
    if (matched.length) {
      matched.forEach((t) => used.add(t));
      groups.push({ label, tags: matched });
    }
  }

  const rest = items.filter((item) => !used.has(item));
  if (rest.length) groups.push({ label: "Autres", tags: rest });

  return groups;
}

export function SkillTagList({ items, grouped = true }: Props) {
  if (!grouped) {
    return (
      <div className="skill-tags">
        {items.map((item) => (
          <span key={item} className="skill-tags__item">
            {item}
          </span>
        ))}
      </div>
    );
  }

  const groups = categorize(items);

  if (groups.length <= 1) {
    return (
      <div className="skill-tags">
        {items.map((item) => (
          <span key={item} className="skill-tags__item">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="skill-groups">
      {groups.map((group, i) => (
        <div key={group.label} className="skill-group">
          <p className="skill-group__label">{group.label}</p>
          <div className="skill-tags">
            {group.tags.map((item) => (
              <span key={item} className={`skill-tags__item skill-tags__item--cat${(i % 3) + 1}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
