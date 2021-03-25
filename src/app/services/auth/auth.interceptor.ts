import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { CryptoService } from "../crypto-service/crypto.service";
import { NO_AUTH_URL } from 'src/app/shared/constants.js';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private secureLocalStorage: CryptoService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!(this.secureLocalStorage.getItem("isReset"))) {
      this.authService.checkRoleEdited();
    }
    const headers = this.checkURL(req.url) ? req.headers : req.headers.set(
      "Authorization",
      this.secureLocalStorage.getItem("authToken")
        ? "Bearer " + this.secureLocalStorage.getItem("authToken")
        : ""
    );
    const authRequest = req.clone({ headers });
    return next.handle(authRequest);
  }

  checkURL(url: string) {
    const array: any[] = NO_AUTH_URL;
    const filtered = array.filter(e => url.indexOf(e) !== -1);
    return filtered.length > 0;
  }
}
