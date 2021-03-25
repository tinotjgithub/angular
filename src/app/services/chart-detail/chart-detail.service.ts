import { Injectable } from '@angular/core';
import { BaseHttpService } from '../base-http.service';
import { CryptoService } from '../crypto-service/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class ChartDetailService {

  constructor(
    private baseHttpService: BaseHttpService,
    private securedStorage: CryptoService
  ) { }

  processedVsAuditedDetails(payload) {
    const role = this.securedStorage.getItem('roleId');
    return this.baseHttpService.post(
      payload,
      `api/resource-dashboard/${
        role === "Manager" ? "manager" : "lead"
      }/claims-processed-vs-audited-grid`
    );
  }

  processedVsAuditedExcel(payload) {
    const role = this.securedStorage.getItem('roleId');
    return this.baseHttpService.getExcel(
      payload,
      `api/resource-dashboard/${
        role === "Manager" ? "manager" : "lead"
      }/claims-processed-vs-audited-report`
    );
  }

  passedVsFailedDetails(payload) {
    return this.baseHttpService.post(payload, 'api/resource-dashboard/lead/audit-graph-grid');
  }

  passedVsFailedExcel(payload) {
    return this.baseHttpService.getExcel(payload, 'api/resource-dashboard/lead/audit-graph-report');
  }

  auditScoreDetails(payload) {
    return this.baseHttpService.post(payload, 'api/resource-dashboard/manager/audit-graph-grid');
  }

  auditScoreExcel(payload) {
    return this.baseHttpService.getExcel(payload, 'api/resource-dashboard/manager/audit-graph-report');
  }

  lowPerformingDetails(payload) {
    const role = this.securedStorage.getItem('roleId');
    return this.baseHttpService.post(payload, `api/resource-dashboard/${
      role === "Manager" ? "manager" : "lead"
    }/low-performing-examiners-grid`);
  }

  lowPerformingExcel(payload) {
    const role = this.securedStorage.getItem('roleId');
    return this.baseHttpService.getExcel(payload, `api/resource-dashboard/${
      role === "Manager" ? "manager" : "lead"
    }/low-performing-examiners-report`);
  }

  highPerformingDetails(payload) {
    const role = this.securedStorage.getItem('roleId');
    return this.baseHttpService.post(payload, `api/resource-dashboard/${
      role === "Manager" ? "manager" : "lead"
    }/high-performing-examiners-grid`);
  }

  highPerformingExcel(payload) {
    const role = this.securedStorage.getItem('roleId');
    return this.baseHttpService.getExcel(payload, `api/resource-dashboard/${
      role === "Manager" ? "manager" : "lead"
    }/high-performing-examiners-report`);
  }

  examinersUnderLeadDetails(payload) {
    return this.baseHttpService.post(payload, 'api/resource-dashboard/manager/lead-count-grid');
  }

  examinersUnderLeadExcel(payload) {
    return this.baseHttpService.getExcel(payload, 'api/resource-dashboard/manager/lead-count-report');
  }

  claimCountByQueueStatusDetails(payload) {
    const role = this.securedStorage.getItem('roleId');
    return this.baseHttpService.post(payload, `api/resource-dashboard/${
      role === "Manager" ? "manager" : "lead"
    }/claim-queue-count-grid`);
  }

  claimCountByQueueStatusExcel(payload) {
    const role = this.securedStorage.getItem('roleId');
    return this.baseHttpService.getExcel(payload, `api/resource-dashboard/${
      role === "Manager" ? "manager" : "lead"
    }/claim-queue-count-report`);
  }

  claimVolumeByAgeDetails(payload, role) {
    return this.baseHttpService.post(payload, `api/resource-dashboard/${role}/claims-age-grid`);
  }

  claimVolumeByAgeExcel(payload, role) {
    return this.baseHttpService.getExcel(payload, `api/resource-dashboard/${role}/claims-age-report`);
  }
}
