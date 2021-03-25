import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";
import { Router, ActivatedRoute } from "@angular/router";
import { WorkCategoryService } from "../../services/work-category.service";
import { ConfirmationService } from "primeng/api";
@Component({
  selector: "app-specialist-audit-failed-detail-page",
  templateUrl: "./specialist-audit-failed-detail-page.component.html",
  styleUrls: ["./specialist-audit-failed-detail-page.component.css"]
})
export class SpecialistAuditFailedDetailPageComponent implements OnInit {
  @ViewChild("scoreTable", { static: false }) scoreTable;
  @Input()
  public gridData: any[];
  cols: { field: string; header: string; visible: boolean }[];
  text: string;
  currentId: string;
  public data: any[];
  public type = "";

  constructor(
    private enrollmentManagementService: EnrollmentManagementService,
    private notifierService: NotifierService,
    private activateRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    public datePipe: DatePipe,
    private router: Router,
    private workCategoryService: WorkCategoryService
  ) {}

  ngOnInit() {
    this.activateRoute.queryParams.subscribe(params => {
      if (params.type) {
        this.type = params.type;
      }
    });
    this.setWorkCategoryColumns();
    this.getWorkCategoryAuditFailedData();
  }

  selectedCol(id) {
    this.confirmAndNavigate(id);
  }

  checkForNavigation(field: string) {
    return field === "subscriptionId";
  }

  confirmAndNavigate(taskId) {
    this.confirmationService.confirm({
      message:
        "Are you sure want to load the transaction in Enrollment Transaction Queue ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptVisible: true,
      rejectVisible: true,
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: () => {
        this.selectAndNavigate(taskId);
      }
    });
  }

  selectAndNavigate(auditFlowId) {
    if (this.enrollmentManagementService.subscriptionDetails.taskId === null) {
      this.router.navigate(["audit-failed-specialist"], {
        queryParams: { auditFlowId }
      });
    } else {
      this.notifierService.throwNotification({
        type: "warning",
        message:
          "You can not load a transaction in Queue until you Complete/Pend/Route the current Transaction"
      });
    }
  }

  // Columns
  setWorkCategoryColumns() {
    this.cols = [
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      { field: "auditDate", header: "Audit Date", visible: true },
      {
        field: "auditorName",
        header: "Auditor Name",
        visible: true
      },
      {
        field: "errorDetails",
        header: "Audit Error Details",
        visible: true
      },
      {
        field: "transactionType",
        header: "Transaction Type",
        visible: true
      },
      {
        field: "transactionCount",
        header: "Transaction Count",
        visible: true
      },
      {
        field: "subscriberName",
        header: "Subscriber Name",
        visible: true
      },
      {
        field: "memberGroupName",
        header: "Member Group Name",
        visible: true
      },
      {
        field: "memberId",
        header: "Member ID",
        visible: true
      },
      {
        field: "memberLastName",
        header: "Member Last Name",
        visible: true
      },
      {
        field: "memberFirstName",
        header: "Member First Name",
        visible: true
      },
      {
        field: "memberDob",
        header: "Member DOB",
        visible: true
      },
      {
        field: "relationToSubscriber",
        header: "Relation To Subscriber",
        visible: true
      },
      {
        field: "benefitPlanName",
        header: "Benefit Plan ID/Name",
        visible: true
      },
      {
        field: "benefitPlanStartDate",
        header: "Benefit Plan Start Date",
        visible: true
      },
      {
        field: "benefitPlanEndDate",
        header: "Benefit Plan End Date",
        visible: true
      },
      {
        field: "userGroupName",
        header: "User Group Name",
        visible: true
      }
    ];
  }

  parseResponse(val) {
    val.auditDate = this.datePipe.transform(val.auditDate, "yyyy-MM-dd");
    return val;
  }

  getWorkCategoryAuditFailedData() {
    this.gridData = [];
    this.data = [];
    this.workCategoryService
      .getWorkCategoryDetailsData(this.type)
      .subscribe(res => {
        if (res) {
          const rep = [];
          res.forEach(val => {
            rep.push(this.parseResponse(val));
          });
          const resp = rep;
          this.data = resp;
          const resArray = resp;
          this.gridData = resArray;
        }
      });
  }
}
