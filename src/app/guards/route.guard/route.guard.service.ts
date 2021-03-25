import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable, Subject } from "rxjs";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";

@Injectable()
export class RouteGuard implements CanActivate {
  authToken: string;
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

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    this.authService.checkRoleEdited();
    if (this.authService.checkIsAuthenticated()) {
      // && !this.authService.isTokenExpired() - Removing it for the time being
      return true;
    } else {
      localStorage.clear();
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
