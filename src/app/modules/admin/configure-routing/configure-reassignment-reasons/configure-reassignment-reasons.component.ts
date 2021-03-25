import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskmanagementService } from 'src/app/services/task-management/taskmanagement.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { Table } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';
import { EnrollmentManagementService } from 'src/app/services/enrollment-management/enrollment-management.service';
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-configure-reassignment-reasons",
  templateUrl: "./configure-reassignment-reasons.component.html"
})
export class ConfigureReassignmentReasonsComponent implements OnInit {
  public reason: string;
  public reasonList: any[] = [];
  private reasonListCopy: any[] = [];
  public cols: any[];
  selectedReason: any;
  @ViewChild("reasonTable", { static: false })
  public table: Table;
  public isEnrollment: boolean;

  constructor(
    private taskManagementService: TaskmanagementService,
    private notifierService: NotifierService,
    private activatedRoute: ActivatedRoute,
    private enrollmentService: EnrollmentManagementService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.isEnrollment = (this.activatedRoute.snapshot.queryParamMap.get('type') === 'enrollment');
    this.cols = [{header: 'Reassignment Reason', field: 'reassignmentReason'}];
    this.getReasons();
  }

  private getService() {
    return this.isEnrollment ? this.enrollmentService : this.taskManagementService;
  }

  addReason() {
    if (this.checkReasonValidation(this.reason, this.reasonList)) {
      this.getService()
        .addReassignmentReason(this.reason)
        .subscribe(res => {
          this.reason = "";
          this.notifierService.throwNotification({
            type: "info",
            message: "Reassignment Reason Added."
          });
          this.getReasons();
        });
    }
  }

  checkDuplicate(reason: string, list: any[]) {
    const reasons = list.map(e =>
      String(e.reassignmentReason)
        .toLowerCase()
        .trim()
    );
    return reasons.indexOf(reason.toLowerCase().trim()) > -1;
  }

  getReasons() {
    this.reasonList = [];
    this.getService().getReassignmentReasons().subscribe(res => {
      this.reasonList = res && res.reassignmentReasonDtos ? res.reassignmentReasonDtos : [];
      this.reasonListCopy = this.reasonList.map(x => Object.assign({}, x));
    });
  }

  onRowEditInit(row, index) {
    this.selectedReason = {
      ...this.selectedReason,
      [row.reassignmentReasonCode]: { ...row }
    };
  }

  onRowEditCancel(row, index) {
    this.reasonList[index] = this.selectedReason[row.reassignmentReasonCode];
    delete this.selectedReason[row.reassignmentReasonCode];
  }

  onRowEditSave(row, index) {
    const reason = row.reassignmentReason;
    const list = this.reasonList.filter(
      e => e.reassignmentReasonCode !== row.reassignmentReasonCode
    );
    if (
      this.checkReasonValidation(
        reason,
        list,
        true,
        index,
        row.reassignmentReasonCode
      )
    ) {
      const currentReason = this.selectedReason[row.reassignmentReasonCode];
      if (currentReason.reassignmentReason !== reason) {
        this.getService().updateReassignmentReason(row.reassignmentReasonCode, reason).subscribe(res => {
          this.notifierService.throwNotification({
            type: "info",
            message: "Reassignment Reason Modified."
          });
          this.getReasons();
        }, err => {
          this.reasonList[index] = currentReason;
          delete this.selectedReason[row.reassignmentReasonCode];
        });
      }
    } else {
      return;
    }
  }

  checkReasonValidation(reason: string, list: any[], editing?, index?, code?) {
    if (!(reason && reason.trim())) {
      this.notifierService.throwNotification({
        type: "error",
        message: "Reason Cannot Be Empty."
      });
      if (editing) {
        this.reasonList[index] = { ...this.selectedReason[code] };
      } else {
        this.reason = "";
      }
      return false;
    } else if (this.checkDuplicate(reason, list)) {
      this.notifierService.throwNotification({
        type: "error",
        message: "Reason Already Exists."
      });
      if (editing) {
        this.reasonList[index] = { ...this.selectedReason[code] };
      }
      return false;
    }
    return true;
  }

  deleteRow(index) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this Reassignment reason?",
      accept: () => {
        this.getService()
          .deleteReassignmentReason(
            this.reasonList[index].reassignmentReasonCode
          )
          .subscribe(res => {
            this.notifierService.throwNotification({
              type: "info",
              message: "Reassignment Reason Deleted."
            });
            this.getReasons();
          });
      }
    });
  }

  checkIfEdited() {
    const reasonList = this.reasonList;
    let objectsAreSame = false;
    if (this.reasonListCopy.length !== reasonList.length) {
      objectsAreSame = true;
    } else {
      for (const obj of this.reasonListCopy) {
        const code = obj.reassignmentReasonCode;
        const filtered = reasonList.filter(
          o => o.reassignmentReasonCode === code
        );
        if (filtered.length > 0) {
          const reason = filtered[0].reassignmentReason;
          if (reason !== obj.reassignmentReason) {
            objectsAreSame = true;
          }
        } else {
          const reasons = reasonList.map(e =>
            String(e.reassignmentReason)
              .toLowerCase()
              .trim()
          );
          if (
            reasons.indexOf(
              String(obj.reassignmentReason)
                .toLowerCase()
                .trim()
            ) === -1
          ) {
            objectsAreSame = true;
          }
        }
      }
    }
    return objectsAreSame;
  }

  filteTable(value) {
    if (this.reasonList.length > 0) {
      this.table.filterGlobal(value, "contains");
    }
  }
}
