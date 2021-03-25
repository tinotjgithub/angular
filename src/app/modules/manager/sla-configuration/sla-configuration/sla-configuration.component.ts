import { Component, OnInit, ViewChild } from "@angular/core";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { TargetSettingsSaveRequestBody } from "src/app/services/task-management/models/targetSettingsRequestBody";
import { maxTarget, minSLA } from "./../../../../../app/shared/constants";
import { GlobalValidators } from "src/app/shared/validators";
@Component({
  selector: "app-sla-configuration",
  templateUrl: "./sla-configuration.component.html",
  styleUrls: ["./sla-configuration.component.css"]
})
export class SlaConfigurationComponent implements OnInit {
  @ViewChild("scoreTable", { static: false }) scoreTable;
  public targetSettings: FormGroup;
  isEdit = false;
  public gridData: any[];
  targetSLA: number;
  targetSettingsFetchResponse: any;
  cols: { field: string; header: string; visible: boolean }[];
  text: string;
  currentId: string;
  disabled = true;
  targetSettingsSaveRequestBody: TargetSettingsSaveRequestBody = {} as TargetSettingsSaveRequestBody;
  public addTarget: boolean;

  constructor(
    private taskManagementService: TaskmanagementService,
    private targetSettingsBuilder: FormBuilder,
    public datePipe: DatePipe
  ) {
    this.targetSettings = this.targetSettingsBuilder.group({
      period: [null, Validators.required],
      targetSLA: [null, Validators.required],
      turnAroundTime: [null, Validators.required],
      thresholdTime: ["0"],
      slaName: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.targetSettings.get("thresholdTime").setValue("0");
    this.getSLAConfig();
    this.setSLACols();
  }

  preventInput(event) {
    if (this.targetSettings.get("targetSLA").value) {
      const isNumber = GlobalValidators.isValidNumber(
        this.targetSettings.get("targetSLA").value
      );
      if (isNumber) {
        const value = this.targetSettings.get("targetSLA").value;
        this.targetSettings.controls.targetSLA.setErrors(null);
        this.targetSettings.updateValueAndValidity();
        if (value > maxTarget) {
          this.targetSettings.controls.targetSLA.setErrors({
            invalidSLAMax: true
          });
          this.targetSettings.updateValueAndValidity();
          event.preventDefault();
          this.targetSettings
            .get("targetSLA")
            .setValue(parseInt(value.toString().substring(0, 2), 10));
        } else {
          this.targetSettings.controls.targetSLA.setErrors(null);
          this.targetSettings.updateValueAndValidity();
        }
      } else {
        this.targetSettings.controls.targetSLA.setErrors({
          invalidSLANumber: true
        });
        this.targetSettings.updateValueAndValidity();
      }
    }
  }

  preventInputTurnaround(event) {
    if (this.targetSettings.get("turnAroundTime").value) {
      const isNumber = GlobalValidators.isAllNo(
        this.targetSettings.get("turnAroundTime").value
      );
      if (isNumber) {
        this.targetSettings.controls.turnAroundTime.setErrors(null);
        this.targetSettings.updateValueAndValidity();
        const value = this.targetSettings.get("thresholdTime").value;
        const turn = this.targetSettings.get("turnAroundTime").value;
        if (Number(value) > Number(turn)) {
          this.targetSettings.controls.thresholdTime.setErrors({
            invalidThreshold: true
          });
          this.targetSettings.updateValueAndValidity();
        } else {
          this.targetSettings.controls.thresholdTime.setErrors(null);
          this.targetSettings.updateValueAndValidity();
        }
      } else {
        this.targetSettings.controls.turnAroundTime.setErrors({
          invalidTurnNumber: true
        });
        this.targetSettings.updateValueAndValidity();
      }
    }
  }

  preventInputThreshold(event) {
    if (this.targetSettings.get("thresholdTime").value) {
      const isNumber = GlobalValidators.isAllNo(
        this.targetSettings.get("thresholdTime").value
      );
      if (isNumber) {
        this.targetSettings.controls.thresholdTime.setErrors(null);
        this.targetSettings.updateValueAndValidity();
        const value = this.targetSettings.get("thresholdTime").value;
        const turn = this.targetSettings.get("turnAroundTime").value;
        if (Number(value) > Number(turn)) {
          this.targetSettings.controls.thresholdTime.setErrors({
            invalidThreshold: true
          });
          this.targetSettings.updateValueAndValidity();
        } else {
          this.targetSettings.controls.thresholdTime.setErrors(null);
          this.targetSettings.updateValueAndValidity();
        }
      } else {
        this.targetSettings.controls.thresholdTime.setErrors({
          invalidThresholdNumber: true
        });
        this.targetSettings.updateValueAndValidity();
      }
    }
  }
  clearData() {
    this.isEdit = false;
    (Object as any).values(this.targetSettings.controls).forEach(control => {
      control.markAsUntouched();
    });

    this.targetSettings.get("period").setValue(null);
    this.targetSettings.get("targetSLA").setValue(null);
    this.targetSettings.get("turnAroundTime").setValue(null);
    this.targetSettings.get("thresholdTime").setValue("0");
    this.targetSettings.get("slaName").setValue(null);
    this.addTarget = false;
  }

  setSLACols() {
    this.cols = [
      { field: "id", header: "id", visible: false },
      { field: "period", header: "Month", visible: true },
      { field: "slaName", header: "SLA Name", visible: true },
      {
        field: "turnAroundTime",
        header: "Turn Around Time (Days)",
        visible: true
      },
      {
        field: "thresholdTime",
        header: "sla Threshold Days",
        visible: true
      },
      {
        field: "targetSLA",
        header: "Target SLA (%)",
        visible: true
      }
    ];
  }

  getSLAConfig() {
    this.taskManagementService.getSLAConfig();
    this.gridData = this.taskManagementService.slaConfigResponse;
    this.gridData = [];
    this.taskManagementService.getSLAConfigListner().subscribe((res: any) => {
      if (res) {
        const resArray = res.claimsSLATargets;
        const grdData = [];
        resArray.forEach(e => {
          const th = e.thresholdTime;
          const threshold =
            !th || th === null || th === "" || th === undefined ? 0 : th;
          grdData.push({
            id: e.id,
            period: this.datePipe.transform(e.period, "yyyy-MM"),
            slaName: e.slaName,
            turnAroundTime: e.turnAroundTime,
            thresholdTime: threshold,
            targetSLA: e.targetSLA
          });
          this.gridData = grdData;
        });
      }
    });
  }

  setTargetData(rowData) {
    const period = new Date(rowData.period);
    this.targetSettings.get("period").setValue(period);
    this.targetSettings.get("targetSLA").setValue(rowData.targetSLA);
    this.targetSettings.get("turnAroundTime").setValue(rowData.turnAroundTime);
    this.targetSettings.get("thresholdTime").setValue(rowData.thresholdTime);
    this.targetSettings.get("slaName").setValue(rowData.slaName);

    this.currentId = rowData.id;
  }

  editSLATarget(rowData) {
    this.isEdit = true;
    this.setTargetData(rowData);
    this.addTarget = true;
    this.scoreTable.reset();
  }

  saveTargetScore() {
    this.targetSLA = Number(this.targetSettings.get("targetSLA").value);
    this.saveTarget();
    this.clearData();
  }

  saveTarget() {
    const th = this.targetSettings.get("thresholdTime").value;
    !th || th === null || th === "" || th === undefined
      ? this.targetSettings.get("thresholdTime").setValue("0")
      : th;
    const {
      period,
      slaName,
      turnAroundTime,
      thresholdTime,
      targetSLA
    } = this.targetSettings.value;
    if (!this.isEdit) {
      const payload = {
        period: this.getFormattedDate(period, true),
        slaName,
        turnAroundTime,
        thresholdTime,
        targetSLA
      };
      this.taskManagementService.saveSlaConfig(payload);
    } else {
      const payload = {
        period: this.getFormattedDate(period, true),
        slaName,
        turnAroundTime,
        thresholdTime,
        targetSLA,
        id: this.currentId
      };
      this.taskManagementService.updateSlaConfig(payload);
    }
    this.scoreTable.reset();
    this.clearData();
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
