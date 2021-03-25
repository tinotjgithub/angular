import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class NotifierService {
  notifierListener = new Subject<{ type: string; message: string }>();
  notifierAllListener = new Subject<[{ type: string; message: string }]>();

  getNotifierListener() {
    return this.notifierListener.asObservable();
  }

  getNotifierAllListener() {
    return this.notifierAllListener.asObservable();
  }

  throwNotification(notification) {
    this.notifierListener.next({
      type: notification.type,
      message: notification.message
    });
  }

  throwAllNotification(notifications) {
    this.notifierAllListener.next(notifications);
  }

  notifierDismiss() {
    this.notifierListener.next(null);
  }
}
