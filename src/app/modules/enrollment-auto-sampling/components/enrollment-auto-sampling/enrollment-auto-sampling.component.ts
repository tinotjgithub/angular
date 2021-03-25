import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
  FormControl
} from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { timeout, catchError } from "rxjs/operators";
import { ConfirmationService } from "primeng/api";
import { Router } from "@angular/router";
import { Accordion } from "primeng/accordion";
import { GlobalValidators } from "src/app/shared/validators";
import { isNullOrUndefined } from "util";
import { EnrollmentManualSamplingService } from "src/app/modules/enrollment-manual-sampling/services/enrollment-manual-sampling.service";
import { EnrollmentAutoSamplingService } from "../../services/enrollment-auto-sampling.service";
@Component({
  selector: "app-enrollment-auto-sampling",
  templateUrl: "./enrollment-auto-sampling.component.html",
  styleUrls: ["./enrollment-auto-sampling.component.css"],
  providers: [ConfirmationService]
})
export class EnrollmentAutoSamplingComponent implements OnInit {
  @ViewChild("accordion", { static: false }) accordion: Accordion;
  selectedCities: string[] = ["A", "B", "C"];
  checkListItem: { id: number; name: string }[];
  checkedItem: { id: number; name: string }[];
  values: string[];
  formGroup: FormGroup;
  availableFilters: any;
  showSpinner = false;
  // User Group Picklist
  avalaibelUserGroup: { id: number; name: string }[];
  selectedUserGroup: { id: number; name: string }[];
  HdChecked: any = false;
  errorList: string[] = [];
  openUserGroup = false;
  dateChanged: boolean;
  divId = 0;
  yesterday: Date;
  minDate: Date;
  selectedWorkCategoryList: any;
  selectedTransactionCategoryList: any;
  selectedBenefitPlanList: any;
  selectedUserGroupList: any;
  selectedPlanTypeList: any;
  selectedMemberGroupList: any;
  selectedEnrollmentSpecialistList: any;
  savedData: any;

  constructor(
    private formBuilder: FormBuilder,
    private samplingService: EnrollmentAutoSamplingService,
    private notifierService: NotifierService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getAvialableFilters();
    this.setDivId(2);
  }

  splitValue(value: string) {
    return value ? value.split(",") : [];
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
    this.selectedUserGroupList = this.getFormControl("selectedUserGroup").value
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
    this.formGroup = this.formBuilder.group({
      availableWorkCategories: [],
      selectedWorkCategory: [],

      availableTransactionCategory: [],
      selectedTransactionCategory: [],

      availableBenefitPlan: [],
      selectedBenefitPlan: [],

      availableMemberGroup: [],
      selectedMemberGroup: [],

      avalaibelUserGroup: [],
      selectedUserGroup: [],

      availableEnrollmentSpecialist: [],
      selectedEnrollmentSpecialist: [],

      totalPercentage: [0, [Validators.max(100)]],

      // Percentage Values
      workbasketPercentage: [0, []],
      reconciliationPercentage: [0, []],
      falloutPercentage: [0, []],
      newGroupEnrollmentPercentage: [0, []],
      groupRenewalPercentage: [0, []],
      idCardRequestPercentage: [0, []],
      bulkTerminationPercentage: [0, []],
      otherTicketsPercentage: [0, []]
    });
  }

  patchForm(savedData) {
    const { selectedUserGroup } = savedData;
    const param = isNullOrUndefined(selectedUserGroup)
      ? []
      : selectedUserGroup.map(el => {
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

  onChangeUserGroup(evt) {
    const selectedUserGroup =
      this.getFormControl("selectedUserGroup").value || [];
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
      avalaibelUserGroup: userGroup,
      selectedUserGroup: [],
      availableWorkCategories: workCategory,
      selectedWorkCategory: [],
      availableTransactionCategory: transactionCategory,
      selectedTransactionCategory: [],
      availableBenefitPlan: benefitPlan,
      selectedBenefitPlan: [],
      availableMemberGroup: memberGroup,
      selectedMemberGroup: [],
      availabelPlanTypes: planType,
      selectedPlanTypes: [],
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
      memberGroup
    } = this.availableFilters;
    console.log("userGroup", userGroup);

    const {
      selectedWorkCategory,
      selectedTransactionCategory,
      selectedBenefitPlan,
      selectedMemberGroup,
      selectedUserGroup,
      selectedEnrollmentSpecialist,
      totalPercentage: totalPercentage,
      workbasketPercentage,
      reconciliationPercentage,
      falloutPercentage,
      newGroupEnrollmentPercentage,
      groupRenewalPercentage,
      idCardRequestPercentage,
      bulkTerminationPercentage,
      otherTicketsPercentage
    } = savedData;

    this.formGroup.patchValue({
      processedFromDate: this.yesterday,
      processedToDate: this.yesterday,
      avalaibelUserGroup: userGroup,
      selectedUserGroup,
      availableWorkCategories: this.removeFromSource(
        workCategory,
        selectedWorkCategory
      ),
      selectedWorkCategory,
      availableTransactionCategory: this.removeFromSource(
        transactionCategory,
        selectedTransactionCategory
      ),
      selectedTransactionCategory,
      availableBenefitPlan: this.removeFromSource(
        benefitPlan,
        selectedBenefitPlan
      ),
      selectedBenefitPlan,
      availableMemberGroup: this.removeFromSource(
        memberGroup,
        selectedMemberGroup
      ),
      selectedMemberGroup,

      availableEnrollmentSpecialist: this.removeFromSource(
        availableEnrollmentSpecialist,
        selectedEnrollmentSpecialist
      ),
      selectedEnrollmentSpecialist: isNullOrUndefined(
        selectedEnrollmentSpecialist
      )
        ? []
        : selectedEnrollmentSpecialist,

      workbasketPercentage,
      reconciliationPercentage,
      falloutPercentage,
      newGroupEnrollmentPercentage,
      groupRenewalPercentage,
      idCardRequestPercentage,
      bulkTerminationPercentage,
      otherTicketsPercentage,
      totalPercentage
    });
  }

  constructParam() {
    const {
      selectedWorkCategory,
      selectedTransactionCategory,
      selectedBenefitPlan,
      selectedMemberGroup,
      selectedUserGroup,
      selectedEnrollmentSpecialist,

      workbasketPercentage,
      reconciliationPercentage,
      falloutPercentage,
      newGroupEnrollmentPercentage,
      groupRenewalPercentage,
      idCardRequestPercentage,
      bulkTerminationPercentage,
      otherTicketsPercentage,
      totalPercentage
    } = this.formGroup.value;
    const param = {
      workbasketPercentage: isNullOrUndefined(workbasketPercentage)
        ? 0
        : workbasketPercentage,
      reconciliationPercentage: isNullOrUndefined(reconciliationPercentage)
        ? 0
        : reconciliationPercentage,
      falloutPercentage: isNullOrUndefined(falloutPercentage)
        ? 0
        : falloutPercentage,
      newGroupEnrollmentPercentage: isNullOrUndefined(
        newGroupEnrollmentPercentage
      )
        ? 0
        : newGroupEnrollmentPercentage,
      groupRenewalPercentage: isNullOrUndefined(groupRenewalPercentage)
        ? 0
        : groupRenewalPercentage,
      idCardRequestPercentage: isNullOrUndefined(idCardRequestPercentage)
        ? 0
        : idCardRequestPercentage,
      bulkTerminationPercentage: isNullOrUndefined(bulkTerminationPercentage)
        ? 0
        : bulkTerminationPercentage,
      otherTicketsPercentage: isNullOrUndefined(otherTicketsPercentage)
        ? 0
        : otherTicketsPercentage,
      totalPercentage: isNullOrUndefined(totalPercentage) ? 0 : totalPercentage,
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
    const param = this.constructParam();
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
      message: "Please review the Issues Before You Proceed"
    });
    this.setDivId(8);
  }

  getFormControl(controlName) {
    return this.formGroup.get(controlName);
  }

  displayWorkCategory(workCategory) {
    return (
      this.getFormControl("selectedWorkCategory").value &&
      this.getFormControl("selectedWorkCategory")
        .value.map(el => {
          return el.name.toString().toLowerCase();
        })
        .includes(workCategory.toString().toLowerCase())
    );
  }

  onMoveToTargetWorkCategory(list) {
    const array = list.items.map(el => el.name);
    const {
      workbasketPercentage,
      reconciliationPercentage,
      falloutPercentage,
      newGroupEnrollmentPercentage,
      groupRenewalPercentage,
      idCardRequestPercentage,
      bulkTerminationPercentage,
      paymentPostingPercentage,
      otherTicketsPercentage
    } = isNullOrUndefined(this.savedData)
      ? Object.assign({}, {})
      : this.savedData;
    array.forEach(element => {
      switch (element) {
        case "WORKBASKET":
          this.addControl("workbasketPercentage");
          workbasketPercentage && workbasketPercentage > 0
            ? this.getFormControl("workbasketPercentage").setValue(
                workbasketPercentage
              )
            : this.getFormControl("workbasketPercentage").setValue(0);
          break;
        case "RECONCILIATION":
          this.addControl("reconciliationPercentage");
          reconciliationPercentage && reconciliationPercentage > 0
            ? this.getFormControl("reconciliationPercentage").setValue(
                reconciliationPercentage
              )
            : this.getFormControl("reconciliationPercentage").setValue(0);
          break;
        case "FALLOUT":
          this.addControl("falloutPercentage");
          falloutPercentage && falloutPercentage > 0
            ? this.getFormControl("falloutPercentage").setValue(
                falloutPercentage
              )
            : this.getFormControl("falloutPercentage").setValue(0);
          break;
        case "NEW GROUP ENROLLMENT":
          this.addControl("newGroupEnrollmentPercentage");
          newGroupEnrollmentPercentage && newGroupEnrollmentPercentage > 0
            ? this.getFormControl("newGroupEnrollmentPercentage").setValue(
                newGroupEnrollmentPercentage
              )
            : this.getFormControl("newGroupEnrollmentPercentage").setValue(0);
          break;
        case "GROUP RENEWAL":
          this.addControl("groupRenewalPercentage");
          groupRenewalPercentage && groupRenewalPercentage > 0
            ? this.getFormControl("groupRenewalPercentage").setValue(
                groupRenewalPercentage
              )
            : this.getFormControl("groupRenewalPercentage").setValue(0);
          break;
        case "ID CARD REQUEST":
          this.addControl("idCardRequestPercentage");
          idCardRequestPercentage && idCardRequestPercentage > 0
            ? this.getFormControl("idCardRequestPercentage").setValue(
                idCardRequestPercentage
              )
            : this.getFormControl("idCardRequestPercentage").setValue(0);
          break;
        case "BULK TERMINATION":
          this.addControl("bulkTerminationPercentage");
          bulkTerminationPercentage && bulkTerminationPercentage > 0
            ? this.getFormControl("bulkTerminationPercentage").setValue(
                bulkTerminationPercentage
              )
            : this.getFormControl("bulkTerminationPercentage").setValue(0);
          break;
        case "OTHER TICKETS":
          this.addControl("otherTicketsPercentage");
          otherTicketsPercentage && otherTicketsPercentage > 0
            ? this.getFormControl("otherTicketsPercentage").setValue(
                otherTicketsPercentage
              )
            : this.getFormControl("otherTicketsPercentage").setValue(0);
          break;
      }
    });
  }

  addControl(control) {
    this.formGroup.addControl(control, new FormControl(""));
  }

  onMoveToSourceWorkCategory(list) {
    const array = list.items.map(el => el.name);
    array.forEach(element => {
      switch (element) {
        case "WORKBASKET":
          this.getFormControl("workbasketPercentage").setValue(0);
          this.formGroup.removeControl("workbasketPercentage");
          break;
        case "RECONCILIATION":
          this.getFormControl("reconciliationPercentage").setValue(0);
          this.formGroup.removeControl("reconciliationPercentage");
          break;
        case "FALLOUT":
          this.getFormControl("falloutPercentage").setValue(0);
          this.formGroup.removeControl("falloutPercentage");
          break;
        case "NEW GROUP ENROLLMENT":
          this.getFormControl("newGroupEnrollmentPercentage").setValue(0);
          this.formGroup.removeControl("newGroupEnrollmentPercentage");
          break;
        case "GROUP RENEWAL":
          this.getFormControl("groupRenewalPercentage").setValue(0);
          this.formGroup.removeControl("groupRenewalPercentage");
          break;
        case "ID CARD REQUEST":
          this.getFormControl("idCardRequestPercentage").setValue(0);
          this.formGroup.removeControl("idCardRequestPercentage");
          break;
        case "BULK TERMINATION":
          this.getFormControl("bulkTerminationPercentage").setValue(0);
          this.formGroup.removeControl("bulkTerminationPercentage");
          break;
        case "OTHER TICKETS":
          this.getFormControl("otherTicketsPercentage").setValue(0);
          this.formGroup.removeControl("otherTicketsPercentage");
          break;
      }
    });
  }
}
