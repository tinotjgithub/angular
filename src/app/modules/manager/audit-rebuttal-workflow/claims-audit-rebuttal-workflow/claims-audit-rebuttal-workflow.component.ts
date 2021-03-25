

import { Component, OnInit } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { NotifierService } from "src/app/services/notifier.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuditRebuttalWorkflowService } from "./../services/audit-rebuttal-workflow.service";
import { ROLES } from "src/app/shared/constants";
@Component({
  selector: 'app-claims-audit-rebuttal-workflow',
  templateUrl: './claims-audit-rebuttal-workflow.component.html',
  styleUrls: ['./claims-audit-rebuttal-workflow.component.css']
})
export class ClaimsAuditRebuttalWorkflowComponent implements OnInit {
  formGroupLevel1: FormGroup;
  formGroupLevel2: FormGroup;
  formGroupLevel3: FormGroup;
  managerForm: FormGroup;
  leadForm: FormGroup;
  auditorForm: FormGroup;
  examinerForm: FormGroup;

  constructor(
    private messageService: NotifierService,
    private formBuilder: FormBuilder,
    private service: AuditRebuttalWorkflowService
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
      roleName: ROLES.lead
    });

    this.auditorForm = this.formBuilder.group({
      flowId: 0,
      roleId: 0,
      roleName: ROLES.auditor
    });

    this.examinerForm = this.formBuilder.group({
      flowId: 0,
      roleId: 0,
      roleName: ROLES.processor
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
      return item.roleName === ROLES.lead;
    })[0];
    const auditorDetails = res.filter(item => {
      return item.roleName === ROLES.auditor;
    })[0];
    const examinerDetails = res.filter(item => {
      return item.roleName === ROLES.processor;
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
    this.examinerForm.patchValue({
      flowId: examinerDetails.flowId,
      roleId: examinerDetails.roleId,
      roleName: examinerDetails.roleName
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
        flowId: this.examinerForm.get("flowId").value,
        roleId: this.examinerForm.get("roleId").value,
        roleName: this.examinerForm.get("roleName").value,
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
