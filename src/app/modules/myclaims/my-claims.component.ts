import { Component, OnInit, Input, ViewChild, OnDestroy } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Table } from "primeng/table";
import { MyClaims } from "src/app/services/task-management/models/MyClaims";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { AuditorService } from "src/app/services/auditor/auditor.service";

@Component({
  selector: "app-my-claims",
  templateUrl: "./my-claims.component.html",
  providers: [ConfirmationService]
})
export class MyClaimsComponent implements OnInit, OnDestroy {
  @ViewChild("claimsTable", { static: false }) claimsTable: Table;
  @Input() ngSwitch;
  private statusSubscription: Subscription = new Subscription();
  private fieldSubscription: Subscription = new Subscription();
  public claimList: MyClaims[];
  public pendReasonList: Array<{
    pendReasonCode: number;
    pendReason: string;
  }> = [];
  public routeReasonList: Array<{
    routeReasonCode: number;
    routeReason: string;
  }> = [];
  cols = [];
  public status = [];
  public auditStatus = [
    { label: "All", value: null },
    { label: "Pended", value: "Pended" },
    { label: "Failed", value: "Failed" }
  ];
  public pendReason: Array<any> = [];
  public routeReason: Array<any> = [];
  filteredValues = [];
  FilterBy: string;
  auditFailedCols: { field: string; header: string }[];
  auditFailedData: any;
  reviewRebuttalCols: { field: string; header: string }[];
  reviewRebuttalData: any;
  assignedCols: { field: string; header: string }[];
  constructor(
    private taskManagementService: TaskmanagementService,
    private notifierService: NotifierService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    public datePipe: DatePipe,
    private auditorService: AuditorService
  ) {}

  ngOnInit() {
    this.FilterBy = this.route.snapshot.queryParamMap.get("FilterBy");
    if (this.FilterBy === "AuditFailed") {
      this.getAuditFailedClaimsCols();
      this.getAuditFailedLsit();
    } else if (this.FilterBy === "ReviewRebut") {
      this.getReviewRebuttalCols();
      this.getReviewRebuttalList();
    } else if (this.FilterBy === "Assigned") {
      this.getAssignedCols();
      this.getAssignedLsit();
    } else {
      this.getDetailsByFilterType(this.FilterBy);
    }
  }

  getAssignedCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID" },
      { field: "assignType", header: "Assigned Type" },
      { field: "assignedDate", header: "Assigned Date" },
      { field: "claimType", header: "Claim Type" },
      { field: "claimStatus", header: "Claim Status" },
      { field: "claimAge", header: "Claim Age (In Days)" },
      { field: "billedAmount", header: "Billed Amount ($)" },
      { field: "allowedAmount", header: "Allowed Amount ($)" },
      { field: "paidAmount", header: "Paid Amount ($)" },
      { field: "providerName", header: "Provider Name" },
      { field: "memberGroupName", header: "Member Group Name" },
      { field: "processedDate", header: "Processed Date" },
      { field: "userGroupName", header: "User Group Name" }
    ];
  }

  getAssignedLsit() {
    this.taskManagementService.getAssignedDetails().subscribe(res => {
      this.claimList = res;
    });
  }

  getDetailsByFilterType(filter) {
    switch (filter) {
      case "Pended":
        this.getPendReasons();
        this.cols = this.getPendedCols();
        this.getClaimList("pended");
        break;
      case "Completed":
        this.cols = this.getCompletedCols();
        this.getClaimList("completed");
        break;
      case "Routed In":
        this.getRouteReasons();
        this.cols = this.getRoutedCols();
        this.getClaimList("routed-in");
        break;
      case "Routed Out":
        this.getRouteReasons();
        this.cols = this.getRoutedCols().filter(e => e.field !== "status");
        this.getClaimList("routed-out");
        break;
    }
  }

  getAuditFailedClaimsCols() {
    this.auditFailedCols = [
      { field: "claimId", header: "Claim ID" },
      { field: "claimType", header: "Claim Type" },
      { field: "claimStatus", header: "Claim Status" },
      { field: "receiptDate", header: "Receipt Date" },
      { field: "claimByAge", header: "Claim Age (In Days)" },
      { field: "auditStatus", header: "Audit Status" },
      { field: "auditDate", header: "Audit Date" },
      { field: "auditorName", header: "Auditor Name" },
      { field: "providerName", header: "Provider Name" },
      { field: "groupName", header: "Group Name" },
      { field: "billedAmount", header: "Billed Amount ($)" },
      { field: "allowedAmount", header: "Allowed Amount ($)" },
      { field: "totalPaidAmount", header: "Total Paid Amount ($)" },
      { field: "processedDate", header: "Processed Date" },
      { field: "queueName", header: "Queue Name" },
      { field: "errorType", header: "Error Type" },
      { field: "errorDescription", header: "Error Description" },
      { field: "financialImpact", header: "Financial Impact" },
      { field: "amount", header: "Amount ($)" }
    ];
  }

  getReviewRebuttalCols() {
    this.reviewRebuttalCols = [
      { field: "claimId", header: "Claim ID" },
      { field: "rebutAccept", header: "Rebutt/Accept" },
      { field: "claimType", header: "Claim Type" },
      { field: "receiptDate", header: "Receipt Date" },
      { field: "claimAge", header: "Claim Age (In days)" },
      { field: "providerName", header: "Provider Name" },
      { field: "groupName", header: "Group Name" },
      { field: "billedAmount", header: "Billed Amount ($)" },
      { field: "allowedAmount", header: "Allowed Amount ($)" },
      { field: "paidAmount", header: "Paid Amount ($)" },
      { field: "processedDate", header: "Processed Date" },
      { field: "queueName", header: "Queue Name" }
    ];
  }

  getCompletedCols() {
    return [
      { field: "claimId", header: "Claim ID" },
      { field: "status", header: "PROMT Status" },
      { field: "receivedDate", header: "Received Date" },
      { field: "age", header: "Claim Age (In Days)" },
      { field: "queueName", header: "Queue Name" },
      { field: "comments", header: "Comments" }
    ];
  }

  getRoutedCols() {
    const array = [
      { field: "claimId", header: "Claim ID" },
      { field: "status", header: "PROMT Status" },
      { field: "receivedDate", header: "Received Date" },
      { field: "age", header: "Claim Age (In Days)" },
      { field: "queueName", header: "Queue Name" },
      { field: "routeReason", header: "Route Reason" }
    ];
    if (this.FilterBy === "Routed In") {
      array.push({ field: "routedInUser", header: "Routed From User" });
    } else {
      array.push({ field: "routedToUser", header: "Routed To User" });
    }
    return [
      ...array,
      ...[
        { field: "comments", header: "Comments" },
        { field: "leadName", header: "Lead Name" },
        { field: "userGroupName", header: "User Group Name" }
      ]
    ];
  }

  getPendedCols() {
    return [
      { field: "claimId", header: "Claim ID" },
      { field: "receivedDate", header: "Received Date" },
      { field: "age", header: "Claim Age (In Days)" },
      { field: "queueName", header: "Queue Name" },
      { field: "pendReason", header: "Pend Reason" },
      { field: "firstPendDate", header: "First Pend Date" },
      { field: "lastPendDate", header: "Recent Pend Date" },
      { field: "comments", header: "Comments" },
      { field: "userGroupName", header: "User Group Name" }
    ];
  }

  getFilteredUsers(event) {
    this.filteredValues = event.filteredValue;
  }

  getAuditFailedLsit() {
    this.auditorService.getAuditailedDetails().subscribe(res => {
      this.auditFailedData = res;
    });
  }

  getReviewRebuttalList() {
    this.auditorService.getReviewRebuttalList().subscribe(res => {
      this.reviewRebuttalData = res;
    });
  }

  confirmAndNavigate(val, status) {
    this.confirmationService.confirm({
      message: "Are you sure want to load the claim in Claims Examiner Queue ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptVisible: true,
      rejectVisible: true,
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: () => {
        this.selectAndNavigate(val, status);
      }
    });
  }

  confirmAndNavigateToAuditFailed(val) {
    this.confirmationService.confirm({
      message:
        this.FilterBy === "ReviewRebut"
          ? "Are you sure you want to load the Review/Rebutted claim?"
          : "Are you sure want to load the claim in Audit Failed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptVisible: true,
      rejectVisible: true,
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: () => {
        this.selectAndNavigateToAuditFailed(val);
      }
    });
  }

  selectAndNavigateToAuditFailed(auditFlowId) {
    const reviewRebut = this.FilterBy === "ReviewRebut" ? true : false;
    if (this.taskManagementService.claimDetails.claimId === null) {
      this.router.navigate(["/audit-failed"], {
        queryParams: { auditFlowId, reviewRebut },
        skipLocationChange: true,
        replaceUrl: true
      });
    } else {
      this.notifierService.throwNotification({
        type: "warning",
        message:
          "You can not load a claim in Queue untill you Complete/Pend/Route the current Claim"
      });
    }
  }

  popupMessage(val) {
    this.confirmationService.confirm({
      message: val,
      header: "Comments",
      icon: "pi pi-exclamation-triangle",
      acceptVisible: false,
      rejectLabel: "Close"
    });
  }

  getPendReasons() {
    this.pendReasonList = [];
    this.taskManagementService.getPendReasons();
    this.pendReasonList = this.taskManagementService.pendReasonResponse;
    this.statusSubscription = this.taskManagementService
      .getPendReasonsListner()
      .subscribe(data => {
        this.pendReasonList = data;
        this.mapPendReasons();
        this.statusSubscription.unsubscribe();
      });
    this.mapPendReasons();
  }

  getRouteReasons() {
    this.routeReasonList = [];
    this.taskManagementService.getReAssignedRouteReasons();
    this.routeReasonList = this.taskManagementService.reassignedRouteReasonResponse;
    this.taskManagementService
      .getReAssignedRouteReasonsListner()
      .subscribe(data => {
        this.routeReasonList = data;
        this.mapRouteReasons();
      });
    this.mapRouteReasons();
  }

  mapPendReasons() {
    this.pendReason = [];
    this.pendReason.push({ label: "All", value: null });
    if (this.pendReasonList) {
      this.pendReasonList.forEach(s => {
        this.pendReason.push({
          label: s.pendReason.trim().toString(),
          value: s.pendReason.trim().toString()
        });
      });
    }
  }

  mapRouteReasons() {
    this.routeReason = [];
    this.routeReason.push({ label: "All", value: null });
    if (this.routeReasonList) {
      this.routeReasonList.forEach(s => {
        this.routeReason.push({
          label: s.routeReason.trim().toString(),
          value: s.routeReason.toString()
        });
      });
    }
  }

  tableFilter(claimsTable, value, field, matchMode) {
    claimsTable.filter(value, field, matchMode);
  }

  getClaimList(filter) {
    this.claimList = [];
    this.taskManagementService.getClaimList(filter).subscribe(data => {
      this.claimList = data;
    });
  }

  selectAndNavigate(taskId, status) {
    if (this.taskManagementService.claimDetails.claimId === null) {
      this.router.navigate(["/ClaimsExaminerQueue"], {
        queryParams: { taskId, status },
        skipLocationChange: true,
        replaceUrl: true
      });
    } else {
      this.notifierService.throwNotification({
        type: "warning",
        message:
          "You can not load a claim in Queue untill you Complete/Pend/Route the current Claim"
      });
    }
  }

  selectedCol(col, colValue, row) {
    if (this.checkForNavigation(col.field, row.status)) {
      this.confirmAndNavigate(row.taskId, row.status);
    } else if (col.field === "comments" && colValue) {
      this.popupMessage(colValue);
    }
  }

  selectedAuditFailedCol(col, colValue, row) {
    if (col.field === "claimId") {
      this.confirmAndNavigateToAuditFailed(row.auditFlowId);
    }
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.getClaims());
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });
      this.saveAsExcelFile(excelBuffer, "My_Claims-");
    });
  }

  saveAsExcelFile(buffer, fileName: string): void {
    import("file-saver").then(FileSaver => {
      const EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const EXCEL_EXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      const today = new Date();
      const dateString = this.datePipe.transform(today, "MMddyyyy");
      FileSaver.saveAs(data, fileName + dateString + EXCEL_EXTENSION);
    });
  }

  getClaims() {
    const claims = [];
    this.filteredValues.forEach(claim => {
      claims.push(claim);
    });
    return claims;
  }

  getOptions(col) {
    const data: any[] =
      this.claimList.length > 0
        ? this.claimList
            .map(c => c[col.field])
            .filter((val, i, self) => self.indexOf(val) === i)
        : [];
    return data;
  }

  checkForNavigation(field: string, status: string) {
    return (
      field === "claimId" &&
      (this.FilterBy === "Routed In"
        ? status === "Pended" ||
          status === "Routed In" ||
          status === "Assigned" ||
          status === "Complete & Route"
        : status === "Pended" ||
          status === "Routed In" ||
          status === "Assigned")
    );
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
    this.fieldSubscription.unsubscribe();
  }
}
