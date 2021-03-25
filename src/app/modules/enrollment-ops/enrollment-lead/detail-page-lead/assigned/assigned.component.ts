import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EmrollmentLeadLandingPageService } from "../../enrollment-lead-landing-page/services/emrollment-lead-landing-page.service";

@Component({
  selector: "app-assigned",
  templateUrl: "./assigned.component.html",
  styleUrls: ["./assigned.component.css"]
})
export class AssignedComponent implements OnInit {
  public type: string;
  public cols: any[];
  public gridData: any[];
  public name: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private service: EmrollmentLeadLandingPageService
  ) {}

  ngOnInit() {
    this.name = "assigned";
    this.type = this.activatedRoute.snapshot.queryParamMap.get("type");
    this.setCols();
    this.getData();
  }

  private setCols() {
    const common = [
      { header: "Subscription ID", field: "subscriptionId", visible: true },
      {
        header: "Enrollment Specialist Name",
        field: "specialistName",
        visible: true
      },
      { header: "Transaction Type", field: "transactionType", visible: true },
      { header: "Receipt Date", field: "receiptDate", visible: true },
      {
        header: "Record Age (In Days)",
        field: "recordAge",
        visible: true
      },
      { header: "Subscriber Name", field: "subscriberName", visible: true },
      { header: "Member Group Name", field: "memberGroupName", visible: true },
      { header: "Member ID", field: "memberID", visible: true },
      { header: "Member Last Name", field: "memberLastName", visible: true },
      { header: "Member First Name", field: "memberFirstName", visible: true },
      { header: "Member DOB", field: "memberDOB", visible: true },
      {
        header: "Relation To Subscriber",
        field: "relationToSubscriber",
        visible: true
      }
    ];
    const workBasket = [
      {
        header: "Benefit Plan Name",
        field: "benefitPlanName",
        visible: true
      },
      {
        header: "Benefit Plan Start Date",
        field: "benefitPlanStartDate",
        visible: true
      },
      {
        header: "Benefit Plan End Date",
        field: "benefitPlanEndDate",
        visible: true
      }
    ];
    this.cols =
      this.type !== "Workbasket"
        ? common.filter(f => f.field !== "transactionType")
        : [...common, ...workBasket];
    this.cols = [
      ...this.cols,
      { header: "User Group Name", field: "userGroupName", visible: true }
    ];
  }

  private getData() {
    this.gridData = [];
    this.service.getDeatilsList("assigned", this.type).subscribe(res => {
      this.gridData = res;
    });
  }
}
