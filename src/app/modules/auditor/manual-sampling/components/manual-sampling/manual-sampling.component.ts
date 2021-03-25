import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors
} from "@angular/forms";
import { ManualSamplingService } from "../../services/manual-sampling.service";
import { NotifierService } from "src/app/services/notifier.service";
import { timeout, catchError } from "rxjs/operators";
import { ConfirmationService } from "primeng/api";
import { Router } from "@angular/router";
import { Accordion } from "primeng/accordion";
import { GlobalValidators } from "src/app/shared/validators";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { ROLES } from "src/app/shared/constants.js";

@Component({
  selector: "app-manual-sampling",
  templateUrl: "./manual-sampling.component.html",
  providers: [ConfirmationService]
})
export class ManualSamplingComponent implements OnInit {
  @ViewChild("accordion", { static: false }) accordion: Accordion;
  selectedCities: string[] = ["A", "B", "C"];
  checkListItem: { id: number; name: string }[];
  checkedItem: { id: number; name: string }[];
  values: string[];
  formGroup: FormGroup;
  availableFilters: any;
  showSpinner = false;
  // User Group Picklist
  avalaibelUSerGroups: { id: number; name: string }[];
  selectedUSerGroups: { id: number; name: string }[];
  HdChecked: any = false;
  errorList: string[] = [];
  openUserGroup = false;
  yesterday: Date;
  today = new Date();
  divId = 0;
  selectedPlanTypesList: any;
  selectedClaimExaminersList: any;
  selectedUSerGroupsList: any;
  selectedLobsList: any;
  isAuditor: boolean;
  proceduralResults: any;
  diagnosisResults: any;

  constructor(
    private formBuilder: FormBuilder,
    private samplingService: ManualSamplingService,
    private notifierService: NotifierService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getAvialableFilters();
    this.getAuditQueueCount();
    this.loadClaimStatistics();
    this.setDivId(2);
    this.isAuditor = this.authService.roleId === ROLES.auditor;
  }

  setDivId(id) {
    this.divId = id;
    this.selectedUSerGroupsList = this.getFormControl("selectedUSerGroups")
      .value
      ? this.getFormControl("selectedUSerGroups")
          .value.map(e => e.name)
          .join(",")
      : [];
    this.selectedClaimExaminersList = this.getFormControl(
      "selectedClaimExaminers"
    ).value
      ? this.getFormControl("selectedClaimExaminers")
          .value.map(e => e.name)
          .join(",")
      : [];
    this.selectedPlanTypesList = this.getFormControl("selectedPlanTypes").value
      ? this.getFormControl("selectedPlanTypes")
          .value.map(e => e.name)
          .join(",")
      : [];
    this.selectedLobsList = this.getFormControl("selectedLOBs").value
      ? this.getFormControl("selectedLOBs")
          .value.map(e => e.name)
          .join(",")
      : [];
  }

  loadClaimStatistics() {
    this.initializeClaimStatistics();
    const { processedFromDate, processedToDate } = this.formGroup.value;
    const from = this.convertDate(processedFromDate, "00:00:00");
    const to = this.convertDate(processedToDate, "23:59:59");
    const param = { processedFromDate: from, processedToDate: to };
    this.showSpinner = true;
    this.samplingService.loadClaimStatistics(param).subscribe(
      res => {
        this.showSpinner = false;

        const {
          otherClaims,
          checkIssued,
          paper,
          adjusted,
          edi,
          denied,
          professional,
          manuallyAdjudicated,
          autoAdjudicated,
          externallyPriced,
          checkNotIssued,
          institutionalIP,
          institutionalOP,
          totalClaims
        } = res;

        this.formGroup.patchValue({
          otherClaims,
          checkIssued,
          paper,
          adjusted,
          edi,
          denied,
          professional,
          manuallyAdjudicated,
          autoAdjudicated,
          externallyPriced,
          checkNotIssued,
          institutionalIP,
          institutionalOP,
          totalClaims
        });

        this.notifierService.throwNotification({
          type: "success",
          message: "Claim Statistics Loaded Successully"
        });
      },
      err => {
        this.showSpinner = false;
        this.notifierService.throwNotification({
          type: "error",
          message: "Claim Statistics Loading Failed"
        });
      }
    );
  }

  searchDiagnosisDesc(event) {
    let timer;
    clearTimeout(timer);
    if (event.query.length < 2) {
      this.diagnosisResults = [];
      return;
    } else {
      timer = setTimeout(() => {
        this.samplingService.getDiagnosisDescriptions(event.query).subscribe(
          data => {
            this.diagnosisResults = data;
          },
          error => {
            this.diagnosisResults = [];
          }
        );
      }, 1500);
    }
  }

  searchProcDesc(event) {
    let timer;
    clearTimeout(timer);
    if (event.query.length < 2) {
      this.proceduralResults = [];
      return;
    } else {
      timer = setTimeout(() => {
        this.samplingService.getProcedureDescriptions(event.query).subscribe(
          data => {
            this.proceduralResults = data;
          },
          error => {
            this.proceduralResults = [];
          }
        );
      }, 1500);
    }
  }

  selectDiagnosisCodes() {
    const array = [
      ...this.formGroup.get("selectedDiagnosisCodes").value
    ].map(x => (x ? { ...x, description: x.code } : null));
    const uniqueArray = array.filter((el, index) => {
      const item = JSON.stringify(el);
      return (
        index ===
        array.findIndex(obj => {
          return JSON.stringify(obj) === item;
        })
      );
    });
    this.formGroup.patchValue({
      selectedDiagnosisCodes: uniqueArray
    });
  }

  selectProcCodes() {
    const array = [
      ...this.formGroup.get("selectedProcedureCodes").value
    ].map(x => (x ? { ...x, description: x.code } : null));
    const uniqueArray = array.filter((el, index) => {
      const item = JSON.stringify(el);
      return (
        index ===
        array.findIndex(obj => {
          return JSON.stringify(obj) === item;
        })
      );
    });
    this.formGroup.patchValue({
      selectedProcedureCodes: uniqueArray
    });
  }

  initializeClaimStatistics() {
    this.formGroup.patchValue({
      otherClaims: 0,
      checkIssued: 0,
      paper: 0,
      adjusted: 0,
      edi: 0,
      denied: 0,
      professional: 0,
      manuallyAdjudicated: 0,
      autoAdjudicated: 0,
      externallyPriced: 0,
      checkNotIssued: 0,
      institutionalIP: 0,
      institutionalOP: 0,
      totalClaims: 0
    });
  }

  getAvialableFilters() {
    this.samplingService.getAvailableilterSettings().subscribe(res => {
      this.availableFilters = res;
      this.setAvailableilters();
      this.getSavedSettings();
    });
  }

  removeFromSource(source = [], target = []) {
    source = source === undefined || source === null ? [] : source;
    target = target === undefined || target === null ? [] : target;

    return source.filter(ar => !target.find(rm => rm.id === ar.id));
  }

  getSavedSettings() {
    this.samplingService.getSavedSettings().subscribe(res => {
      this.patchForm(res);
    });
  }

  initializeForm() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    this.yesterday = date;
    this.formGroup = this.formBuilder.group({
      processedFromDate: [this.yesterday, Validators.required],
      processedToDate: [this.yesterday, Validators.required],
      claimType: [],
      claimSource: [],
      claimStatus: [],
      availableClaimStatus: [],
      paymentStatus: [],
      selectedCities: [],
      HDStatus: [],
      billedAmount: [0, []],
      paidAmount: [0, []],
      processWorkFlows: [],

      avalaibelUSerGroups: [],
      selectedUSerGroups: [],

      availableClaimExaminers: [],
      selectedClaimExaminers: [],

      availabelPlanTypes: [],
      selectedPlanTypes: [],

      availabeLOBs: [],
      selectedLOBs: [],

      selectedDiagnosisCodes: [],
      selectedProcedureCodes: [],
      selectedProviderIds: [],
      selectedMemberIds: [],
      selectedMemberGroupCodes: [],
      totalClaimsCount: ["0", []],

      samplePercentage: [0, [Validators.max(100)]],
      auditClaimsCount: [0],

      auditQueueCount: [0, []],
      selectedQueue: [undefined, [Validators.required]],

      // Statistics Data
      otherClaims: [0, ""],
      checkIssued: [0, ""],
      paper: [0, ""],
      adjusted: [0, ""],
      edi: [0, ""],
      denied: [0, ""],
      professional: [0, ""],
      manuallyAdjudicated: [0, ""],
      autoAdjudicated: [0, ""],
      externallyPriced: [0, ""],
      checkNotIssued: [0, ""],
      institutionalIP: [0, ""],
      institutionalOP: [0, ""],
      totalClaims: [0, ""]
    });
  }

  patchForm(savedData) {
    const { userGroup: selectedUSerGroups } = savedData;
    const param = selectedUSerGroups.map(el => {
      return el.id;
    });
    if (param.length !== 0) {
      this.samplingService
        .getAvailableClaimExaminers({ idsList: param })
        .subscribe(availableClaimExaminers => {
          this.setForm(savedData, availableClaimExaminers);
        });
      return;
    }
    this.setForm(savedData, []);
  }

  onMoveToTarget(evt) {
    const selectedUSerGroups = this.getFormControl("selectedUSerGroups").value;
    const param = selectedUSerGroups.map(el => {
      return el.id;
    });
    if (
      this.getFormControl("selectedUSerGroups").value &&
      this.getFormControl("selectedUSerGroups").value.length === 0
    ) {
      this.getFormControl("selectedClaimExaminers").setValue([]);
    }
    this.samplingService
      .getAvailableClaimExaminers({ idsList: param })
      .subscribe(availableClaimExaminers => {
        this.formGroup.patchValue({
          availableClaimExaminers: this.removeFromSource(
            availableClaimExaminers,
            this.getFormControl("selectedClaimExaminers").value
          )
        });
      });
  }

  setAvailableilters() {
    const {
      userGroup,
      lineOfBusiness,
      planType,
      claimStatus
    } = this.availableFilters;
    this.formGroup.patchValue({
      avalaibelUSerGroups: userGroup,
      selectedUSerGroups: [],
      availabeLOBs: lineOfBusiness,
      selectedLOBs: [],
      availabelPlanTypes: planType,
      selectedPlanTypes: [],
      availableClaimExaminers: [],
      selectedClaimExaminers: [],
      availableClaimStatus: claimStatus ? claimStatus : []
    });
  }

  setForm(formData, availableClaimExaminers) {
    const { userGroup, lineOfBusiness, planType } = this.availableFilters;
    const {
      claimType,
      claimSource,
      claimStatus,
      paymentStatus,
      billedAmount,
      paidAmount,
      processWorkFlows,
      userGroup: selectedUSerGroups,
      claimExaminers: selectedClaimExaminers,
      lineOfBusiness: selectedLobs,
      planTypes: selectedPlanTypes,
      diagnosisCodes: selectedDiagnosisCodes,
      procedureCodes: selectedProcedureCodes,
      providers: selectedProviderIds,
      memberIds: selectedMemberIds,
      memberGroups: selectedMemberGroupCodes,
      totalSamplingClaimsPercentage: samplePercentage
    } = formData;

    let HDStatus = [];
    if (billedAmount !== 0 || paidAmount !== 0) {
      HDStatus = ["HD Only"];
      this.HdChecked = true;
    }

    this.formGroup.patchValue({
      processedFromDate: this.yesterday,
      processedToDate: this.yesterday,
      claimType,
      claimSource,
      claimStatus,
      paymentStatus,
      HDStatus,
      billedAmount,
      paidAmount,
      processWorkFlows,
      avalaibelUSerGroups: userGroup,
      selectedUSerGroups,
      availableClaimExaminers: this.removeFromSource(
        availableClaimExaminers,
        selectedClaimExaminers
      ),
      selectedClaimExaminers,
      availabeLOBs: this.removeFromSource(lineOfBusiness, selectedLobs),
      selectedLOBs: selectedLobs,
      availabelPlanTypes: this.removeFromSource(planType, selectedPlanTypes),
      selectedPlanTypes,
      selectedDiagnosisCodes: selectedDiagnosisCodes.map(el => {
        return { description: el.name, code: el.name };
      }),
      selectedProcedureCodes: selectedProcedureCodes.map(el => {
        return { description: el.name, code: el.name };
      }),
      selectedProviderIds: selectedProviderIds.map(el => {
        return el.code;
      }),
      selectedMemberIds: selectedMemberIds.map(el => {
        return el.code;
      }),
      selectedMemberGroupCodes: selectedMemberGroupCodes.map(el => {
        return el.code;
      }),
      samplePercentage
    });
  }

  onChangeHD(evt) {
    this.HdChecked = evt;
    this.formGroup.patchValue({
      paidAmount: 0,
      billedAmount: 0
    });
  }

  constructParam() {
    const {
      processedFromDate,
      processedToDate,
      claimType,
      claimSource,
      claimStatus,
      paymentStatus,
      billedAmount,
      paidAmount,
      processWorkFlows,
      selectedUSerGroups,
      selectedClaimExaminers,
      selectedLOBs,
      selectedPlanTypes,
      selectedDiagnosisCodes,
      selectedProcedureCodes,
      selectedProviderIds,
      selectedMemberIds,
      selectedMemberGroupCodes
    } = this.formGroup.value;

    const from = this.convertDate(processedFromDate, "00:00:00");
    const to = this.convertDate(processedToDate, "23:59:59");

    const param = {
      processedFromDate: from,
      processedToDate: to,

      claimType: claimType === null ? [] : claimType,
      claimSource: claimSource === null ? [] : claimSource,
      claimStatus: claimStatus === null ? [] : claimStatus,
      paymentStatus: paymentStatus === null ? [] : paymentStatus,
      billedAmount,
      paidAmount,
      processWorkFlows: processWorkFlows === null ? [] : processWorkFlows,
      selectedUserGroupIds:
        selectedUSerGroups === null
          ? []
          : selectedUSerGroups.map(el => {
              return el.id;
            }),
      selectedClaimExaminerUserIds:
        selectedClaimExaminers === null
          ? []
          : selectedClaimExaminers.map(el => {
              return el.id;
            }),
      selectedLobs:
        selectedLOBs === null
          ? []
          : selectedLOBs.map(el => {
              return el.name;
            }),
      selectedPlanTypes:
        selectedPlanTypes === null
          ? []
          : selectedPlanTypes.map(el => {
              return el.name;
            }),
      selectedDiagnosisCodes:
        selectedDiagnosisCodes === null
          ? []
          : selectedDiagnosisCodes.map(el => {
              return el.code;
            }),
      selectedProcedureCodes:
        selectedProcedureCodes === null
          ? []
          : selectedProcedureCodes.map(el => {
              return el.code;
            }),
      selectedProviderIds:
        selectedProviderIds === null ? [] : selectedProviderIds,
      selectedMemberIds: selectedMemberIds === null ? [] : selectedMemberIds,
      selectedMemberGroupCodes:
        selectedMemberGroupCodes === null ? [] : selectedMemberGroupCodes
    };
    return param;
  }

  saveSettings() {
    if (this.getFormValidationErrors(true)) {
      return this.listIssues();
    }
    const { samplePercentage } = this.formGroup.value;
    const param = this.constructParam();
    delete param.processedToDate;
    delete param.processedFromDate;
    param[`totalSamplingClaimsPercentage`] = samplePercentage;
    this.samplingService.saveSamplingSettings(param).subscribe(res => {
      this.notifierService.throwNotification({
        type: "success",
        message: "Settings Saved Successfully"
      });
    });
  }

  listIssues() {
    this.notifierService.throwNotification({
      type: "error",
      message: "Please Correct Listed Issues Before You Proceed"
    });
    window.scrollTo(0, 0);
  }

  onRefreshClick() {
    if (this.getFormValidationErrors()) {
      return this.listIssues();
    }
    const param = this.constructParam();
    this.showSpinner = true;
    this.samplingService
      .refreshClaimCount(param)
      .pipe(
        timeout(60000),
        catchError(e => {
          this.notifierService.throwNotification({
            type: "error",
            message: "Refresh timed out! Please try after sometime."
          });
          this.showSpinner = false;
          return null;
        })
      )
      .subscribe(res => {
        this.formGroup.patchValue({
          totalClaimsCount: res.totalClaimsCount
        });
        this.showSpinner = false;
        this.calculatePercentage();
        this.notifierService.throwNotification({
          type: "success",
          message: "Claims Refreshed Successfully"
        });
      });
  }

  calculatePercentage() {
    const { totalClaimsCount, samplePercentage } = this.formGroup.value;
    if (samplePercentage > 100 || samplePercentage < 0) {
      this.notifierService.throwNotification({
        type: "warning",
        message: "Maximum % can appply is 100 and Minimum value is 0"
      });
      this.formGroup.patchValue({
        samplePercentage: samplePercentage > 100 ? 100 : 0,
        auditClaimsCount: totalClaimsCount
      });
      return;
    }
    const val = (totalClaimsCount / 100) * samplePercentage;
    this.formGroup.patchValue({
      auditClaimsCount: Math.round(val)
    });
  }

  addToAuditQueue(queue) {
    this.formGroup.patchValue({
      selectedQueue: queue
    });
    if (this.getFormValidationErrors()) {
      return this.listIssues();
    }
    const param = this.constructParam();
    const {
      totalClaimsCount,
      samplePercentage,
      auditClaimsCount,
      selectedQueue
    } = this.formGroup.value;
    if (auditClaimsCount === 0) {
      this.notifierService.throwNotification({
        type: "error",
        message: "Audit Claims Count Is Zero"
      });
      return;
    } else if (!selectedQueue) {
      this.notifierService.throwNotification({
        type: "error",
        message: "Please select atleast one Audit Queue"
      });
      return;
    }
    const reqParam = {
      auditFilterDto: param,
      totalClaimsCount,
      samplingClaimsPercentage: samplePercentage,
      auditClaimsCount
    };

    if (selectedQueue === "auditorQueue") {
      this.confirmationService.confirm({
        message:
          "Are you sure that you want to load the filtered claims to Auditor Queue?",
        accept: () => {
          this.samplingService.navigateToAuditorQue(reqParam);
        }
      });
    } else if (selectedQueue === "generalQueue") {
      this.showSpinner = true;
      this.samplingService.addToAuditQueue(reqParam).subscribe(
        res => {
          this.notifierService.throwNotification({
            type: "success",
            message: "Claims Added To Audit Queue Successfully"
          });
          this.showSpinner = false;
          this.getAuditQueueCount();
        },
        err => {
          this.showSpinner = false;
          this.notifierService.throwNotification({
            type: "success",
            message: "Claims are not added to Queue, Something went wrong"
          });
        }
      );
    } else if (selectedQueue === "auditorsOwnQueue") {
      this.showSpinner = true;
      this.samplingService.addToAuditorsOwnQueue(reqParam).subscribe(
        res => {
          this.notifierService.throwNotification({
            type: "success",
            message: "Claims Added To The Queue Successfully"
          });
          this.showSpinner = false;
          this.getAuditQueueCount();
        },
        err => {
          this.showSpinner = false;
          this.notifierService.throwNotification({
            type: "success",
            message: "Claims are not added to Queue, Something went wrong"
          });
        }
      );
    }
  }

  getAuditQueueCount() {
    this.samplingService.getAuditQueueCount().subscribe(res => {
      const { auditQueueCount } = res;
      this.formGroup.patchValue({
        auditQueueCount,
        auditClaimsCount: 0,
        totalClaimsCount: 0,
        samplePercentage: 0
      });
    });
  }

  getFormControl(controlName) {
    return this.formGroup.get(controlName);
  }

  getFormValidationErrors(saveSettings = false) {
    this.errorList = [];
    if (!saveSettings) {
      Object.keys(this.formGroup.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.formGroup.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            switch (key) {
              case "processedToDate":
                this.errorList.push("Claim Processed Date To Is Required");
                break;
              case "processedFromDate":
                this.errorList.push("Claim Processed Date From Is Required");
                break;
            }
          });
        }
      });
    }

    if (this.HdChecked) {
      const { paidAmount, billedAmount } = this.formGroup.value;
      const validPaidAmount = GlobalValidators.isValidNumber(paidAmount);
      const validBilledAmount = GlobalValidators.isValidNumber(billedAmount);

      if (
        ((paidAmount <= 0 || paidAmount === null) &&
          (billedAmount <= 0 || billedAmount === null)) ||
        !validPaidAmount ||
        !validBilledAmount
      ) {
        this.errorList.push(
          "Paid amount & Billed amount should not be 0 or less when HD only is checked"
        );
      }
    }
    return this.errorList.length;
  }

  convertDate(date, suffix) {
    const year = new Date(date).getFullYear();
    const month = (1 + new Date(date).getMonth()).toString().padStart(2, "0");
    const day = new Date(date)
      .getDate()
      .toString()
      .padStart(2, "0");
    return year + "-" + month + "-" + day + " " + suffix;
  }
  splitValue(value: string) {
    return value ? value.split(",") : [];
  }
}
