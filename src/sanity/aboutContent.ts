type Fields = Record<string, unknown>;
function fields(value: unknown): Fields {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Fields : {};
}

// Keep usable parts of an unfinished draft visible and label each missing field.
export function readAbout(raw: unknown) {
  const page = fields(raw);
  const gaps: string[] = [];
  function missing(label: string) {
    gaps.push(label);
    return `[Missing ${label}]`;
  }
  function text(value: unknown, label: string) {
    return typeof value === 'string' && value.trim() ? value : missing(label);
  }
  function list(value: unknown, label: string): unknown[] {
    if (Array.isArray(value) && value.length) return value;
    missing(label);
    return [];
  }
  function objects(value: unknown, label: string) {
    const keys = new Set<string>();
    return list(value, label).map((item, i) => {
      const row = fields(item);
      const key = row._key;
      if (typeof key === 'string' && key.trim() && !keys.has(key)) {
        keys.add(key);
        return { row, key };
      }
      missing(`${label} ${i + 1} unique key`);
      return { row, key: `missing:${i}` };
    });
  }
  function heading(name: string) {
    const h = fields(page[name]);
    return { eyebrow: text(h.eyebrow, name + ' eyebrow'), title: text(h.title, name + ' title') };
  }
  const facts = objects(page.facts, 'facts').map(({ row, key }) => ({
    key, label: text(row.label, 'fact label'), value: text(row.value, 'fact value'),
    emphasized: row.emphasized === true, showOnHome: row.showOnHome === true,
  }));
  return {
    heading: heading('heading'), toolkitHeading: heading('toolkitHeading'), approachHeading: heading('approachHeading'),
    lead: text(page.lead, 'lead'), biography: list(page.biography, 'biography').map(p => text(p, 'biography paragraph')),
    facts, skillGroups: objects(page.skillGroups, 'skill groups').map(({ row, key }) => ({
      key, label: text(row.label, 'skill group label'), tags: list(row.items, 'skills').map(t => text(t, 'skill')),
    })),
    principles: objects(page.principles, 'principles').map(({ row, key }) => ({
      key, title: text(row.title, 'principle title'), body: text(row.body, 'principle body'),
    })), gaps,
  };
}
