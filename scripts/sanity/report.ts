import type { ImportReport } from './import';
export function summarize(report: ImportReport) {
  return { phase: report.phase, dataset: report.dataset, mode: report.mode,
    creates: report.rows.filter(row => row.action === 'create').length,
    skips: report.rows.filter(row => row.action === 'skip').length,
    updates: report.rows.filter(row => row.action === 'update').length,
    differences: report.rows.filter(row => row.differs).map(row => row.sourceKey),
    rows: report.rows };
}
