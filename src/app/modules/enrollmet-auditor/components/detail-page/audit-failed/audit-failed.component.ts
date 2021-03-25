import { EnrollmentAuditorService } from './../../../services/enrollment-auditor.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-audit-failed',
  templateUrl: './audit-failed.component.html'
})
export class AuditFailedComponent implements OnInit {

  public type: string;
  public cols: any[];
  public gridData: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: EnrollmentAuditorService,
  ) { }

  ngOnInit() {
    this.type = this.activatedRoute.snapshot.queryParamMap.get("type");
    this.setCols();
    this.getData();
  }

  private setCols() {
    this.cols = [
      { header: "Subscription ID", field: "subscriptionId", visible: true },
      { header: "Priority", field: "priority", visible: true },
      {
        header: "Enrollment Specialist Name",
        field: "specialistName",
        visible: true,
      },
      { header: "Audit Date", field: "auditDate", visible: true },
      { header: "Transaction Type", field: "transactionType", visible: true },
      { header: "Transaction Count", field: "transactionCount", visible: true },
      {
        header: "Record Age (In Days)",
        field: "recordAge",
        visible: true,
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
        visible: true,
      },
      { header: "User Group Name", field: "userGroupName", visible: true },
    ];
  }

  private getData() {
    this.gridData = [];
    this.service.getDeatilsList('audit-failed', this.type).subscribe((res) => {
      this.gridData = res;
    });
  }

  loadSubscription(data) {
    console.log(data)
  }

}
