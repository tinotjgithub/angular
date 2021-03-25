import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { ManualSamplingService } from "src/app/modules/auditor/manual-sampling/services/manual-sampling.service";
import { EnrollmentManualSamplingService } from "src/app/modules/enrollment-manual-sampling/services/enrollment-manual-sampling.service";

@Injectable({
  providedIn: "root"
})
export class NavigationGuard implements CanActivate {
  constructor(
    private samplingService: ManualSamplingService,
    private enrollmentSamplingService: EnrollmentManualSamplingService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      this.samplingService.navigationEnabled ||
      this.enrollmentSamplingService.navigationEnabled
    ) {
      return true;
    } else {
      this.router.navigateByUrl("");
    }
  }
}
