import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html"
})
export class DetailsComponent implements OnInit {
  public filterBy: string;
  public cols: any[];
  public tableData: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private enrollmentService: EnrollmentManagementService
  ) {}

  ngOnInit() {
    this.filterBy = this.activatedRoute.snapshot.queryParamMap.get("FilterBy");
    this.setCols();
    this.getTableData();
  }

  getTableData() {
    this.enrollmentService
      .getSpecialistListDetailsPage(this.filterBy)
      .subscribe(res => {
        this.tableData = res || [];
      });
  }

  private setCols() {
    const preCols = [
      { header: "Subscription ID", field: "subscriptionId" },
      { header: "Assign Type", field: "assignType", filter: "dropdown" },
      {
        header: "Transaction Type",
        field: "transactionType",
        filter: "dropdown"
      },
      { header: "Request Type", field: "requestType", filter: "dropdown" }
    ];
    const trailCols = [
      { header: "Receipt Date", field: "receiptDate" },
      { header: "Record Age (In Days)", field: "recordAge" },
      { header: "Subscriber Name", field: "subscriberName" },
      { header: "Member Group Name", field: "memberGroupName" },
      { header: "Member ID", field: "memberId" },
      { header: "Member Last Name", field: "memberLastName" },
      { header: "Member First Name", field: "memberFirstName" },
      { header: "Member DOB", field: "dob" },
      { header: "Relation To Subscriber", field: "subscriberRelation" },
      { header: "Benefit Plan ID/Name", field: "benefitPlanIdOrName" },
      { header: "Benefit Plan Start Date", field: "benefitPlanStartDate" },
      { header: "Benefit Plan End Date", field: "benefitPlanEndDate" },
      { header: "User Group Name", field: "userGroupName" },
      { header: "Error Details", field: "errorDetails" }
    ];
    this.cols = [...preCols, ...trailCols];
    if (this.filterBy === "Completed") {
      this.cols = this.cols.filter(e => e.header !== "Record Age (In Days)");
    }
    if (this.filterBy === "Pended") {
      this.cols = [
        ...preCols,
        { header: "First Pend Date", field: "firstPendDate" },
        { header: "Last Pend Date", field: "lastPendDate" },
        { header: "Pend Reason", field: "pendReason" },
        ...trailCols
      ];
    }
    if (this.filterBy === "Routed Out") {
      this.cols = [
        ...preCols,
        { header: "Routed Out Date", field: "routedOutDate" },
        { header: "Routed To Name", field: "routedToName" },
        ...trailCols
      ];
    }
    if (this.filterBy === "Audit Failed") {
      const auditPreCols = preCols.filter(e => e.header !== "Assign Type");
      const auditTrailCols = trailCols.filter(e => {
        return (
          e.header !== "Receipt Date" &&
          e.header !== "Record Age (In Days)" &&
          e.header !== "Relation To Subscriber"
        );
      });
      this.cols = [
        ...auditPreCols,
        { header: "Audit Date", field: "auditdate" },
        { header: "Auditor Name", field: "auditorname" },
        { header: "Audit Error Details", field: "auditerrordetails" },
        ...auditTrailCols
      ];
    }
  }

  getOptions(col) {
    const data: any[] =
      this.tableData && this.tableData.length > 0
        ? this.tableData
            .map(c => c[col.field])
            .filter((val, i, self) => self.indexOf(val) === i)
        : [];
    return data;
  }
}
