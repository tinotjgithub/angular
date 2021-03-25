import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ConfirmationService } from "primeng/api";
@Component({
  selector: "app-specialist-completed-detail-page",
  templateUrl: "./specialist-completed-detail-page.component.html",
  styleUrls: ["./specialist-completed-detail-page.component.css"],
  providers: [ConfirmationService]
})
export class SpecialistCompletedDetailPageComponent implements OnInit {
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
    private router: Router
  ) {}

  ngOnInit() {
    console.log("test");
    this.activateRoute.queryParams.subscribe(params => {
      if (params.type) {
        this.type = params.type;
      }
    });
    this.setWorkCategoryColumns();
    this.getWorkCategoryDetailsData();
  }
  setWorkCategoryColumns() {
    this.cols = [
      { field: "id", header: "taskId", visible: false },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      { field: "completionDate", header: "Completion Date", visible: true },
      { field: "transactionCount", header: "Transaction Count", visible: true },
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
        field: "memberID",
        header: "MemberID",
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
        field: "memberDOB",
        header: "Member DOB",
        visible: true
      },
      {
        field: "subscriberRelationship",
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
      },
      {
        field: "errorDetails",
        header: "Error Details",
        visible: true
      }
    ];
    this.setDateInCol();
  }

  setDateInCol() {
    if (this.type === "Reconciliation" || this.type === "Fallout") {
      this.cols.splice(5, 0, {
        field: "reportDate",
        header: "Report Date",
        visible: true
      });
    } else {
      this.cols.splice(5, 0, {
        field: "receiptDate",
        header: "Receipt Date",
        visible: true
      });
    }
  }

  getWorkCategoryDetailsData() {
    this.enrollmentManagementService.getWorkCategoryDetailsData(
      this.type,
      "COMPLETED"
    );
    this.gridData = this.enrollmentManagementService.workCategoryDetailsDataResponse;
    this.gridData = [];
    this.data = [];
    this.enrollmentManagementService
      .getWorkCategoryDetailsDataListner()
      .subscribe((res: any) => {
        if (res) {
          this.data = res;
          const resArray = res;
          this.gridData = resArray;
        }
      });
  }
}
