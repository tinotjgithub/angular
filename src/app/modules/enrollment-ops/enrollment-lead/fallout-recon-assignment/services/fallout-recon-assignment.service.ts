import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { NotifierService } from "src/app/services/notifier.service";
import { APP_CONFIG } from "src/app/services/config/config.service";

@Injectable({
  providedIn: "root"
})
export class FalloutReconAssignmentService extends BaseHttpService {
  fileTypeResponse: any;
  fileTypesSub = new Subject<any>();
  constructor(
    private http: HttpClient,
    private messageService: NotifierService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_SERVER_URL);
  }

  getWorkCategories() {
    return this.get("api/enrollment/file/upload/work-category");
  }

  getErrorRecords(fileMetadataId) {
    return this.get(
      `api/enrollment/file/upload/error/records?fileMetadataId=${fileMetadataId}`
    );
  }

  getLoadingStatusAgainstWorkCategory(workCategory) {
    return this.post(
      { workCategory },
      "api/enrollment/file/upload/current/upload/status"
    );
  }

  uploadFile(payload) {
    return this.post(payload, "api/enrollment/file/upload/general-queue");
  }

  getGridDetails(payload) {
    return this.post(payload, "api/enrollment/file/upload/success/records");
  }

  saveDetails(payload, isRoute?: boolean) {
    return this.post(
      payload,
      `api/enrollment/lead${isRoute ? '-route' : ''}/assign-to-enrol-specialists`
    );
  }

  downloadAttachment(fileMetadataId) {
    return this.getBlob(
      `api/enrollment/file/upload/download/error/records?fileMetadataId=${fileMetadataId}`
    );
  }

  getUsergrpAndItsSpecialists(reqBody, isRoute?: boolean) {
    return this.post(reqBody, `api/enrollment/lead${isRoute ? '-route' : ''}/get-user-group-specialists`);
  }

  getPriorityLevels() {
    return this.get("api/enrollment/lead/get-priority-levels");
  }

  checkEnrollSubscriptions(reqBody, isRoute?: boolean) {
    return this.post(reqBody, `api/enrollment/lead${isRoute ? '-route' : ''}/check-enrol-subscriptions`);
  }

  downloadFile(fileId, fileName) {
    this.downloadAttachment(fileId).subscribe(res => {
      const responseBody = res.body;
      const blob = new Blob([responseBody]);
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
      this.messageService.throwNotification({
        type: "warning",
        message: "Error Report is being downloaded..."
      });
    });
  }
}
