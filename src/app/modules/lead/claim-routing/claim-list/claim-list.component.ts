import { Component, OnInit } from "@angular/core";
import { ClaimRoutingService } from "../claim-routing.service";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { NotifierService } from "src/app/services/notifier.service";

@Component({
  selector: "app-claim-list",
  templateUrl: "./claim-list.component.html"
})
export class ClaimListComponent implements OnInit {
  routedClaimList: any = [];
  cols: { field: string; header: string }[];
  numberOfClaims: any = 0;
  public openEdit: boolean;
  public editData: any;
  public isClient: any;
  constructor(
    private claimRoutingService: ClaimRoutingService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private taskManagementService: TaskmanagementService,
    private toastService: NotifierService
  ) {}

  ngOnInit() {
    this.getRoutedClaims();
    // this.carService.getCarsSmall().then(cars => this.cars = cars);

    this.cols = [
      { field: "claimId", header: "Claim ID" },
      { field: "status", header: "PROMT Status" },
      { field: "receivedDate", header: "Received Date" },
      { field: "age", header: "Claim Age (In Days)" },
      { field: "queueName", header: "Queue Name" },
      { field: "routeFrom", header: "Route From" },
      { field: "routeDate", header: "Route Date" },
      { field: "routeReason", header: "Route Reason" },
      { field: "comments", header: "Comments" }
    ];
  }

  selectedCol(col, colValue, row) {
    if (col.field === "claimId") {
      this.confirmAndNavigate(row.claimId);
    }
  }

  confirmAndNavigate(val) {
    this.copyAndOpenHRP(val);
  }

  copyAndOpenHRP(val) {
    this.copyToClipBoard(val);
    this.openHealthEdgeApp();
  }

  copyToClipBoard(val) {
    const input = document.createElement("input");
    input.setAttribute("value", val);
    document.body.appendChild(input);
    input.select();
    const result = document.execCommand("copy");
    document.body.removeChild(input);
    return result;
  }

  openHealthEdgeApp() {
    this.taskManagementService.callHealthEdge().subscribe(res => {
      if (res.status === "Failure") {
        this.toastService.throwNotification({
          type: "error",
          message: res.message
        });
      }
    });
  }

  getRoutedClaims() {
    this.claimRoutingService.getRoutedList();
    this.routedClaimList = this.claimRoutingService.getRoutedClaimList;
    this.claimRoutingService
      .routedClaimListListener()
      .subscribe(routedClaimList => {
        this.routedClaimList = routedClaimList;
        this.numberOfClaims = this.routedClaimList.length;
      });
  }

  onRowEditInit(data, isClient?) {
    /* this.router.navigate(["/ClaimRouting/RouteMyClaim"], {
      queryParams: data,
      skipLocationChange: true
    }); */
    this.openEdit = true;
    this.isClient = isClient;
    this.editData = data;
  }

  getOptions(col) {
    const data: any[] =
    this.routedClaimList && this.routedClaimList.length > 0
        ? this.routedClaimList.map((c) => c[col.field]).filter((val, i, self) => val && self.indexOf(val) === i)
        : [];
    return data;
  }
}
