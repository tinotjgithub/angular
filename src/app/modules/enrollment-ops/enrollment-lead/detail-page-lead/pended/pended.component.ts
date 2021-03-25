import { Component, OnInit } from "@angular/core";
import { EmrollmentLeadLandingPageService } from "../../enrollment-lead-landing-page/services/emrollment-lead-landing-page.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-pended",
  templateUrl: "./pended.component.html",
  styleUrls: ["./pended.component.css"]
})
export class PendedComponent implements OnInit {
  public type: string;
  public cols: any[];
  public gridData: any[];
  public name: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private service: EmrollmentLeadLandingPageService
  ) {}

  ngOnInit() {
    this.name = "pended";
    this.type = this.activatedRoute.snapshot.queryParamMap.get("type");
    this.setCols();
    this.getData();
  }

  private setCols() {
    this.cols = [
      { header: "Subscription ID", field: "subscriptionId", visible: true },
      {
        header: "Enrollment Specialist Name",
        field: "specialistName",
        visible: true
      },
      { header: "First Pend Date", field: "firstPendDate", visible: true },
      { header: "Last Pend Date", field: "lastPendDate", visible: true },
      { header: "Pend Reason", field: "pendReason", visible: true },
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
      },
      { header: "User Group Name", field: "userGroupName", visible: true }
    ];
    if (this.type !== "Workbasket") {
      this.cols = this.cols.filter(f => f.field !== "transactionType");
    }
  }

  private getData() {
    this.gridData = [];
    this.service.getDeatilsList("pended", this.type).subscribe(res => {
      this.gridData = res;
    });
  }
}
