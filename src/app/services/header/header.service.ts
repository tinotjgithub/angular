import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class HeaderService {
  openSideMenu = false;
  private menuClickedSubj = new  Subject<boolean>();
  private claimDetails: Subject<any> = new Subject();
  public $claimDetails = this.claimDetails.asObservable();
  private auditClaimDetails: Subject<any> = new Subject();
  public $auditClaimDetails = this.auditClaimDetails.asObservable();

  constructor() {}

  setSideMenuAction(value) {
    this.openSideMenu = value;
    this.menuClickedSubj.next(this.openSideMenu);
  }

  sideMenuClickedListener() {
    return this.menuClickedSubj.asObservable();
  }

  updateClaimDetails(claimDetail) {
    this.claimDetails.next(claimDetail);
  }

  updateAuditClaimDetails(auditClaimDetails) {
    this.auditClaimDetails.next(auditClaimDetails);
  }
}
