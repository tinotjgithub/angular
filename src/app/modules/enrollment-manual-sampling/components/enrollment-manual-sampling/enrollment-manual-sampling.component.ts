import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors
} from "@angular/forms";
import { EnrollmentManualSamplingService } from "../../services/enrollment-manual-sampling.service";
import { NotifierService } from "src/app/services/notifier.service";
import { timeout, catchError } from "rxjs/operators";
import { ConfirmationService } from "primeng/api";
import { Router } from "@angular/router";
import { Accordion } from "primeng/accordion";
import { isNullOrUndefined } from "util";
import { ROLES } from "src/app/shared/constants.js";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
@Component({
  selector: "app-manual-sampling",
  templateUrl: "./enrollment-manual-sampling.component.html",
  providers: [ConfirmationService]
})
export class EnrollmentManualSamplingComponent implements OnInit {
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
  selectedUserGroup: { id: number; name: string }[];
  HdChecked: any = false;
  errorList: string[] = [];
  openUserGroup = false;
  divId = 0;
  today = new Date();
  yesterday: Date;
  minDate: Date;
  selectedWorkCategoryList: any;
  selectedTransactionCategoryList: any;
  selectedBenefitPlanList: any;
  selectedUSerGroupsList: any;
  selectedPlanTypeList: any;
  selectedMemberGroupList: any;
  selectedEnrollmentSpecialistList: any;
  savedData: any;
  isAuditor: boolean;
  configuredWorkCategories: any;

  constructor(
    private formBuilder: FormBuilder,
    private samplingService: EnrollmentManualSamplingService,
    private notifierService: NotifierService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getUserWorkItemTypes();
    this.getAvialableFilters();
    this.getAuditQueueCount();
    this.closeAllAccordionTabs();
    this.setDivId(2);
    this.isAuditor = this.authService.roleId === ROLES.enrollmentAuditor;
  }

  getUserWorkItemTypes() {
    this.samplingService.getUserWorkItemTypes().subscribe(res => {
      this.configuredWorkCategories = res;
    });
  }

  isWorkCategoryConfigured(workCategory){
    return (
      this.configuredWorkCategories &&  this.configuredWorkCategories.map(el => {
          return el.name.toString().toLowerCase();
        })
        .includes(workCategory.toString().toLowerCase())
    );
  }

  closeAllAccordionTabs() {
    if (
      this.getFormControl("processedFromDate").invalid ||
      this.getFormControl("processedToDate").invalid
    ) {
      this.notifierService.throwNotification({
        type: "error",
        message: "Please select two valid dates."
      });
      return;
    }
    this.loadClaimStatistics();
  }

  setDivId(id) {
    this.divId = id;
    this.selectedWorkCategoryList = this.getFormControl("selectedWorkCategory")
      .value
      ? this.getFormControl("selectedWorkCategory")
          .value.map(e => e.name)
          .join(",")
      : [];
    this.selectedTransactionCategoryList = this.getFormControl(
      "selectedTransactionCategory"
    ).value
      ? this.getFormControl("selectedTransactionCategory")
          .value.map(e => e.name)
          .join(",")
      : [];
    this.selectedBenefitPlanList = this.getFormControl("selectedBenefitPlan")
      .value
      ? this.getFormControl("selectedBenefitPlan")
          .value.map(e => e.name)
          .join(",")
      : [];
    this.selectedMemberGroupList = this.getFormControl("selectedMemberGroup")
      .value
      ? this.getFormControl("selectedMemberGroup")
          .value.map(e => e.name)
          .join(",")
      : [];
    this.selectedUSerGroupsList = this.getFormControl("selectedUserGroup").value
      ? this.getFormControl("selectedUserGroup")
          .value.map(e => e.name)
          .join(",")
      : [];
    this.selectedEnrollmentSpecialistList = this.getFormControl(
      "selectedEnrollmentSpecialist"
    ).value
      ? this.getFormControl("selectedEnrollmentSpecialist")
          .value.map(e => e.name)
          .join(",")
      : [];
    this.selectedPlanTypeList = this.getFormControl("selectedPlanType").value
      ? this.getFormControl("selectedPlanType")
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
          total,
          workbasket,
          reconciliation,
          fallout,
          newGroup,
          groupRenewal,
          idCardRequest,
          bulkTermination,
          otherTickets,
          paymentPosting
        } = res;

        this.formGroup.patchValue({
          total,
          workbasket,
          reconciliation,
          fallout,
          newGroup,
          groupRenewal,
          idCardRequest,
          bulkTermination,
          otherTickets,
          paymentPosting
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

  initializeClaimStatistics() {
    this.formGroup.patchValue({
      total: 0,
      workbasket: 0,
      reconciliation: 0,
      fallout: 0,
      newGroup: 0,
      groupRenewal: 0,
      idCardRequest: 0,
      bulkTermination: 0,
      otherTickets: 0,
      paymentPosting: 0
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
    this.minDate = new Date(new Date().setDate(new Date().getDate() - 90));
    this.formGroup = this.formBuilder.group({
      processedFromDate: [this.yesterday, Validators.required],
      processedToDate: [this.yesterday, Validators.required],

      availableWorkCategory: [],
      selectedWorkCategory: [],

      availableTransactionCategory: [],
      selectedTransactionCategory: [],

      availableBenefitPlans: [],
      selectedBenefitPlan: [],

      availableMemberGroups: [],
      selectedMemberGroup: [],

      availabelPlanTypes: [],
      selectedPlanType: [],

      avalaibelUSerGroups: [],
      selectedUserGroup: [],

      availableEnrollmentSpecialist: [],
      selectedEnrollmentSpecialist: [],

      totalCount: ["0", []],

      samplePercentage: [0, []],
      auditClaimsCount: [0],

      auditQueueCount: [0, []],
      selectedQueue: [undefined, []],

      // Statistics Data

      total: [0, []],
      workbasket: [0, []],
      reconciliation: [0, []],
      fallout: [0, []],
      newGroup: [0, []],
      groupRenewal: [0, []],
      idCardRequest: [0, []],
      bulkTermination: [0, []],
      otherTickets: [0, []],
      paymentPosting: [0, []],

      priority: ["Low", Validators.required]
    });
  }

  patchForm(savedData) {
    const { selectedUserGroup } = savedData;
    const param = (isNullOrUndefined(selectedUserGroup)
      ? []
      : selectedUserGroup
    ).map(el => {
      return el.id;
    });
    if (param.length !== 0) {
      this.samplingService
        .getAvailableEnrollmentSpecialists({ idsList: param })
        .subscribe(data => {
          this.setForm(savedData, data);
        });
      return;
    }
    this.setForm(savedData, []);
  }

  onMoveToTarget(evt) {
    const selectedUserGroup = this.getFormControl("selectedUserGroup").value;
    const param = selectedUserGroup.map(el => {
      return el.id;
    });
    if (
      this.getFormControl("selectedUserGroup").value &&
      this.getFormControl("selectedUserGroup").value.length === 0
    ) {
      this.getFormControl("selectedEnrollmentSpecialist").setValue([]);
    }
    this.samplingService
      .getAvailableEnrollmentSpecialists({ idsList: param })
      .subscribe(availableEnrollmentSpecialist => {
        this.formGroup.patchValue({
          availableEnrollmentSpecialist: this.removeFromSource(
            availableEnrollmentSpecialist,
            this.getFormControl("selectedEnrollmentSpecialist").value
          )
        });
      });
  }

  setAvailableilters() {
    const {
      userGroup,
      workCategory,
      transactionCategory,
      benefitPlan,
      memberGroup,
      planType
    } = this.availableFilters;
    this.formGroup.patchValue({
      avalaibelUSerGroups: userGroup,
      selectedUserGroup: [],
      availableWorkCategory: workCategory,
      selectedWorkCategory: [],
      availableTransactionCategory: transactionCategory,
      selectedTransactionCategory: [],
      availableBenefitPlans: benefitPlan,
      selectedBenefitPlan: [],
      availableMemberGroups: memberGroup,
      selectedMemberGroup: [],
      availabelPlanTypes: planType,
      selectedPlanType: [],
      selectedEnrollmentSpecialist: [],
      availableEnrollmentSpecialist: []
    });
  }

  setForm(savedData, availableEnrollmentSpecialist) {
    this.savedData = savedData;
    const {
      userGroup,
      workCategory,
      transactionCategory,
      benefitPlan,
      memberGroup,
      planType
    } = this.availableFilters;
    const {
      selectedUserGroup,
      selectedWorkCategory,
      selectedTransactionCategory,
      selectedBenefitPlan,
      selectedMemberGroup,
      selectedPlanType,
      totalPercentage: samplePercentage,
      selectedEnrollmentSpecialist
    } = savedData;
    this.formGroup.patchValue({
      processedFromDate: this.yesterday,
      processedToDate: this.yesterday,
      avalaibelUSerGroups: userGroup,
      selectedUserGroup,
      availableWorkCategory: this.removeFromSource(
        workCategory,
        selectedWorkCategory
      ),
      selectedWorkCategory,
      availableTransactionCategory: this.removeFromSource(
        transactionCategory,
        selectedTransactionCategory
      ),
      selectedTransactionCategory,
      availableBenefitPlans: this.removeFromSource(
        benefitPlan,
        selectedBenefitPlan
      ),
      selectedBenefitPlan,
      availableMemberGroups: this.removeFromSource(
        memberGroup,
        selectedMemberGroup
      ),
      selectedMemberGroup,
      availabelPlanTypes: this.removeFromSource(planType, selectedPlanType),
      selectedPlanType,
      availableEnrollmentSpecialist: this.removeFromSource(
        availableEnrollmentSpecialist,
        selectedEnrollmentSpecialist
      ),
      selectedEnrollmentSpecialist: isNullOrUndefined(
        selectedEnrollmentSpecialist
      )
        ? []
        : selectedEnrollmentSpecialist,

      samplePercentage
    });
  }

  constructParam() {
    const {
      processedFromDate,
      processedToDate,
      selectedWorkCategory,
      selectedTransactionCategory,
      selectedBenefitPlan,
      selectedMemberGroup,
      selectedUserGroup,
      selectedEnrollmentSpecialist
    } = this.formGroup.value;

    const from = this.convertDate(processedFromDate, "00:00:00");
    const to = this.convertDate(processedToDate, "23:59:59");

    const param = {
      processedFromDate: from,
      processedToDate: to,

      selectedWorkCategory: isNullOrUndefined(selectedWorkCategory)
        ? []
        : selectedWorkCategory.map(el => el.id),
      selectedTransactionCategory: isNullOrUndefined(
        selectedTransactionCategory
      )
        ? []
        : selectedTransactionCategory.map(el => el.id),
      selectedBenefitPlan: isNullOrUndefined(selectedBenefitPlan)
        ? []
        : selectedBenefitPlan.map(el => el.id),
      selectedMemberGroup: isNullOrUndefined(selectedMemberGroup)
        ? []
        : selectedMemberGroup.map(el => el.id),
      selectedUserGroup: isNullOrUndefined(selectedUserGroup)
        ? []
        : selectedUserGroup.map(el => el.id),
      selectedEnrollmentSpecialist: isNullOrUndefined(
        selectedEnrollmentSpecialist
      )
        ? []
        : selectedEnrollmentSpecialist.map(el => el.id)
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
    param[`totalPercentage`] = isNullOrUndefined(samplePercentage)
      ? 0
      : samplePercentage;
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
    if (
      this.getFormControl("processedFromDate").invalid ||
      this.getFormControl("processedToDate").invalid
    ) {
      this.notifierService.throwNotification({
        type: "error",
        message: "Please select two valid dates."
      });
      return;
    }
    const param = this.constructParam();
    param[`totalPercentage`] = isNullOrUndefined(
      this.getFormControl("samplePercentage").value
    )
      ? 0
      : this.getFormControl("samplePercentage").value;
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
          totalCount: res.totalCount
        });
        this.showSpinner = false;
        this.calculatePercentage();
        this.notifierService.throwNotification({
          type: "success",
          message: "Subscriptions Refreshed Successfully"
        });
      });
  }

  calculatePercentage() {
    const { totalCount, samplePercentage } = this.formGroup.value;
    if (samplePercentage > 100 || samplePercentage < 0) {
      this.notifierService.throwNotification({
        type: "warning",
        message: "Maximum % can appply is 100 and Minimum value is 0"
      });
      this.formGroup.patchValue({
        samplePercentage: samplePercentage > 100 ? 100 : 0,
        auditClaimsCount: totalCount
      });
      return;
    }
    const val = (totalCount / 100) * samplePercentage;
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
      totalCount,
      samplePercentage,
      auditClaimsCount,
      selectedQueue,
      priority
    } = this.formGroup.value;
    if (auditClaimsCount === 0) {
      this.notifierService.throwNotification({
        type: "error",
        message: "Audit Transaction Count Is Zero"
      });
      return;
    }
    const reqParam = {
      auditFilterDto: param,
      totalEnrollmentCount: totalCount,
      totalSamplingEnrollmentPercentage: samplePercentage,
      auditEnrollmentCount: auditClaimsCount,
      priorityLevel: priority
    };

    if (selectedQueue === "auditorQueue") {
      this.confirmationService.confirm({
        message:
          "Are you sure that you want to load the filtered subscriptions to Auditor Queue?",
        accept: () => {
          this.formGroup.patchValue({ priority: "Low" });
          this.samplingService.navigateToAuditorQue(reqParam);
        }
      });
    } else if (selectedQueue === "generalQueue") {
      this.showSpinner = true;
      this.samplingService.addToAuditQueue(reqParam).subscribe(
        res => {
          this.notifierService.throwNotification({
            type: "success",
            message: "Subscriptions Added To Audit Queue Successfully"
          });
          this.showSpinner = false;
          this.formGroup.patchValue({ priority: "Low" });
          this.getAuditQueueCount();
        },
        err => {
          this.showSpinner = false;
          this.notifierService.throwNotification({
            type: "success",
            message:
              "Subscriptions are not added to Queue, Something went wrong"
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
            type: "warning",
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
        totalCount: 0,
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
            console.log(key, keyError);
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
