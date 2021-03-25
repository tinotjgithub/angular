import { Injectable } from "@angular/core";
import { NotifierService } from "./notifier.service";
import {
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { AuthenticationService } from "../modules/authentication/services/authentication.service";
import { MessageService } from "primeng/api";
import { APP_CONFIG } from './config/config.service';

@Injectable({
  providedIn: "root"
})
export class ErrorInterceptorService {
  constructor(
    private notifierServices: NotifierService,
    private authService: AuthenticationService,
    private messageService: MessageService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((resp: HttpErrorResponse) => {
        if (resp.status === 440) {
          this.authService.logout();
        }
        let errorMessage = "An unknown error occurred!";
        if (resp.url === `${APP_CONFIG.HEALTH_EDGEURL}${"/openClaim"}`) {
          errorMessage =
            "Health Insurance Application Is Unavailable. Please Open the Application and Proceed!";
        }
        if (resp.status === 440) {
          this.authService.clearSessions();
        }
        const isBlob = resp.error instanceof Blob;
        if ((isBlob && resp.status === 500)||(isBlob && resp.status === 401)) {
          return throwError(resp);
        }
        if (!isBlob && resp.status !== 307) {
          const { message, errors } = resp.error;
          let showError = true;
          if (message) {
            errorMessage = resp.error.message;
          }
          if (errors && errors.length > 0) {
            showError = false;
            const errorNotifications = errors.map(e => {
              return {
                key: "errorKey",
                severity: "error",
                summary: e.field || "Error",
                detail: `${e.defaultMessage}`
              };
            });
            this.notifierServices.throwAllNotification(errorNotifications);
          }
          if (
            req.url.indexOf("token/authenticate") === -1 &&
            req.url.indexOf("saml/authorize") === -1 &&
            req.url.indexOf("saml/login") === -1 &&
            !req.headers.get("showerror") &&
            showError
          ) {
            this.notifierServices.throwNotification({
              type: "error",
              message: errorMessage
            });
          }
        } else if (
          resp instanceof HttpErrorResponse &&
          resp.error instanceof Blob &&
          resp.error.type === "application/json"
        ) {
          return new Promise<any>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e: Event) => {
              try {
                const msg = JSON.parse((e.target as any).result);
                this.notifierServices.throwNotification({
                  type: "error",
                  message: msg.message
                });
              } catch (err) {
                reject(resp);
              }
            };
            reader.onerror = () => {
              reject(resp);
            };
            reader.readAsText(resp.error);
          });
        }
        return throwError(resp);
      })
    );
  }
}
