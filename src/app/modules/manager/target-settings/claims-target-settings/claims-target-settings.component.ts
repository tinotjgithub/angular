import { Component, OnInit, ViewChild } from "@angular/core";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { TargetSettingsSaveRequestBody } from "src/app/services/task-management/models/targetSettingsRequestBody";
import { maxTarget } from "./../../../../shared/constants";
import { GlobalValidators } from "src/app/shared/validators";
import { CryptoService } from "src/app/services/crypto-service/crypto.service.js";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { ROLES } from "./../../../../shared/constants.js";

@Component({
  selector: "app-claims-target-settings",
  templateUrl: "./claims-target-settings.component.html",
  styleUrls: ["./claims-target-settings.component.css"]
})
export class ClaimsTargetSettingsComponent implements OnInit {
  @ViewChild("scoreTable", { static: false }) scoreTable;
  public currentRole: string;
  public isManager = false;
  public targetSettings: FormGroup;
  isEdit = false;
  public isFinancial = true;
  public isProcedural = false;
  public gridData: any[];
  target: number;
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
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService,
    private authService: AuthenticationService
  ) {
    this.targetSettings = this.targetSettingsBuilder.group({
      endDate: [null, Validators.required],
      startDate: [null, Validators.required],
      target: [null, Validators.required],
      targetOption: ["Financial", Validators.required]
    });
  }

  ngOnInit() {
    this.currentRole = this.secureLocalStorage.getItem("roleId");
    this.isManager =
      this.currentRole && this.currentRole === ROLES.manager ? true : false;
    this.getTargetScores();
    this.setFinCols();
  }

  preventInput(event) {
    const value = this.targetSettings.get("target").value;
    if (this.targetSettings.get("target").value) {
      const isNumber = GlobalValidators.isValidNumber(
        this.targetSettings.get("target").value
      );
      if (isNumber) {
        if (value > maxTarget) {
          event.preventDefault();
          this.targetSettings
            .get("target")
            .setValue(parseInt(value.toString().substring(0, 2), 10));
        }
      } else {
        this.targetSettings.controls.target.setErrors({
          invalidNumber: true
        });
        this.targetSettings.updateValueAndValidity();
      }
    }
  }

  onClickFinancial() {
    this.isEdit = false;
    this.targetSettings.get("targetOption").setValue("Financial");
    this.isFinancial = true;
    this.isProcedural = false;
    this.setFinCols();
    this.getTargetScores();
    this.clearData();
  }

  onClickProcedural() {
    this.isEdit = false;
    this.targetSettings.get("targetOption").setValue("Procedural");
    this.isFinancial = false;
    this.isProcedural = true;
    this.setProcCols();
    this.getTargetScores();
    this.clearData();
  }

  onClickProductivity() {
    this.isEdit = false;
    this.targetSettings.get("targetOption").setValue("Productivity");
    this.isFinancial = false;
    this.isProcedural = false;
    this.setProdCols();
    this.getTargetScores();
    this.clearData();
  }

  clearData() {
    this.isEdit = false;
    this.targetSettings.controls.target.setErrors(null);
    this.targetSettings.controls.endDate.setErrors(null);
    this.targetSettings.controls.startDate.setErrors(null);
    this.targetSettings.controls.targetOption.setErrors(null);
    this.targetSettings.updateValueAndValidity();
    (Object as any).values(this.targetSettings.controls).forEach(control => {
      control.markAsUntouched();
    });
    this.targetSettings.get("endDate").setValue(null);
    this.targetSettings.get("startDate").setValue(null);
    this.targetSettings.get("target").setValue(null);
  }

  setFinCols() {
    this.cols = [
      { field: "startPeriod", header: "Start Period", visible: true },
      { field: "endPeriod", header: "End Period", visible: true },
      {
        field: "financialScores",
        header: "Financial Score Target",
        visible: true
      }
    ];
  }

  setProcCols() {
    this.cols = [
      { field: "startPeriod", header: "Start Period", visible: true },
      { field: "endPeriod", header: "End Period", visible: true },
      {
        field: "proceduralScores",
        header: "Procedural Score Target",
        visible: true
      }
    ];
  }

  setProdCols() {
    this.cols = [
      { field: "startPeriod", header: "Start Period", visible: true },
      { field: "endPeriod", header: "End Period", visible: true },
      {
        field: "productivityTarget",
        header: "Productivity Target",
        visible: true
      }
    ];
  }

  getTargetScores() {
    this.taskManagementService.getUserTarget();
    this.gridData = this.taskManagementService.userTargetResponse;
    this.gridData = [];
    this.taskManagementService.getUserTargetListner().subscribe((data: any) => {
      this.gridData = this.isFinancial
        ? data.financialTargetDtos
        : this.isProcedural
        ? data.proceduralTargetDtos
        : data.productivityTargetDtos;
    });
  }

  setTargetData(rowData) {
    const endPeriod = new Date(rowData.endPeriod);
    const startPeriod = new Date(rowData.startPeriod);
    this.targetSettings.get("endDate").setValue(endPeriod);
    this.targetSettings.get("startDate").setValue(startPeriod);
    this.isFinancial
      ? this.targetSettings.get("target").setValue(rowData.financialScores)
      : this.isProcedural
      ? this.targetSettings.get("target").setValue(rowData.proceduralScores)
      : this.targetSettings.get("target").setValue(rowData.productivityTarget);
    this.currentId = rowData.id;
  }

  editTarget(rowData) {
    this.isEdit = true;
    this.setTargetData(rowData);
    this.addTarget = true;
    this.scoreTable.reset();
  }

  checkEmpty(target, startDate, endDate) {
    let isValid = true;
    if (target === null || target === "") {
      this.targetSettings.controls.target.setErrors({
        required: true
      });
      this.targetSettings.updateValueAndValidity();
      isValid = false;
    } else if (
      startDate === "NaN-NaN-NaN" ||
      startDate === undefined ||
      startDate === null ||
      startDate === ""
    ) {
      this.targetSettings.controls.startDate.setErrors({
        required: true
      });
      this.targetSettings.updateValueAndValidity();
      isValid = false;
    } else if (
      endDate === undefined ||
      endDate === "NaN-NaN-NaN" ||
      endDate === null ||
      endDate === ""
    ) {
      this.targetSettings.controls.endDate.setErrors({
        required: true
      });
      this.targetSettings.updateValueAndValidity();
      isValid = false;
    }
    return isValid;
  }

  get getStartDate() {
    return this.targetSettings.controls.startDate;
  }

  get getEndDate() {
    return this.targetSettings.controls.endDate;
  }

  checkToDate() {
    if (
      this.getEndDate.value &&
      this.getEndDate.value < this.getStartDate.value
    ) {
      this.getEndDate.reset();
    }
  }

  saveTargetScore() {
    this.target = Number(this.targetSettings.get("target").value);
    this.saveTarget();
    this.clearData();
    this.targetSettings.updateValueAndValidity();
  }

  saveTarget() {
    const { startDate, endDate, target } = this.targetSettings.value;
    if (this.isFinancial) {
      if (!this.isEdit) {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          financialScores: target
        };
        this.taskManagementService.saveFinancialTargetScore(payload);
      } else {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          financialScores: target,
          id: this.currentId
        };
        this.taskManagementService.updateFinancialTargetScore(payload);
        this.addTarget = false;
      }
      this.scoreTable.reset();
    } else if (this.isProcedural) {
      if (!this.isEdit) {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          proceduralScores: target
        };
        this.taskManagementService.saveProceduralTargetScore(payload);
      } else {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          proceduralScores: target,
          id: this.currentId
        };
        this.taskManagementService.updateProceduralTargetScore(payload);
        this.addTarget = false;
      }
      this.scoreTable.reset();
    } else {
      if (!this.isEdit) {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          productivityTarget: target
        };
        this.taskManagementService.saveProductivityTargetScore(payload);
      } else {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          productivityTarget: target,
          id: this.currentId
        };
        this.taskManagementService.updateProductivityTargetScore(payload);
        this.addTarget = false;
      }
      this.scoreTable.reset();
    }
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
