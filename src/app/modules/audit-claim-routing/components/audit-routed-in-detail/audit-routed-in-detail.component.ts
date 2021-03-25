import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectorRef
} from "@angular/core";
import { AuditClaimRoutingService } from "./../../services/audit-claim-routing.service";
import { Router } from "@angular/router";
import { Table } from "primeng/table";
import { RoutedInClaims } from "./../../../../services/task-management/models/AuditRoutedIn";
import { ConfirmationService } from "primeng/api";
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';

@Component({
  selector: "app-audit-routed-in-detail",
  templateUrl: "./audit-routed-in-detail.component.html",
  providers: [ConfirmationService]
})
export class AuditRoutedInDetailComponent implements OnInit {
  @ViewChild("claimsTable", { static: false }) claimsTable: Table;
  @Input() ngSwitch;
  cols: { field: string; header: string }[];
  numberOfClaims: any = 0;
  public routeReasonOptions: Array<any> = [];
  roleId = "";
  selectedStatus: any;
  public routedClaimList: RoutedInClaims[];
  claimListLoaded: RoutedInClaims[];
  public routeReasonList: Array<{
    routeReasonCode: number;
    routeReason: string;
  }> = [];
  public routeReasonOption: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private auditClaimRoutingService: AuditClaimRoutingService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private secureLocalStorage: CryptoService
  ) {}

  ngOnInit() {
    this.roleId = this.secureLocalStorage.getItem("roleId");
    this.getColumns();
    this.getManagerRouteReasons();
  }

  getColumns() {
    this.cols = [
      { field: "claimId", header: "Claim ID" },
      { field: "routeType", header: "Route Type" },
      { field: "processedDate", header: "Processed Date" },
      { field: "claimsAge", header: "Claim Age (In Days)" },
      { field: "queueName", header: "Queue Name" },
      { field: "fullName", header: "Full Name" },
      { field: "receiptDate", header: "Receipt Date" },
      { field: "routeReason", header: "Route Reason" },
      { field: "claimType", header: "Claim Type" },
      { field: "claimStatus", header: "Claim Status" }
    ];
  }

  tableFilter(claimsTable, value, field, matchMode) {
    claimsTable.filter(value, field, matchMode);
  }

  getManagerRouteReasons() {
    this.auditClaimRoutingService.getManagerLeadRouteReasons();
    this.routeReasonList = this.auditClaimRoutingService.routedInClaimList;
    this.auditClaimRoutingService
      .getManagerLeadRouteReasonsListner()
      .subscribe(data => {
        this.routeReasonList = data;
        this.mapRouteReasons();
      });
    this.getRoutedClaims();
  }

  mapRouteReasons() {
    this.routeReasonOptions = [];
    this.routeReasonOptions.push({ label: "All", value: null });
    if (this.routeReasonList) {
      this.routeReasonList.forEach(s => {
        this.routeReasonOptions.push({
          label: s.routeReason.trim().toString(),
          value: s.routeReason.toString()
        });
      });
    }
  }

  getRoutedClaims() {
    this.auditClaimRoutingService.getRoutedInList();
    this.routedClaimList = this.auditClaimRoutingService.routedInClaimList;
    this.auditClaimRoutingService
      .routedInClaimListListener()
      .subscribe(routedClaimList => {
        this.routedClaimList = routedClaimList;
        this.numberOfClaims = this.routedClaimList.length;
      });
  }

  onRowEditInit(data) {
    this.router.navigate(["/ClaimRouting/RouteMyClaim"], {
      queryParams: data,
      skipLocationChange: true
    });
  }
}
