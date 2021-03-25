import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit-status',
  templateUrl: './audit-status.component.html',
})
export class AuditStatusComponent implements OnInit {

  public columns: any [];
  public reportData: any[];

  constructor() { }

  ngOnInit() {
    this.columns = [
      { header: "Subscription ID", field: "subscriptionid" },
      { header: "Receipt Date", field: "receiptdate" },
      { header: "Subscriber Name", field: "subscribername" },
      { header: "Member Group Name", field: "membergroupname" },
      { header: "Member ID", field: "memberid" },
      { header: "Member Last Name", field: "memberlastname" },
      { header: "Member First Name", field: "memberfirstname" },
      { header: "Member DOB", field: "memberdob" },
      { header: "Benefit Plan Name", field: "benefitplanid" },
      { header: "Benefit Plan Start Date", field: "benefitplanstartdate" },
      { header: "Benefit Plan End Date", field: "benefitplanenddate" },
      { header: "Enrollment Specialist Name", field: "errordetails" },
      { header: "User Group Name", field: "usergroupname" },
      { header: "Auditor Name", field: "benefitplanenddate" },
      { header: "Audit Date", field: "errordetails" },
      { header: "Audit Status", field: "usergroupname" },
      { header: "Error Description (Auditor)", field: "errordetails" },
    ];
    this.reportData = [];
  }

}
