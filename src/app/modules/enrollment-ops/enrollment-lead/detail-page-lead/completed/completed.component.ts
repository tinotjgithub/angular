import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmrollmentLeadLandingPageService } from '../../enrollment-lead-landing-page/services/emrollment-lead-landing-page.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css']
})
export class CompletedComponent implements OnInit {

  public type: string;
  public cols: any[];
  public gridData: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: EmrollmentLeadLandingPageService,
  ) { }

  ngOnInit() {
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
        visible: true,
      },
      { header: "Completion Date", field: "completionDate", visible: true },
      { header: "Transaction Type", field: "transactionType", visible: true },
      { header: "Receipt Date", field: "receiptDate", visible: true },
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
    if (this.type !== "Workbasket") {
      this.cols = this.cols.filter((f) => f.field !== "transactionType");
    }
  }

  private getData() {
    this.gridData = [];
    this.service.getDeatilsList('completed', this.type).subscribe((res) => {
      this.gridData = res;
    });
  }

}
