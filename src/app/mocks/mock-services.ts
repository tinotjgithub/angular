import { of } from 'rxjs';
import { ReportService } from '../services/report/report.service';

export class MockReportService extends ReportService {
  getUserGrps() {
    return of([]);
  }
}