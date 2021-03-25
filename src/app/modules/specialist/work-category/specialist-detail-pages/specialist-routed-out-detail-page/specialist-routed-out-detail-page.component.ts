import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NotifierService } from "src/app/services/notifier.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ConfirmationService } from "primeng/api";
@Component({
  selector: "app-specialist-routed-out-detail-page",
  templateUrl: "./specialist-routed-out-detail-page.component.html",
  styleUrls: ["./specialist-routed-out-detail-page.component.css"],
  providers: [ConfirmationService]
})
export class SpecialistRoutedOutDetailPageComponent implements OnInit {
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
    this.activateRoute.queryParams.subscribe(params => {
      if (params.type) {
        this.type = params.type;
      }
    });
    this.setWorkCategoryColumns();
    this.getWorkCategoryRoutedOutData();
  }
  setWorkCategoryColumns() {
    this.cols = [
      { field: "id", header: "Task ID", visible: false },
      { field: "subscriptionId", header: "Subscription ID", visible: true },
      { field: "transactionType", header: "Transaction Type", visible: true },
      { field: "rdate", header: "Routed Out Date", visible: true },
      {
        field: "rname",
        header: "Routed Out To Name",
        visible: true
      },
      {
        field: "recordAge",
        header: "Record Age (In Days)",
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
        field: "memberDob",
        header: "Member DOB",
        visible: true
      },
      {
        field: "subscriberRelationship",
        header: "Relation To Subscriber",
        visible: true
      },
      {
        field: "benefitPlanID",
        header: "Benefit Plan ID/Name",
        visible: true
      },
      {
        field: "benefitPlanName",
        header: "Benefit Plan Name",
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

  getWorkCategoryRoutedOutData() {
    this.enrollmentManagementService.getWorkCategoryRoutedDetailsData(
      this.type,
      "ROUTED"
    );
    this.gridData = this.enrollmentManagementService.workCategoryRoutedDetailsDataResponse;
    this.gridData = [];
    this.data = [];
    this.enrollmentManagementService
      .getWorkCategoryRoutedDetailsDataListner()
      .subscribe((res: any) => {
        if (res) {
          this.data = res;
          const resArray = res;
          this.gridData = resArray;
        }
      });
  }
}
