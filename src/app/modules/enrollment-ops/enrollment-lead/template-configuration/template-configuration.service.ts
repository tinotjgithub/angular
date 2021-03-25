import { NotifierService } from "./../../../../services/notifier.service";

import { HttpClient } from "@angular/common/http";
import { HeaderService } from "./../../../../services/header/header.service";
import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { Subject } from "rxjs";
import { APP_CONFIG } from "src/app/services/config/config.service";

@Injectable({
  providedIn: "root"
})
export class TemplateConfigurationService extends BaseHttpService {
  workFlowRoleSub = new Subject<any>();
  auditorAuditResponse: any;
  auditorQualityResponse: any;
  public auditorClaimsAuditedFetch = new Subject<any>();
  auditorFinScoreResponse: any;
  auditorCategoryResponse: any;
  auditorAuditStatusFetch = new Subject<any>();
  auditorQualityScoreFetch = new Subject<any>();
  auditorCategoryFetch = new Subject<any>();
  workFlowRoleResponse: any;
  constructor(
    private http: HttpClient,
    private htp: BaseHttpService,
    private baseHttpService: BaseHttpService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_SERVER_URL);
  }

  getAllUsers() {
    const apiUrl = "api/enrollment/template/list";
    return this.get(apiUrl);
  }

  createTemplate(paylod) {
    const apiUrl = "api/enrollment/template/create";
    return this.post(paylod, apiUrl);
  }

  updateTemplate(paylod) {
    const apiUrl = "api/enrollment/template/update";
    return this.post(paylod, apiUrl);
  }

  uploadFileCreate(file) {
    const apiUrl = "api/enrollment/template/headers";
    return this.post(file, apiUrl);
  }
  getWorkCategory() {
    const apiUrl = "api/enrollment/file/upload/work-category";
    return this.get(apiUrl);
  }

  deleteTemplate(id) {
    return this.get(`api/enrollment/template/delete?templateId=${id}`);
  }

  checkFileUpload(templateId) {
    const apiUrl = `api/enrollment/template/file/upload/status?templateId=${templateId}`;
    return this.get(apiUrl);
  }

  downloadAttachment(fileId) {
    return this.getBlob(`api/file/download/attachment?fileId=${fileId}`);
  }
}
