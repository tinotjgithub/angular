import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { TargetSettingsSaveRequestBody } from "src/app/services/task-management/models/targetSettingsRequestBody";
import { maxTarget, maxHour } from "./../../../../shared/constants";
import { GlobalValidators } from "src/app/shared/validators";
import { CryptoService } from "src/app/services/crypto-service/crypto.service.js";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { EnrollmentTargetSettingsService } from "./enrollment-target-settings.service";

@Component({
  selector: "app-enrollment-target-settings",
  templateUrl: "./enrollment-target-settings.component.html",
  styleUrls: ["./enrollment-target-settings.component.css"]
})
export class EnrollmentTargetSettingsComponent implements OnInit {
  @ViewChild("scoreTable", { static: false }) scoreTable;
  public targetSettings: FormGroup;
  isEdit = false;
  public maxValue = 0;
  public max = 0;
  public isQuality = true;
  public isSpecialistDailyWorking = false;
  public isSpecialistProductivity = false;
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
    private targetSettingsBuilder: FormBuilder,
    public datePipe: DatePipe,
    private secureLocalStorage: CryptoService,
    private authService: AuthenticationService,
    private enrollmentTargetSettingsService: EnrollmentTargetSettingsService
  ) {
    this.targetSettings = this.targetSettingsBuilder.group({
      endDate: [null, Validators.required],
      startDate: [null, Validators.required],
      target: [null, Validators.required],
      targetOption: ["Quality", Validators.required]
    });
  }

  ngOnInit() {
    this.maxValue = maxTarget;
    this.max = 3;
    this.getTargetScores();
    this.setQualityCols();
  }

  preventInput(event) {
    const value = this.targetSettings.get("target").value;
    if (this.targetSettings.get("target").value) {
      const isNumber = GlobalValidators.isValidNumber(
        this.targetSettings.get("target").value
      );
      if (isNumber) {
        if (value > this.maxValue) {
          event.preventDefault();
          this.isQuality || this.isSpecialistProductivity
            ? this.targetSettings
                .get("target")
                .setValue(parseInt(value.toString().substring(0, 2), 10))
            : this.targetSettings
                .get("target")
                .setValue(parseInt(value.toString().substring(0, 1), 10));
        }
      } else {
        this.targetSettings.controls.target.setErrors({
          invalidNumber: true
        });
        this.targetSettings.updateValueAndValidity();
      }
    }
  }

  onClickQuality() {
    this.isEdit = false;
    this.targetSettings.get("targetOption").setValue("Quality");
    this.isQuality = true;
    this.maxValue = maxTarget;
    this.max = 3;
    this.isSpecialistProductivity = false;
    this.isSpecialistDailyWorking = false;
    this.setQualityCols();
    this.getTargetScores();
    this.clearData();
  }

  onClickSpecialistProductivity() {
    this.isEdit = false;
    this.targetSettings.get("targetOption").setValue("SpecialistProductivity");
    this.isQuality = false;
    this.maxValue = maxTarget;
    this.max = 3;
    this.isSpecialistProductivity = true;
    this.isSpecialistDailyWorking = false;
    this.setProdCols();
    this.getTargetScores();
    this.clearData();
  }

  onClickSpecialistDailyWorking() {
    this.isEdit = false;
    this.targetSettings.get("targetOption").setValue("SpecialistDailyWorking");
    this.isQuality = false;
    this.maxValue = maxHour;
    this.max = 2;
    this.isSpecialistProductivity = false;
    this.isSpecialistDailyWorking = true;
    this.setSplWrkCols();
    this.getTargetScores();
    this.clearData();
  }

  onClickAuditorDailyWorking() {
    this.isEdit = false;
    this.targetSettings.get("targetOption").setValue("AuditorDailyWorking");
    this.isQuality = false;
    this.maxValue = maxHour;
    this.max = 2;
    this.isSpecialistProductivity = false;
    this.isSpecialistDailyWorking = false;
    this.setAdtWrkCols();
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

  setQualityCols() {
    this.cols = [
      { field: "startPeriod", header: "Start Period", visible: true },
      { field: "endPeriod", header: "End Period", visible: true },
      {
        field: "qualityScoreTarget",
        header: "Quality Score Target",
        visible: true
      }
    ];
  }

  setSplWrkCols() {
    this.cols = [
      { field: "startPeriod", header: "Start Period", visible: true },
      { field: "endPeriod", header: "End Period", visible: true },
      {
        field: "dailyTarget",
        header: "Daily Working Hours Target",
        visible: true
      }
    ];
  }

  setAdtWrkCols() {
    this.cols = [
      { field: "startPeriod", header: "Start Period", visible: true },
      { field: "endPeriod", header: "End Period", visible: true },
      {
        field: "dailyTarget",
        header: "Daily Working Hours Target",
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
    this.enrollmentTargetSettingsService.getEnrollmentTarget();
    this.gridData = this.enrollmentTargetSettingsService.getEnrollmentTargetResponse;
    this.gridData = [];
    this.enrollmentTargetSettingsService
      .getEnrollmentTargetListner()
      .subscribe((data: any) => {
        this.gridData = this.isQuality
          ? data.qualityScoreTargetDtos
          : this.isSpecialistProductivity
          ? data.productivityTargetDtos
          : this.isSpecialistDailyWorking
          ? data.specialistWorkingHoursDtos
          : data.auditorWorkingHoursDtos;
      });
    this.maxValue =
      this.isQuality || this.isSpecialistProductivity ? maxTarget : maxHour;
    this.max = this.isQuality || this.isSpecialistProductivity ? 3 : 2;
  }

  setTargetData(rowData) {
    const endPeriod = new Date(rowData.endPeriod);
    const startPeriod = new Date(rowData.startPeriod);
    this.targetSettings.get("endDate").setValue(endPeriod);
    this.targetSettings.get("startDate").setValue(startPeriod);
    const targetVal = this.isQuality
      ? rowData.qualityScoreTarget
      : this.isSpecialistProductivity
      ? rowData.productivityTarget
      : rowData.dailyTarget;
    this.targetSettings.get("target").setValue(targetVal);
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
    if (this.isQuality) {
      if (!this.isEdit) {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          qualityScoreTarget: target
        };
        this.enrollmentTargetSettingsService.saveQualityTargetScore(payload);
      } else {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          qualityScoreTarget: target,
          id: this.currentId
        };
        this.enrollmentTargetSettingsService.updateQualityTargetScore(payload);
        this.addTarget = false;
      }
      this.scoreTable.reset();
    } else if (this.isSpecialistProductivity) {
      if (!this.isEdit) {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          productivityTarget: target
        };
        this.enrollmentTargetSettingsService.saveProductivityTargetScore(
          payload
        );
      } else {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          productivityTarget: target,
          id: this.currentId
        };
        this.enrollmentTargetSettingsService.updateProductivityTargetScore(
          payload
        );
        this.addTarget = false;
      }
      this.scoreTable.reset();
    } else if (this.isSpecialistDailyWorking) {
      if (!this.isEdit) {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          dailyTarget: target
        };
        this.enrollmentTargetSettingsService.saveSpecialistWorkingTargetScore(
          payload
        );
      } else {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          dailyTarget: target,
          id: this.currentId
        };
        this.enrollmentTargetSettingsService.updateSpecialistWorkingTargetScore(
          payload
        );
        this.addTarget = false;
      }
      this.scoreTable.reset();
    } else {
      if (!this.isEdit) {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          dailyTarget: target
        };
        this.enrollmentTargetSettingsService.saveAuditorWorkingTargetScore(
          payload
        );
      } else {
        const payload = {
          startPeriod: this.getFormattedDate(startDate, true),
          endPeriod: this.getFormattedDate(endDate, true),
          dailyTarget: target,
          id: this.currentId
        };
        this.enrollmentTargetSettingsService.updateAuditorWorkingTargetScore(
          payload
        );
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
