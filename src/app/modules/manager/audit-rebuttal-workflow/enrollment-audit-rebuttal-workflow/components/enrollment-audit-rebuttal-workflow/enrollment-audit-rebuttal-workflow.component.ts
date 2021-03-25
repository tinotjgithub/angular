import { Component, OnInit } from "@angular/core";
import { NotifierService } from "src/app/services/notifier.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ROLES } from "src/app/shared/constants";
import { EnrollmentAuditRebuttalWorkflowService } from "../../services/enrollment-audit-rebuttal-workflow.service";

@Component({
  selector: "app-enrollment-audit-rebuttal-workflow",
  templateUrl: "./enrollment-audit-rebuttal-workflow.component.html",
  styleUrls: ["./enrollment-audit-rebuttal-workflow.component.css"]
})
export class EnrollmentAuditRebuttalWorkflowComponent implements OnInit {
  formGroupLevel1: FormGroup;
  formGroupLevel2: FormGroup;
  formGroupLevel3: FormGroup;
  managerForm: FormGroup;
  leadForm: FormGroup;
  auditorForm: FormGroup;
  specialistForm: FormGroup;

  constructor(
    private messageService: NotifierService,
    private formBuilder: FormBuilder,
    private service: EnrollmentAuditRebuttalWorkflowService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getSavedWorkFlowConfig();
  }

  initializeForm() {
    this.formGroupLevel1 = this.formBuilder.group({
      isLevelOneFlowEnabledForManager: [false],
      isLevelOneFlowEnabledForLead: [false]
    });
    this.formGroupLevel2 = this.formBuilder.group({
      isLevelTwoFlowEnabledForManager: [false],
      isLevelTwoFlowEnabledForLead: [false]
    });
    this.formGroupLevel3 = this.formBuilder.group({
      isLevelThreeFlowEnabledForManager: [false],
      isLevelThreeFlowEnabledForLead: [false]
    });

    this.managerForm = this.formBuilder.group({
      flowId: 0,
      roleId: 0,
      roleName: ROLES.manager
    });

    this.leadForm = this.formBuilder.group({
      flowId: 0,
      roleId: 0,
      roleName: ROLES.enrollmentLead
    });

    this.auditorForm = this.formBuilder.group({
      flowId: 0,
      roleId: 0,
      roleName: ROLES.enrollmentAuditor
    });

    this.specialistForm = this.formBuilder.group({
      flowId: 0,
      roleId: 0,
      roleName: ROLES.enrollmentSpecialist
    });

    this.formGroupLevel2.setValidators(this.AtLeastOneFieldValidator);
    this.formGroupLevel3.setValidators(this.AtLeastOneFieldValidator);
  }

  getSavedWorkFlowConfig() {
    this.service.getSavedWorkFlowConfig().subscribe(res => {
      if (res.length !== 0) {
        this.patchForm(res);
      } else {
        this.messageService.throwNotification({
          type: "error",
          message: "No settings has been saved"
        });
      } 
    });
  }

  patchForm(res: any[]) {
    const managerDetails = res.filter(item => {
      return item.roleName === ROLES.manager;
    })[0];
    const leadDetails = res.filter(item => {
      return item.roleName === ROLES.enrollmentLead;
    })[0];
    const auditorDetails = res.filter(item => {
      return item.roleName === ROLES.enrollmentAuditor;
    })[0];
    const specialistDetails = res.filter(item => {
      return item.roleName === ROLES.enrollmentSpecialist;
    })[0];

    this.formGroupLevel1.patchValue({
      isLevelOneFlowEnabledForManager: managerDetails.isLevelOneFlowEnabled,
      isLevelOneFlowEnabledForLead: leadDetails.isLevelOneFlowEnabled
    });

    this.formGroupLevel2.patchValue({
      isLevelTwoFlowEnabledForManager: managerDetails.isLevelTwoFlowEnabled,
      isLevelTwoFlowEnabledForLead: leadDetails.isLevelTwoFlowEnabled
    });

    this.formGroupLevel3.patchValue({
      isLevelThreeFlowEnabledForManager: managerDetails.isLevelThreeFlowEnabled,
      isLevelThreeFlowEnabledForLead: leadDetails.isLevelThreeFlowEnabled
    });

    this.leadForm.patchValue({
      flowId: leadDetails.flowId,
      roleId: leadDetails.roleId,
      roleName: leadDetails.roleName
    });
    this.managerForm.patchValue({
      flowId: managerDetails.flowId,
      roleId: managerDetails.roleId,
      roleName: managerDetails.roleName
    });
    this.auditorForm.patchValue({
      flowId: auditorDetails.flowId,
      roleId: auditorDetails.roleId,
      roleName: auditorDetails.roleName
    });
    this.specialistForm.patchValue({
      flowId: specialistDetails.flowId,
      roleId: specialistDetails.roleId,
      roleName: specialistDetails.roleName
    });
  }

  AtLeastOneFieldValidator(group: FormGroup): { [key: string]: any } {
    let isAtLeastOne = false;
    if (group && group.controls) {
      for (const control in group.controls) {
        if (
          group.controls.hasOwnProperty(control) &&
          group.controls[control].valid &&
          group.controls[control].value !== false
        ) {
          isAtLeastOne = true;
          break;
        }
      }
    }
    return isAtLeastOne ? null : { required: true };
  }

  onSave() {
    const {
      isLevelOneFlowEnabledForManager,
      isLevelOneFlowEnabledForLead
    } = this.formGroupLevel1.value;
    const {
      isLevelTwoFlowEnabledForManager,
      isLevelTwoFlowEnabledForLead
    } = this.formGroupLevel2.value;
    const {
      isLevelThreeFlowEnabledForManager,
      isLevelThreeFlowEnabledForLead
    } = this.formGroupLevel3.value;

    const payload = [
      {
        flowId: this.managerForm.get("flowId").value,
        roleId: this.managerForm.get("roleId").value,
        roleName: this.managerForm.get("roleName").value,
        isLevelOneFlowEnabled: isLevelOneFlowEnabledForManager,
        isLevelTwoFlowEnabled: isLevelTwoFlowEnabledForManager,
        isLevelThreeFlowEnabled: isLevelThreeFlowEnabledForManager
      },
      {
        flowId: this.leadForm.get("flowId").value,
        roleId: this.leadForm.get("roleId").value,
        roleName: this.leadForm.get("roleName").value,
        isLevelOneFlowEnabled: isLevelOneFlowEnabledForLead,
        isLevelTwoFlowEnabled: isLevelTwoFlowEnabledForLead,
        isLevelThreeFlowEnabled: isLevelThreeFlowEnabledForLead
      },
      {
        flowId: this.auditorForm.get("flowId").value,
        roleId: this.auditorForm.get("roleId").value,
        roleName: this.auditorForm.get("roleName").value,
        isLevelOneFlowEnabled: true,
        isLevelTwoFlowEnabled: true,
        isLevelThreeFlowEnabled: true
      },
      {
        flowId: this.specialistForm.get("flowId").value,
        roleId: this.specialistForm.get("roleId").value,
        roleName: this.specialistForm.get("roleName").value,
        isLevelOneFlowEnabled: true,
        isLevelTwoFlowEnabled: false,
        isLevelThreeFlowEnabled: false
      }
    ];

    this.service.saveWorkFlowConfig(payload).subscribe(res => {
      this.messageService.throwNotification({
        type: "success",
        message: "Workflow Config Saved Successfully"
      });
      this.patchForm(res);
    });
  }
}
