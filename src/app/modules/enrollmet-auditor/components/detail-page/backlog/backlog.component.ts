import { EnrollmentAuditorService } from './../../../services/enrollment-auditor.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html'
})
export class BacklogComponent implements OnInit {

  public type: string;
  public cols: any[];
  public gridData: any[];
  public selectedRecord: any[];
  public deletePopup: boolean;
  public reason: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: EnrollmentAuditorService,
    private notifierService: NotifierService,
    private router: Router
  ) { }

  ngOnInit() {
    this.type = this.activatedRoute.snapshot.queryParamMap.get("type");
    this.setCols();
    this.getData();
  }

  private setCols() {
    this.cols = [
      { header: "Select", field: "select", visible: true, filter: "check" },
      { header: "Subscription ID", field: "subscriptionId", visible: true, link: true },
      { header: "Priority", field: "priority", visible: true },
      { header: "Assign Type", field: "assignmentType", visible: true },
      { header: "Transaction Type", field: "transactionType", visible: true },
      { header: "Transaction Count", field: "transactionCount", visible: true },
      {
        header: "Backlog Age (In Days)",
        field: "backlogAge",
        visible: true,
      },
      {
        header: "Record Age (In Days)",
        field: "recordAge",
        visible: true,
      },
      { header: "Member Group Name", field: "memberGroupName", visible: true },
      {
        header: "Enrollment Specialist Name",
        field: "specialistName",
        visible: true,
      },
      { header: "User Group Name", field: "userGroupName", visible: true },
    ];
  }

  private getData() {
    this.gridData = [];
    this.service.getDeatilsList('backlog', this.type).subscribe((res) => {
      this.gridData = res;
    });
  }

  deleteRecord(seletedIds) {
    this.selectedRecord = seletedIds;
    this.deletePopup = true;
    this.reason = "";
  }

  loadSubscription(data) {
    this.router.navigateByUrl(`/enrollment-auditor/audit-queue?taskId=${data.auditTaskId}`);
  }

  deleteTransactions() {
    const payload = {
      taskIds: this.selectedRecord.map(e => e.auditTaskId).join(','),
      comments: this.reason
    };
    this.service.deleteTransaction(payload).subscribe(res => {
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Transactions deleted successfully.'
      });
      this.selectedRecord = [];
      this.deletePopup = false;
      this.getData();
    })
  }

  selectCondition(item) {
    return item && (String(item.assignmentType).toLowerCase() === 'auditor');
  }

}
