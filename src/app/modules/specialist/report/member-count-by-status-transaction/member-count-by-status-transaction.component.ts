import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-count-by-status-transaction',
  templateUrl: './member-count-by-status-transaction.component.html',
})
export class MemberCountByStatusTransactionComponent implements OnInit {

  public columns: any [];
  public reportData: any[];

  constructor() { }

  ngOnInit() {
    this.columns = [
      { header: "Subscription ID", field: "subscriptionid" },
      { header: "WFM Status", field: "assigntype", filter: "dropdown" },
      { header: "Transaction Type", field: "transactiontype", filter: "dropdown" },
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
    ];
    this.reportData = [];
  }

}
