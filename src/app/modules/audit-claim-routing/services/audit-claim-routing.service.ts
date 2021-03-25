import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { AuthenticationService } from "../../authentication/services/authentication.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ROLES } from "src/app/shared/constants.js";
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Injectable({
  providedIn: "root"
})
export class AuditClaimRoutingService extends BaseHttpService {
  private routedInClaimSub = new Subject<any>();
  private routeReasonsSub = new Subject<any>();
  public routeReasonList: any;
  public routedInClaimList: any;
  public reassignedRouteReasonResponse: any;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.AUDITOR_SERVER_URL);
  }

  routedInClaimListListener() {
    return this.routedInClaimSub.asObservable();
  }

  getManagerLeadRouteReasonsListner() {
    return this.routeReasonsSub.asObservable();
  }

  getRoutedInList() {
    const urlSegment = "api/claims-audit/routed-in-claim-details";
    return this.get(urlSegment, this.authService.currentUserId).subscribe(
      res => {
        this.routedInClaimList = res;
        this.routedInClaimSub.next(res);
      }
    );
  }

  getAuditRoutedInClaim(auditTaskId) {
    let url;
    if (auditTaskId) {
      url = (this.authService.userRole === ROLES.manager
        ? "api/audit/manager-lead-route-to/manager-claim-from-grid"
        : "api/audit/manager-lead-route-to/lead-claim-from-grid"
      ).concat("?auditTaskId=" + auditTaskId);
    } else {
      url =
        this.authService.userRole === ROLES.manager
          ? "api/audit/manager-lead-route-to/manager/claim"
          : "api/audit/manager-lead-route-to/lead/claim";
    }
    return this.get(url);
  }

  getManagerLeadRouteReasons() {
    const urlSegment = "api/claims-audit/route/reasons";
    return this.get(urlSegment).subscribe(res => {
      this.routeReasonList = res;
      this.routeReasonsSub.next(res);
    });
  }

  routeAuditRoutedInClaim(param) {
    const url = "api/audit/manager-lead-route-to/route";
    return this.post(param, url);
  }

  cancelAuditTaskId(auditTaskId) {
    return this.get(
      "api/audit/manager-lead-route-to/cancel?auditTaskId=" + auditTaskId
    );
  }
}
