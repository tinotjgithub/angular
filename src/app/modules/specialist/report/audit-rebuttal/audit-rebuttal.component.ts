import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit-rebuttal',
  templateUrl: './audit-rebuttal.component.html',
})
export class AuditRebuttalComponent implements OnInit {

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
      { header: "Enrollment Specialist Name", field: "errordetails" },
      { header: "Error Description (Auditor)", field: "errordetails" },
      { header: "Specialist Agreed​​", field: "errordetails" },
      { header: "Specialist Rebuttal Comment", field: "benefitplanid" },
      { header: "Rebuttal Level", field: "benefitplanstartdate" },
      { header: "Level 2 Auditor Comments​", field: "benefitplanenddate" },
      { header: "Lead Name", field: "usergroupname" },
      { header: "Manager Name", field: "usergroupname" },
      { header: "Rebuttal Date", field: "usergroupname" },
      { header: "Rebuttal Status", field: "usergroupname" },
    ];
    this.reportData = [];
  }

}
