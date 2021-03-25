import { Injectable } from "@angular/core";
import { BaseHttpService } from "../base-http.service";

@Injectable({
  providedIn: "root"
})
export class ConfigurationService {
  constructor(private http: BaseHttpService) {}

  sendNotification(payload) {
      return this.http.post(payload, 'api/maintenance-notification/save');
  }

  deleteNotification(payload) {
      return this.http.post(payload, 'api/maintenance-notification/delete');
  }

  cancelNotification(payload) {
      return this.http.post(payload, 'api/maintenance-notification/cancel');
  }

  sendNow(payload) {
    return this.http.post(payload, 'api/maintenance-notification/send');
  }

  getSavedNotification() {
    return this.http.get('api/maintenance-notification/fetch');
  }

  getNotificationForBell() {
    return this.http.get('api/notification/fetch');
  }

  updateNotification(payload) {
    return this.http.post(payload, 'api/notification/updateView');
  }
}
