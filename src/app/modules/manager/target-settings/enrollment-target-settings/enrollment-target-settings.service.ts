import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseHttpService } from "src/app/services/base-http.service";
import { APP_CONFIG } from "src/app/services/config/config.service";
import { NotifierService } from "./../../../../services/notifier.service";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class EnrollmentTargetSettingsService extends BaseHttpService {
  constructor(
    private http: HttpClient,
    private messageService: NotifierService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.ENROLLMENT_SERVER_URL);
  }

  getEnrollmentTargetResponse: any;
  getEnrollmentTargetSub = new Subject<any>();

  getEnrollmentTargetListner() {
    return this.getEnrollmentTargetSub.asObservable();
  }

  getEnrollmentTarget() {
    this.get("api/enrollment/manager-configuration/allTargetSettings").subscribe(
      data => {
        this.getEnrollmentTargetResponse = data;
        this.getEnrollmentTargetSub.next(this.getEnrollmentTargetResponse);
      },
      error => {
        this.getEnrollmentTargetResponse = [];
        return;
      }
    );
  }

  saveQualityTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.post(
        TargetSettingsDetails,
        "api/enrollment/manager-configuration/saveQualityScoreSettings"
      )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target saved successfully!"
          });
          this.getEnrollmentTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateQualityTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.post(
        TargetSettingsDetails,
        "api/enrollment/manager-configuration/updateQualityScoreSettings"
      )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target saved successfully!"
          });
          this.getEnrollmentTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  saveProductivityTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.post(
        TargetSettingsDetails,
        "api/enrollment/manager-configuration/saveProductivitySettings"
      )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target saved successfully!"
          });
          this.getEnrollmentTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateProductivityTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.post(
        TargetSettingsDetails,
        "api/enrollment/manager-configuration/updateProductivitySettings"
      )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target saved successfully!"
          });
          this.getEnrollmentTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  saveSpecialistWorkingTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.post(
        TargetSettingsDetails,
        "api/enrollment/manager-configuration/saveSpecialistTargetSettings"
      )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target saved successfully!"
          });
          this.getEnrollmentTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateSpecialistWorkingTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.post(
        TargetSettingsDetails,
        "api/enrollment/manager-configuration/updateSpecialistTargetSettings"
      )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target saved successfully!"
          });
          this.getEnrollmentTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  saveAuditorWorkingTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.post(
        TargetSettingsDetails,
        "api/enrollment/manager-configuration/saveAuditorTargetSettings"
      )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target saved successfully!"
          });
          this.getEnrollmentTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  updateAuditorWorkingTargetScore(TargetSettingsDetails) {
    const promise = new Promise((resolve, reject) => {
      this.post(
        TargetSettingsDetails,
        "api/enrollment/manager-configuration/updateAuditorTargetSettings"
      )
        .toPromise()
        .then(data => {
          this.messageService.throwNotification({
            type: "success",
            message: "Target saved successfully!"
          });
          this.getEnrollmentTarget();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }
}
