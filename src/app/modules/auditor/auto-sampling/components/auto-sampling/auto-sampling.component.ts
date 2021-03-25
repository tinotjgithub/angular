import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { AutoSamplingService } from "../../services/auto-sampling.service";

@Component({
  selector: "app-auto-sampling",
  templateUrl: "./auto-sampling.component.html"
})
export class AutoSamplingComponent implements OnInit {
  formGroup: FormGroup;
  availableFilters: any = [];
  // User Group Picklist
  HdChecked: any;
  errorList: string[] = [];
  openUserGroup = false;
  HDValid = true;
  savedSettingsExist = false;
  divId: any;
  selectedUSerGroupsList: any;
  selectedPlanTypesList: any;
  selectedLobsList: any;
  constructor(
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    private samplingService: AutoSamplingService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getAvailableFilters();
    this.setDivId(1);
  }

  setDivId(id) {
    this.divId = id;
    this.selectedUSerGroupsList = this.getFormControl("userGroups")
      .value
      ? this.getFormControl("userGroups")
          .value.map(e => e.name)
          .join(",")
      : [];
    this.selectedPlanTypesList = this.getFormControl("planTypes").value
      ? this.getFormControl("planTypes")
          .value.map(e => e.name)
          .join(",")
      : [];
    this.selectedLobsList = this.getFormControl("lineOfBusiness").value
      ? this.getFormControl("lineOfBusiness")
          .value.map(e => e.name)
          .join(",")
      : [];
  }

  initializeForm() {
    this.formGroup = this.formBuilder.group({
      HDStatus: [],
      billedAmount: [0, [Validators.min(0)]],
      paidAmount: [0, [Validators.min(0)]],

      claimSources: [],
      claimTypes: [],

      lineOfBusiness: [],
      availableLineOfBusiness: [],

      paymentStatus: [],

      planTypes: [],
      availablePlanTypes: [],

      processWorkFlowExclusions: [],

      userGroups: [],
      availableUserGroups: [],
      claimSource: this.formBuilder.group({
        EDI: [0, [Validators.max(100), Validators.min(0)]],
        paper: [0, [Validators.max(100), Validators.min(0)]]
      }),

      claimType: this.formBuilder.group({
        Professional: [0, [Validators.max(100), Validators.min(0)]],
        "Institutional-IP": [0, [Validators.max(100), Validators.min(0)]],
        "Institutional-OP": [0, [Validators.max(100), Validators.min(0)]],
        Others: [0, [Validators.max(100), Validators.min(0)]]
      }),

      paymentstatus: this.formBuilder.group({
        Denied: [0, [Validators.max(100), Validators.min(0)]],
        "Check Issued": [0, [Validators.max(100), Validators.min(0)]],
        "Check Not Issued": [0, [Validators.max(100), Validators.min(0)]]
      }),
      totalSamplingClaimsPercentage: [
        0,
        [Validators.max(100), Validators.min(1), Validators.required]
      ]
    });
    this.setCustomValidator();
  }

  private setCustomValidator() {
    this.formGroup
      .get("claimSource")
      .setValidators(this.AtLeastOneFieldValidator);
    this.formGroup
      .get("claimType")
      .setValidators(this.AtLeastOneFieldValidator);
    this.formGroup
      .get("paymentstatus")
      .setValidators(this.AtLeastOneFieldValidator);
  }

  AtLeastOneFieldValidator(group: FormGroup): { [key: string]: any } {
    let isAtLeastOne = false;
    if (group && group.controls) {
      for (const control in group.controls) {
        if (
          group.controls.hasOwnProperty(control) &&
          group.controls[control].valid &&
          group.controls[control].value > 0
        ) {
          isAtLeastOne = true;
          break;
        }
      }
    }
    return isAtLeastOne ? null : { required: true };
  }

  getAvailableFilters() {
    this.samplingService.getAvailablFilters().subscribe(res => {
      this.availableFilters = res;
      this.setAvilableFilters();
      this.getSavedSettings();
    });
  }

  getSavedSettings() {
    this.samplingService.getSaved().subscribe(res => {
      this.savedSettingsExist = true;
      const {
        billedAmount,
        paidAmount,
        claimSources,
        claimTypes,
        lineOfBusiness,
        paymentStatus,
        planTypes,
        processWorkFlowExclusions,
        userGroups,
        totalSamplingClaimsPercentage
      } = res;

      let HDStatus = [];
      if (billedAmount !== 0 || paidAmount !== 0) {
        HDStatus = ["HD Only"];
        this.HdChecked = true;
      }

      this.formGroup.patchValue(
        {
          billedAmount,
          paidAmount,
          claimSources,
          claimTypes,
          lineOfBusiness,
          paymentStatus,
          planTypes,
          processWorkFlowExclusions,
          userGroups,
          HDStatus,
          totalSamplingClaimsPercentage
        },
        { emitEvent: false }
      );

      this.formGroup.get("paymentstatus").patchValue(
        {
          Denied: paymentStatus[0].Denied,
          "Check Issued": paymentStatus[0]["Check Issued"],
          "Check Not Issued": paymentStatus[0]["Check Not Issued"]
        },
        { emitEvent: false }
      );

      this.formGroup.get("claimType").patchValue(
        {
          Professional: claimTypes[0].Professional,
          "Institutional-IP": claimTypes[0]["Institutional-IP"],
          "Institutional-OP": claimTypes[0]["Institutional-OP"],
          Others: claimTypes[0].Others
        },
        { emitEvent: false }
      );

      this.formGroup.get("claimSource").patchValue(
        {
          EDI: claimSources[0].EDI,
          paper: claimSources[0].Paper
        },
        { emitEvent: false }
      );
      this.setAvilableFilters();
    });
  }

  onChangeHD(evt) {
    this.HdChecked = evt;
    this.formGroup.patchValue({
      paidAmount: 0,
      billedAmount: 0
    });
  }

  setAvilableFilters() {
    const { userGroups, lineOfBusiness, planTypes } = this.formGroup.value;
    const {
      lineOfBusiness: availableLineOfBusiness,
      planType: availablePlanTypes,
      userGroup: availableUserGroups
    } = this.availableFilters;
    this.formGroup.patchValue(
      {
        lineOfBusiness: lineOfBusiness === null ? [] : lineOfBusiness,
        availableLineOfBusiness: this.removeFromSource(
          availableLineOfBusiness,
          lineOfBusiness
        ),
        planTypes: planTypes === null ? [] : planTypes,
        availablePlanTypes: this.removeFromSource(
          availablePlanTypes,
          planTypes
        ),
        userGroups: userGroups === null ? [] : userGroups,
        availableUserGroups: this.removeFromSource(
          availableUserGroups,
          userGroups
        )
      },
      { emitEvent: false }
    );
    this.formGroup.valueChanges.subscribe(res => {
      this.setValidNumber();
      this.getFormValidationErrors();
    });
  }

  trunc(value) {
    this.notifierService.throwNotification({
      type: "warning",
      message: "Please enter a valid percentage value less than 100"
    });
    return Math.trunc(value / 10);
  }

  setValidNumber() {
    const { EDI, paper } = this.formGroup.get("claimSource").value;
    this.formGroup.get("claimSource").patchValue(
      {
        EDI: Math.abs(EDI > 100 ? this.trunc(EDI) : EDI),
        paper: Math.abs(paper > 100 ? this.trunc(paper) : paper)
      },
      { emitEvent: false }
    );

    const {
      Professional,
      "Institutional-IP": InstitutionalIP,
      "Institutional-OP": InstitutionalOP,
      Others
    } = this.formGroup.get("claimType").value;

    this.formGroup.get("claimType").patchValue(
      {
        Professional: Math.abs(
          Professional > 100 ? this.trunc(Professional) : Professional
        ),
        "Institutional-IP": Math.abs(
          InstitutionalIP > 100 ? this.trunc(InstitutionalIP) : InstitutionalIP
        ),
        "Institutional-OP": Math.abs(
          InstitutionalOP > 100 ? this.trunc(InstitutionalOP) : InstitutionalOP
        ),
        Others: Math.abs(Others > 100 ? this.trunc(Others) : Others)
      },
      { emitEvent: false }
    );

    const {
      Denied,
      "Check Issued": CheckIssued,
      "Check Not Issued": CheckNotIssued
    } = this.formGroup.get("paymentstatus").value;
    this.formGroup.get("paymentstatus").patchValue(
      {
        Denied: Math.abs(Denied > 100 ? this.trunc(Denied) : Denied),
        "Check Issued": Math.abs(
          CheckIssued > 100 ? this.trunc(CheckIssued) : CheckIssued
        ),
        "Check Not Issued": Math.abs(
          CheckNotIssued > 100 ? this.trunc(CheckNotIssued) : CheckNotIssued
        )
      },
      { emitEvent: false }
    );

    const {
      paidAmount,
      billedAmount,
      totalSamplingClaimsPercentage
    } = this.formGroup.value;
    this.formGroup.patchValue(
      {
        paidAmount: Math.abs(paidAmount),
        billedAmount: Math.abs(billedAmount),
        totalSamplingClaimsPercentage: Math.abs(
          totalSamplingClaimsPercentage > 100
            ? this.trunc(totalSamplingClaimsPercentage)
            : totalSamplingClaimsPercentage
        )
      },
      { emitEvent: false }
    );
  }

  removeFromSource(source = [], target = []) {
    source = source === undefined || source === null ? [] : source;
    target = target === undefined || target === null ? [] : target;
    return source.filter(ar => !target.find(rm => rm.id === ar.id));
  }

  getFormControl(controlName) {
    return this.formGroup.get(controlName);
  }

  getFormControlClaimType(controlName) {
    const formGroup = this.formGroup.get("claimType");
    return formGroup.get(controlName);
  }

  getFormControlClaimSource(controlName) {
    const formGroup = this.formGroup.get("claimSource");
    return formGroup.get(controlName);
  }

  getFormControlPaymentStatus(controlName) {
    const formGroup = this.formGroup.get("paymentstatus");
    return formGroup.get(controlName);
  }

  getFormValidationErrors() {
    this.errorList = [];
    this.HDValid = true;
    if (
      this.HdChecked &&
      this.formGroup.get("paidAmount").value <= 0 &&
      this.formGroup.get("billedAmount").value <= 0
    ) {
      this.errorList.push(
        "If HD is checked, either Billed amount or Paid amount or both should be a valid monetary value"
      );
      return;
    }
    if (this.formGroup.get("claimSource").invalid) {
      this.errorList.push(
        "Atleast one value in Claim Source should be a valid non zero percentage value and no negative values are allowed"
      );
      return;
    }
    if (this.formGroup.get("claimType").invalid) {
      this.errorList.push(
        "Atleast one value in Claim Type should be a valid non zero percentage value and no negative values are allowed"
      );
      return;
    }
    if (this.formGroup.get("paymentstatus").invalid) {
      this.errorList.push(
        "Atleast one value in Payment Status should be a valid non zero percentage value and no negative values are allowed"
      );
      return;
    }
    if (this.formGroup.get("totalSamplingClaimsPercentage").invalid) {
      this.errorList.push(
        "Sampling percentage should not be zero, and must be a valid % value"
      );
      return;
    }
  }

  saveSettings() {
    this.getFormValidationErrors();
    if (this.errorList.length !== 0) {
      this.notifierService.throwNotification({
        type: "error",
        message: "Please Correct The Errors Before Saving"
      });
      return;
    } else {
      const param = this.constructParam();
      this.samplingService.saveSettings(param).subscribe(res => {
        this.notifierService.throwNotification({
          type: "success",
          message: "Settings Saved Successfully"
        });
      });
    }
  }

  nullOrUndefined(val) {
    return val === null || val === undefined ? 0 : val;
  }

  constructParam() {
    const {
      totalSamplingClaimsPercentage,
      processWorkFlowExclusions,
      lineOfBusiness: selectedLobs,
      planTypes: selectedPlanTypes,
      userGroups: selectedUserGroupIds,
      billedAmount,
      paidAmount
    } = this.formGroup.value;

    const claimTypes = [
      {
        Professional: this.nullOrUndefined(
          this.getFormControlClaimType("Professional").value
        ),
        "Institutional-IP": this.nullOrUndefined(
          this.getFormControlClaimType("Institutional-IP").value
        ),
        "Institutional-OP": this.nullOrUndefined(
          this.getFormControlClaimType("Institutional-OP").value
        ),
        Others: this.nullOrUndefined(
          this.getFormControlClaimType("Others").value
        )
      }
    ];

    const paymentStatus = [
      {
        Denied: this.nullOrUndefined(
          this.getFormControlPaymentStatus("Denied").value
        ),
        "Check Issued": this.nullOrUndefined(
          this.getFormControlPaymentStatus("Check Issued").value
        ),
        "Check Not Issued": this.nullOrUndefined(
          this.getFormControlPaymentStatus("Check Not Issued").value
        )
      }
    ];

    const claimSources = [
      {
        EDI: this.nullOrUndefined(this.getFormControlClaimSource("EDI").value),
        Paper: this.nullOrUndefined(
          this.getFormControlClaimSource("paper").value
        )
      }
    ];

    const req = {
      processWorkFlowExclusions,
      selectedLobs: selectedLobs.map(el => {
        return el.name;
      }),
      selectedPlanTypes: selectedPlanTypes.map(el => {
        return el.name;
      }),
      selectedUserGroupIds: selectedUserGroupIds.map(el => {
        return el.id;
      }),
      claimSources,
      claimTypes,
      paymentStatus,
      billedAmount,
      paidAmount,
      totalSamplingClaimsPercentage: this.nullOrUndefined(
        totalSamplingClaimsPercentage
      )
    };

    return req;
  }
  splitValue(value: string) {
    return value ? value.split(',') : [];
  }
}
