import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EnrollmentRebutReviewService } from "../../services/enrollment-rebut-review.service";

@Component({
  selector: "app-rebut-review-detail",
  templateUrl: "./rebut-review-detail.component.html",
  styleUrls: ["./rebut-review-detail.component.css"]
})
export class RebutReviewDetailComponent implements OnInit {
  public type: string;
  public cols: any[];
  public gridData: any[];
  public resArrayUpdated = [];
  public resArray = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: EnrollmentRebutReviewService
  ) {}

  ngOnInit() {
    this.type = this.activatedRoute.snapshot.queryParamMap.get("type");
    this.setCols();
    this.getData();
  }

  private setCols() {
    this.cols = [
      { header: "Sl No.", field: "slNo", visible: true },
      {
        header: "Subscription ID",
        field: "subscriptionId",
        visible: true,
        link: true
      },
      {
        header: "Rebut/Accept",
        field: "rebutOrAccept",
        visible: true,
        filter: "dropdown"
      },
      {
        header: "Rebuttal Level",
        field: "rebuttalLevel",
        visible: true,
        filter: "text"
      },
      {
        header: "PROMT Status",
        field: "promtStatus",
        visible: true,
        filter: "dropdown"
      },
      {
        header: "Enrollment Specialist Name",
        field: "specialistName",
        visible: true,
        filter: "text"
      },
      { header: "Audit Date", field: "auditDate", visible: true },
      { header: "Auditor Name", field: "auditorName", visible: true },
      { header: "Transaction Type", field: "transactionType", visible: true },
      { header: "Transaction Count", field: "transactionCount", visible: true },
      {
        header: "Record Age (In Days)",
        field: "recordAge",
        visible: true,
        filter: "text"
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
    this.service.getDetailList(this.type).subscribe(res => {
      res.forEach(r => {
        r.rebuttalLevel =
          r.rebuttalLevel === 0 || r.rebuttalLevel === "0"
            ? ""
            : r.rebuttalLevel;
        this.resArrayUpdated.push(r);
      });
    });

    this.gridData = this.resArrayUpdated;
  }

  navigateToRebutPage(data) {
    this.router.navigateByUrl(
      `/enrollment-rebut-review?flowId=${data.auditFlowId}`
    );
  }
}
