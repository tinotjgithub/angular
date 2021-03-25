import { EnrollmentManagementService } from 'src/app/services/enrollment-management/enrollment-management.service';
import { GlobalValidators } from 'src/app/shared/validators';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-sla-enrollment',
  templateUrl: './sla-enrollment.component.html'
})
export class SlaEnrollmentComponent implements OnInit {

  @ViewChild("scoreTable", { static: false }) scoreTable;
  public targetSettings: FormGroup;
  isEdit = false;
  public gridData: any[];
  public cols: { field: string; header: string; visible: boolean; }[];
  public addTarget: boolean;
  public currentId: any;
  public requestTypes: any[];

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private enrollmentService: EnrollmentManagementService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.targetSettings = this.fb.group({
      period: [null, Validators.required],
      slaName: [null, Validators.required],
      workCategory: [null, Validators.required],
      turnAroundTime: [null, Validators.required]
    });
    this.getRequestType();
    this.getSLAConfig();
    this.setSLACols();
  }

  

  preventInputTurnaround(event) {
    if (this.targetSettings.get("turnAroundTime").value) {
      const isNumber = GlobalValidators.isAllNo(
        this.targetSettings.get("turnAroundTime").value
      );
      if (isNumber) {
        this.targetSettings.controls.turnAroundTime.setErrors(null);
        this.targetSettings.updateValueAndValidity();
      } else {
        this.targetSettings.controls.turnAroundTime.setErrors({
          invalidTurnNumber: true
        });
        this.targetSettings.updateValueAndValidity();
      }
    }
  }

  setSLACols() {
    this.cols = [
      { field: "id", header: "id", visible: false },
      { field: "period", header: "Month", visible: true },
      { field: "slaName", header: "SLA Name", visible: true },
      { field: "workCategoryName", header: "Work Category", visible: true },
      {
        field: "turnAroundTime",
        header: "Turn Around Time (Days)",
        visible: true,
      },
    ];
  }

  getRequestType() {
    this.enrollmentService.getUserWorkItemTypes().subscribe(res => {
      this.requestTypes = res ? res : [];
    });
  }

  getSLAConfig() {    
    this.gridData = [];
    this.enrollmentService.getSLAConfig().subscribe((res: any) => {
      if (res) {
        const resArray = res.enrollmentSLATargets || [];
        this.gridData = resArray.map(e => {
          return {
            ...e,
            period: this.datePipe.transform(e.period, "yyyy-MM"),
          };
        });
      }
    });
  }
  
  editSLATarget(rowData) {
    this.isEdit = true;
    this.setTargetData(rowData);
    this.addTarget = true;
    this.scoreTable.reset();
  }

  saveTargetScore() {
    this.saveTarget();
  }

  clearData() {
    this.isEdit = false;
    (Object as any).values(this.targetSettings.controls).forEach(control => {
      control.markAsUntouched();
    });

    this.targetSettings.get("period").setValue(null);
    this.targetSettings.get("turnAroundTime").setValue(null);
    this.targetSettings.get("slaName").setValue(null);
    this.addTarget = false;
    this.getSLAConfig();
  }

  saveTarget() {
    const {
      period,
      slaName,
      turnAroundTime,
      workCategory
    } = this.targetSettings.value;
    let payload: any = {
      period: this.getFormattedDate(period, true),
      slaName,
      turnAroundTime : Number(turnAroundTime),
      workCategoryId: Number(workCategory)
    };
    if (!this.isEdit) {
      this.enrollmentService.saveSlaConfig(payload).subscribe(res => {
        this.scoreTable.reset();
        this.clearData();
        this.notifierService.throwNotification({
          type: 'success',
          message: 'SLA added successfully!'
        });
      });
    } else {
      const selectedCategory = this.requestTypes.filter(e => e.id === Number(workCategory));
      payload = {
        ...payload,
        workCategoryName: selectedCategory[0] ? selectedCategory[0].name : '',
        id: this.currentId
      };
      this.enrollmentService.updateSlaConfig(payload).subscribe(res => {
        this.scoreTable.reset();
        this.clearData();
        this.notifierService.throwNotification({
          type: 'success',
          message: 'SLA updated successfully!'
        });
      });
    }
  }
  
  setTargetData(rowData) {
    const period = new Date(rowData.period);
    this.targetSettings.patchValue({
      period,
      turnAroundTime: rowData.turnAroundTime,
      slaName: rowData.slaName,
      workCategory: rowData.workCategoryId
    });
    this.currentId = rowData.id;
  }

  getFormattedDate(date, twisted = false) {
    const year = new Date(date).getFullYear();
    const month = (1 + new Date(date).getMonth()).toString().padStart(2, "0");
    const day = new Date(date)
      .getDate()
      .toString()
      .padStart(2, "0");
    return twisted
      ? year + "-" + month + "-" + day
      : month + "/" + day + "/" + year;
  }

  getControl(controlName: string) {
    return this.targetSettings.get(controlName);
  }

}
