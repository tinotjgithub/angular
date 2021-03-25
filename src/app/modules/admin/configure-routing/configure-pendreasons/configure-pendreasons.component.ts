import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Table } from "primeng/table";
import { NotifierService } from "src/app/services/notifier.service";
import { Subscription } from "rxjs";
import { TaskmanagementService } from "./../../../../services/task-management/taskmanagement.service";
import { PendReason } from "./../../../../services/task-management/models/PendReason";
import { ConfirmationService } from "primeng/api";
import { ActivatedRoute } from '@angular/router';
import { EnrollmentManagementService } from 'src/app/services/enrollment-management/enrollment-management.service';

@Component({
  selector: "app-configure-pendreasons",
  templateUrl: "./configure-pendreasons.component.html"
})
export class ConfigurePendreasonsComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("pendReasonTable", { static: false }) pendReasonTable: Table;
  cols = [];
  pendReasonListCopy = Array<PendReason>();
  pendCopy = Array<PendReason>();
  pendReasonArray: { [s: string]: PendReason } = {};
  pendList = [];
  private addedCount: number;
  private pendSubscription: Subscription = new Subscription();
  private finalArray = { pendReasonDtos: Array<PendReason>() };
  public pendReasonGroup: FormGroup;
  public isValid = true;
  public isUpdated = false;
  public isPendReasonPresent = true;
  public isPendReasonRendered = false;
  public deletedItems = Array<PendReason>();
  public pendReasonList = Array<PendReason>();
  public isEnrollment: boolean;
  constructor(
    private notifierServices: NotifierService,
    private fbReason: FormBuilder,
    private taskManagementService: TaskmanagementService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private enrollmentService: EnrollmentManagementService
  ) {
    this.pendReasonGroup = fbReason.group({
      pendReason: ["", Validators.required]
    });
  }

  ngAfterViewInit() {}

  ngOnInit() {
    this.isEnrollment = (this.activatedRoute.snapshot.queryParamMap.get('type') === 'enrollment');
    this.getTableColumns();
    this.getPendReasons();
  }

  private getService() {
    return this.isEnrollment ? this.enrollmentService : this.taskManagementService;
  }

  pendReasonChange(event: string) {
    this.isValid = true;
    this.isValid = this.checkIfEmptyOrNull(event);
  }

  validatePendReason(reasonValue) {
    if (!this.checkIfEmptyOrNull(reasonValue)) {
      this.isValid = false;
      this.notifierServices.throwNotification({
        type: "error",
        message: "Pend Reason Cannot Be Empty."
      });
    } else {
      this.isValid = this.checkDuplicates(reasonValue);
    }
  }

  checkDuplicates(reasonValue) {
    let isValid = true;
    const found = this.pendList.some(
      val =>
        val.pendReason.trim().toUpperCase() === reasonValue.trim().toUpperCase()
    );
    if (found) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Pend Reason Already Exists."
      });
      isValid = false;
    } else {
      isValid = true;
    }
    return isValid;
  }

  addPendReason() {
    this.isValid = true;
    const reasonValue = this.pendReasonGroup.get("pendReason").value;
    this.validatePendReason(reasonValue);
    if (this.isValid) {
      this.getService().addPendReason(reasonValue).subscribe(res => {
        this.pendReasonGroup.get("pendReason").setValue("");
        this.notifierServices.throwNotification({
          type: "info",
          message: "Pend Reason Added."
        });
        this.getPendReasons();
      });
    }
  }

  getPendReasons() {
    this.deletedItems = [];
    this.addedCount = 0;
    this.deletedItems = [];
    this.pendReasonList = [];
    this.pendList = [];
    const service = this.getService();
    service.getPendReasonsConfig();
    this.pendList = service.pendReasonConfigResponse;
    this.pendSubscription = service
      .getPendReasonsConfigListner()
      .subscribe(data => {
        this.pendList = data;
        this.mapPendReasons();
        this.pendSubscription.unsubscribe();
      });
  }

  checkNoDuplicates() {
    const status = this.pendReasonList.some(pend => {
      let counter = 0;
      for (const val of this.pendReasonList) {
        if (
          val.pendReason.trim().toUpperCase() ===
          pend.pendReason.trim().toUpperCase()
        ) {
          counter += 1;
        }
      }
      return counter > 1;
    });
    return status;
  }

  mapPendReasons() {
    this.pendCopy = [];
    this.pendReasonListCopy = [];
    this.pendReasonList = [];
    if (this.pendList && this.pendList.length > 0) {
      // const reasonList = this.pendList.filter(s => s.pendStatus === true);
      this.pendList.forEach(s => {
        this.pendReasonList.push({
          pendReason: s.pendReason.toString(),
          pendReasonCode: s.pendReasonCode.toString()
        });
      });
      this.isPendReasonPresent = true;
      this.isPendReasonRendered = true;
      this.pendReasonListCopy = this.pendReasonList.map(x =>
        Object.assign({}, x)
      );
      this.pendCopy = this.pendReasonList.map(x => Object.assign({}, x));
    } else {
      this.isPendReasonPresent = false;
      this.isPendReasonRendered = false;
    }
  }

  getTableColumns() {
    this.cols = [{ field: "pendReason", header: "Pend Reason" }];
  }

  deleteRow(rowIndex: number) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this pend reason?",
      accept: () => {
        const reasonItem = this.pendReasonList[rowIndex];
        this.getService()
          .deletePendReason(reasonItem.pendReasonCode)
          .subscribe(res => {
            this.notifierServices.throwNotification({
              type: "info",
              message: "Pend reason deleted."
            });
            this.getPendReasons();
          });
      }
    });
  }

  onRowEditInit(pendReason: PendReason, rowIndex: number) {
    this.pendReasonArray[rowIndex] = { ...pendReason };
  }

  checkIfEmptyOrNull(pendReason: string) {
    let valid = false;
    if (
      pendReason &&
      pendReason !== null &&
      pendReason.trim() !== "" &&
      pendReason.length > 0
    ) {
      valid = true;
    }
    return valid;
  }

  checkDuplication(pendReason: PendReason, rowIndex: number) {
    let pendList = [];
    let isValid = true;
    pendList = this.pendCopy.filter(
      (item, i) => item.pendReasonCode !== pendReason.pendReasonCode
    );
    const found = pendList.some(
      val =>
        val.pendReason.trim().toUpperCase() ===
        pendReason.pendReason.trim().toUpperCase()
    );
    if (found) {
      isValid = false;
      pendReason.pendReason = this.pendReasonListCopy[rowIndex].pendReason;
    }
    return isValid;
  }

  onRowEditSave(pendReason: PendReason, rowIndex: number) {
    if (
      !pendReason.pendReason ||
      !this.checkIfEmptyOrNull(pendReason.pendReason)
    ) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Pend Reason Cannot Be Empty."
      });
    } else if (!this.checkDuplication(pendReason, rowIndex)) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "Pend Reason Already Exists."
      });
    } else {
      const currentPendReasonCode = this.pendReasonArray[rowIndex]
        .pendReasonCode;
      const currentPendReason = this.pendReasonArray[rowIndex].pendReason;

      if (pendReason.pendReason !== currentPendReason) {
        this.getService().updatePendReason(pendReason.pendReasonCode, pendReason.pendReason).subscribe(res => {
          this.isUpdated = true;
          this.notifierServices.throwNotification({
            type: "info",
            message: "Pend reason modified."
          });
          this.getPendReasons();
        }, err => {
          this.pendReasonList[rowIndex].pendReason = currentPendReason;
          this.pendReasonList[rowIndex].pendReasonCode = currentPendReasonCode;
        });
      }
    }
  }

  onRowEditCancel(rowIndex: number) {
    const currentPendReasonCode = this.pendReasonArray[rowIndex].pendReasonCode;
    const currentPendReason = this.pendReasonArray[rowIndex].pendReason;
    this.pendReasonList[rowIndex].pendReason = currentPendReason;
    this.pendReasonList[rowIndex].pendReasonCode = currentPendReasonCode;
  }

  checkIfReverted() {
    let objectsAreSame = true;
    if (this.pendReasonListCopy.length !== this.pendReasonList.length) {
      objectsAreSame = false;
    } else {
      for (const obj in this.pendReasonListCopy) {
        if (
          this.pendReasonListCopy[obj].pendReason !==
          this.pendReasonList[obj].pendReason
        ) {
          objectsAreSame = false;
          break;
        }
      }
    }
    if (objectsAreSame) {
      this.notifierServices.throwNotification({
        type: "error",
        message: "No Changes Made"
      });
      this.isValid = false;
      this.pendReasonGroup.get("pendReason").setValue("");
    }
    return objectsAreSame;
  }

  ngOnDestroy() {
    this.pendSubscription.unsubscribe();
  }
}
