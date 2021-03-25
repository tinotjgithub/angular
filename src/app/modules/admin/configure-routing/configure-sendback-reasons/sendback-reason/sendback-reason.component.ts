import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';
import { TaskmanagementService } from 'src/app/services/task-management/taskmanagement.service';
import { SendBackReason } from 'src/app/services/task-management/models/SendBackReason';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-sendback-reason',
  templateUrl: './sendback-reason.component.html',
  styleUrls: []
})
export class SendbackReasonComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("sendBackReasonTable", { static: false }) sendBackReasonTable: Table;
  cols = [];
  sendBackReasonListCopy = Array<SendBackReason>();
  sendBackCopy = Array<SendBackReason>();
  sendBackReasonArray: { [s: string]: SendBackReason } = {};
  sendBackList = [];
  private addedCount: number;
  private sendBackSubscription: Subscription = new Subscription();
  private finalArray = { sendBackReasonDtos: Array<SendBackReason>() };
  public sendBackReasonGroup: FormGroup;
  public isValid = true;
  public isUpdated = false;
  public isSendBackReasonPresent = true;
  public isSendBackReasonRendered = false;
  public deletedItems = Array<SendBackReason>();
  public sendBackReasonList = Array<SendBackReason>();
  constructor(
    private notifierServices: NotifierService,
    private fbReason: FormBuilder,
    private taskManagementService: TaskmanagementService,
    private confirmationService: ConfirmationService
  ) {
    this.sendBackReasonGroup = fbReason.group({
      sendBackReason: ["", Validators.required]
    });
  }

  ngAfterViewInit() {}

  ngOnInit() {
    this.getTableColumns();
    this.getSendBackReasons();
  }

  sendBackReasonChange(event: string) {
    this.isValid = true;
    this.isValid = this.checkIfEmptyOrNull(event);
  }

  validateSendBackReason(reasonValue) {
    if (!this.checkIfEmptyOrNull(reasonValue)) {
      this.isValid = false;
      this.notifierServices.throwNotification({
        type: "error",
        message: "Send Back Reason Cannot Be Empty."
      });
    } else {
      this.isValid = this.checkDuplicates(reasonValue);
    }
  }

  checkDuplicates(reasonValue) {
    let isValid = true;
    const found = this.sendBackList.some(
      val =>
        val.sendBackReason.trim().toUpperCase() === reasonValue.trim().toUpperCase()
    );
    if (found) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Send Back Reason Already Exists."
      });
      isValid = false;
    } else {
      isValid = true;
    }
    return isValid;
  }

  addSendBackReason() {
    this.isValid = true;
    const reasonValue = this.sendBackReasonGroup.get("sendBackReason").value;
    this.validateSendBackReason(reasonValue);
    if (this.isValid) {
      this.taskManagementService.addSendBackReason(reasonValue).subscribe(res => {
        this.sendBackReasonGroup.get("sendBackReason").setValue("");
        this.notifierServices.throwNotification({
          type: "info",
          message: "Send Back Reason Added."
        });
        this.getSendBackReasons();
      });
    }
  }

  getSendBackReasons() {
    this.deletedItems = [];
    this.addedCount = 0;
    this.deletedItems = [];
    this.sendBackReasonList = [];
    this.sendBackList = [];
    this.taskManagementService.getAllSendBackReasons().subscribe((res) => {
      this.sendBackList = res ? res.sendBackReasonDtos : [];
      this.mapSendBackReasons();
    });
  }

  mapSendBackReasons() {
    this.sendBackCopy = [];
    this.sendBackReasonListCopy = [];
    this.sendBackReasonList = [];
    if (this.sendBackList && this.sendBackList.length > 0) {
      this.sendBackList.forEach(s => {
        this.sendBackReasonList.push({
          sendBackReason: s.sendBackReason.toString(),
          sendBackReasonCode: s.sendBackReasonCode.toString()
        });
      });
      this.isSendBackReasonPresent = true;
      this.isSendBackReasonRendered = true;
      this.sendBackReasonListCopy = this.sendBackReasonList.map(x =>
        Object.assign({}, x)
      );
      this.sendBackCopy = this.sendBackReasonList.map(x => Object.assign({}, x));
    } else {
      this.isSendBackReasonPresent = false;
      this.isSendBackReasonRendered = false;
    }
  }

  getTableColumns() {
    this.cols = [{ field: "sendBackReason", header: "Send Back Reason" }];
  }

  deleteRow(rowIndex: number) {
    this.confirmationService.confirm({
      message: " Are you sure that you want to delete this send back reason?",
      accept: ()=>{
        const reasonItem = this.sendBackReasonList[rowIndex];
        this.taskManagementService.deleteSendBackReason(reasonItem.sendBackReasonCode).subscribe(res => {
          this.notifierServices.throwNotification({
            type: "info",
            message: "Send Back reason deleted."
          });
          this.getSendBackReasons();
        });
      }
    });
  }

  onRowEditInit(sendBackReason: SendBackReason, rowIndex: number) {
    this.sendBackReasonArray[rowIndex] = { ...sendBackReason };
  }

  checkIfEmptyOrNull(sendBackReason: string) {
    let valid = false;
    if (
      sendBackReason &&
      sendBackReason !== null &&
      sendBackReason.trim() !== "" &&
      sendBackReason.length > 0
    ) {
      valid = true;
    }
    return valid;
  }

  checkDuplication(sendBackReason: SendBackReason, rowIndex: number) {
    let sendBackList = [];
    let isValid = true;
    sendBackList = this.sendBackCopy.filter(
      (item, i) => item.sendBackReasonCode !== sendBackReason.sendBackReasonCode
    );
    const found = sendBackList.some(
      val =>
        val.sendBackReason.trim().toUpperCase() ===
        sendBackReason.sendBackReason.trim().toUpperCase()
    );
    if (found) {
      isValid = false;
      sendBackReason.sendBackReason = this.sendBackReasonListCopy[rowIndex].sendBackReason;
    }
    return isValid;
  }

  onRowEditSave(sendBackReason: SendBackReason, rowIndex: number) {
    if (
      !sendBackReason.sendBackReason ||
      !this.checkIfEmptyOrNull(sendBackReason.sendBackReason)
    ) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Send Back Reason Cannot Be Empty."
      });
    } else if (!this.checkDuplication(sendBackReason, rowIndex)) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Send Back Reason Already Exists."
      });
    } else {
      const currentSendBackReasonCode = this.sendBackReasonArray[rowIndex].sendBackReasonCode;
      const currentSendBackReason = this.sendBackReasonArray[rowIndex].sendBackReason;

      if (sendBackReason.sendBackReason !== currentSendBackReason) {
        this.taskManagementService.updateSendBackReason(sendBackReason.sendBackReason, sendBackReason.sendBackReasonCode).subscribe(res => {
          this.isUpdated = true;
          this.notifierServices.throwNotification({
            type: "info",
            message: "Send Back reason modified."
          });
          this.getSendBackReasons();
        }, err => {
          this.sendBackReasonList[rowIndex].sendBackReason = currentSendBackReason;
          this.sendBackReasonList[rowIndex].sendBackReasonCode = currentSendBackReasonCode;
        });
      }
    }
  }

  onRowEditCancel(rowIndex: number) {
    const currentSendBackReasonCode = this.sendBackReasonArray[rowIndex].sendBackReasonCode;
    const currentSendBackReasonReason = this.sendBackReasonArray[rowIndex].sendBackReason;
    this.sendBackReasonList[rowIndex].sendBackReason = currentSendBackReasonReason;
    this.sendBackReasonList[rowIndex].sendBackReasonCode = currentSendBackReasonCode;
  }

  ngOnDestroy() {
    this.sendBackSubscription.unsubscribe();
  }
}
