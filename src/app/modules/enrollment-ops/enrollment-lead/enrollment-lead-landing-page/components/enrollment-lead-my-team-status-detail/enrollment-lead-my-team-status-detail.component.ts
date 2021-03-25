import { Component, OnInit, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import { EmrollmentLeadLandingPageService } from "../../services/emrollment-lead-landing-page.service";

@Component({
  selector: "app-enrollment-lead-my-team-status-detail",
  templateUrl: "./enrollment-lead-my-team-status-detail.component.html",
  styleUrls: ["./enrollment-lead-my-team-status-detail.component.css"]
})
export class EnrollmentLeadMyTeamStatusDetailComponent implements OnInit {
  cols: { field: string; header: string }[];
  subscriptionList = [];
  @ViewChild("pendReasonTable", { static: false }) pendReasonTable: Table;

  common = [
    { field: "slNo", header: "Sl No." },
    { field: "subscriptionId", header: "Subscription ID" },
    { field: "specialistName", header: "Specialist Name." },
    { field: "assignType", header: "Assign Type" },
    { field: "transactionType", header: "Transaction Type" },
    { field: "requestType", header: "Request Type" },
    { field: "recordAge", header: "Record Age (In Days)" },
    { field: "subscriberName", header: "Subscriber Name" },
    { field: "memberGroupName", header: "Member Group Name" },
    { field: "memberID", header: "Member ID" },
    { field: "memberLastName", header: "Member last Name" },
    { field: "memberFirstName", header: "Member First Name" },
    { field: "memberDOB", header: "Member DOB" },
    { field: "relationToSubscriber", header: "Relation To Subscriber" },
    { field: "benefitPlanName", header: "Benefit Plan ID/Name" },
    { field: "benefitPlanStartDate", header: "Benefit Plan Start Date" },
    { field: "benefitPlanEndDate", header: "Benefit Plan End Date" },
    { field: "userGroupName", header: "User Group Name" },
    { field: "errorDetails", header: "Error Details" }
  ];

  statusCols = {
    specialist: [
      { field: "slNo", header: "Sl No." },
      { field: "firstName", header: "First Name" },
      { field: "lastName", header: "Last Name" },
      { field: "userName", header: "User Name" },
      { field: "activeDate", header: "Activate Date" },
      { field: "deactivateDate", header: "Deactivate Date" },
      { field: "status", header: "Status" },
      { field: "proficiency", header: "Proficiency" },
      { field: "ldapOrLocal", header: "LDAP/Local" },
      { field: "userGroupsName", header: "User Group Name" }
    ],
    completed: [
      ...this.common.slice(0, 5),
      ...[
        { field: "completionDate", header: "Completed Date" },
        { field: "receiptDate", header: "Received Date" }
      ],
      ...this.common.slice(7) // This is to remove record age in days column
    ],
    pended: [
      ...this.common.slice(0, 5),
      ...[
        { field: "firstPendDate", header: "First Pend Date" },
        { field: "lastPendDate", header: "Last Pend Date" },
        { field: "pendReason", header: "Pend Reason" }
      ],
      ...this.common.slice(6)
    ],
    assigned: [
      ...this.common.slice(0, 5),
      ...[{ field: "receiptDate", header: "Received Date" }],
      ...this.common.slice(6)
    ]
  };
  header: string;
  constructor(private service: EmrollmentLeadLandingPageService) {}

  ngOnInit() {
    const status = this.service.myTeamStatus;
    this.header = (status === "assigned"
      ? "Assigned Subscription"
      : status === "specialist"
      ? "Enrollment Specialist"
      : status === "pended"
      ? "Pended Subscription"
      : "Completed Subscription"
    ).concat(" Details");
    this.cols = this.statusCols[status];
    this.service.getDeatils(status).subscribe(res => {
      this.subscriptionList = res;
    });
  }
}
