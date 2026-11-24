import { discipline } from './documents/discipline';
import { project } from './documents/project';
import { workPage } from './documents/workPage';
import { article } from './documents/article';
import { writingPage } from './documents/writingPage';
import { articleBody, articleHeading, articleParagraph, pullQuote, plannedWriting } from './objects/articleBody';
import { sectionHeading, figure, toolGroup, projectMilestone, specification, reflections, projectDetail } from './objects/projectContent';
export const schemaTypes = [discipline, project, workPage, article, writingPage, articleBody, articleHeading, articleParagraph, pullQuote, plannedWriting, sectionHeading, figure, toolGroup, projectMilestone, specification, reflections, projectDetail];
