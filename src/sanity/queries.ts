import { defineQuery } from 'groq';

// Preserve a malformed list as a validation failure without projecting its contents.
export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"]{
  _id, _rev, wordmark, contactEmail, footerSignoff, footerMeta, footerColophon,
  "socialLinks": select(socialLinks != null && socialLinks[] == null => false, socialLinks[]{_key, label, href})
}`);

export const HOME_PAGE_QUERY = defineQuery(`{
  "settings": *[_type == "homePage" && _id == "homePage"]{
    _id, _rev, metaAccent, metaMuted, heroLead,
    heroLines[]{_key, runs[]{_key, text, emphasis}},
    primaryCta{label, href}, contactCta{label, href},
    workHeading{eyebrow, title}, archiveLink{label, href},
    aboutHeading{eyebrow, title}, aboutIntro, aboutLink{label, href},
    featuredProjects[]{_key, _ref,
      "project": *[_type == "project" && _id == ^._ref][0]{_id, _rev, title, summary, tags, slug, detailEnabled}
    }
  },
  "order": *[_type == "project"] | order(sortOrder asc, _id asc){_id}
}`);

export const ABOUT_PAGE_QUERY = defineQuery(`*[_type == "aboutPage" && _id == "aboutPage"]{
  _id, _rev, heading, toolkitHeading, approachHeading, lead, biography, facts, skillGroups, principles
}`);

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
