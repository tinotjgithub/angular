import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    // Role Check Goes Here
    const isChildRolesAvailable = route.data.expectedChildRoles;
    return isChildRolesAvailable ? route.data.expectedRoles.includes(this.authService.userRole)
    && route.data.expectedChildRoles.includes(this.authService.userRole) : route.data.expectedRoles.includes(this.authService.userRole);
  }
}
