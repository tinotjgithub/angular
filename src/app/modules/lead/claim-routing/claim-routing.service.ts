import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";
import { AuthenticationService } from "../../authentication/services/authentication.service";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ClaimRoutingService {
  private routedClaimSub = new Subject<any>();
  private routedClaimList: [];

  constructor(
    private http: BaseHttpService,
    private authService: AuthenticationService
  ) {}

  routedClaimListListener() {
    return this.routedClaimSub.asObservable();
  }

  getRoutedList() {
    const urlSegment = "api/claim/lead/list/routed-in";
    this.http.get(urlSegment, this.authService.currentUserId).subscribe(res => {
      this.routedClaimList = res;
      this.routedClaimSub.next(res);
    });
  }

  getRouteReasons() {
    return this.http.get("api/claim/lead/route/reasons");
  }

  get getRoutedClaimList() {
    return this.routedClaimList;
  }

  route(param, isClient?) {
    const urlSegment = isClient ? "api/claim/lead/client-vendor-queue" : "api/claim/lead/route";
    const promise = new Promise((resolve, reject) => {
      this.http
        .post(param, urlSegment)
        .toPromise()
        .then(data => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }
}
