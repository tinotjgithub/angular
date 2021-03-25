import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable, Subject } from "rxjs";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { CryptoService } from "../crypto-service/crypto.service";

@Injectable()
export class RouteGuard implements CanActivate {
  authToken: string;
  expiresIn: Date;
  roleId: string;
  authUpdated = new Subject<any>();
  isAuthenticated: boolean;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private secureLocalStorage: CryptoService
  ) {
    this.isAuthenticated = this.secureLocalStorage.getItem("authToken")
      ? true
      : false;
  }

  authUpdatedListener() {
    return this.authUpdated.asObservable();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    this.authService.checkRoleEdited();
    if (this.authService.checkIsAuthenticated()) {
      return true;
    } else {
      localStorage.removeItem("authToken");
      this.isAuthenticated = false;
      this.authToken = null;
      this.roleId = null;
      this.authUpdated.next({
        isAuthenticated: false,
        authToken: null,
        roleId: null
      });
      this.router.navigateByUrl("");
    }
  }
}
