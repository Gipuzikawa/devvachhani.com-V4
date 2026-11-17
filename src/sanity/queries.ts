import { defineQuery } from 'groq';

export const DISCIPLINES_QUERY = defineQuery(`*[_type == "discipline"] | order(sortOrder asc, _id asc) {
  _id, _rev, sourceKey, label, sortOrder
}`);
