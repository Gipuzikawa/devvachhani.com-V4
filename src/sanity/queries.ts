import { defineQuery } from 'groq';

export const WRITING_INDEX_QUERY = defineQuery(`{
  "settings": *[_type == "writingPage" && _id == "writingPage"]{_id, _rev, heading, intro, plannedHeading, planned},
  "articles": *[_type == "article"] | order(publishedAt desc, _id asc){
    _id, _rev, title, slug, dek, publishedAt, category, contentStatus, readingTimeOverride, body
  }
}`);

export const ARTICLE_PAGE_QUERY = defineQuery(`*[_type == "article" && slug.current == $slug]{
  _id, _rev, title, slug, dek, publishedAt, category, contentStatus, readingTimeOverride,
  relatedProject->{_id, title, slug, detailEnabled},
  body[]{..., _type == "figure" => {image{..., "assetId": asset->_id}}}
}`);

export const DISCIPLINES_QUERY = defineQuery(`*[_type == "discipline"] | order(sortOrder asc, _id asc) {
  _id, _rev, sourceKey, label, sortOrder
}`);

export const WORK_ARCHIVE_QUERY = defineQuery(`{
  "settings": *[_type == "workPage" && _id == "workPage"]{_id, _rev, heading, intro, allLabel, rowsLabel, gridLabel},
  "disciplines": *[_type == "discipline"] | order(sortOrder asc, _id asc){_id, _rev, label, sourceKey},
  "projects": *[_type == "project"] | order(sortOrder asc, _id asc){
    _id, _rev, title, summary, year, tags, slug, detailEnabled, contentStatus,
    "disciplineIds": disciplines[]._ref
  }
}`);

export const PROJECT_PAGE_QUERY = defineQuery(`{
  "order": *[_type == "project"] | order(sortOrder asc, _id asc){_id},
  "projects": *[_type == "project" && slug.current == $slug && detailEnabled == true]{
    _id, _rev, title, summary, year, slug, contentStatus, detailEnabled,
    detail{...,
      milestones[]{..., figure{..., image{..., "assetId": asset->_id}}},
      finalFigure{..., image{..., "assetId": asset->_id}}
    }
  }
}`);
