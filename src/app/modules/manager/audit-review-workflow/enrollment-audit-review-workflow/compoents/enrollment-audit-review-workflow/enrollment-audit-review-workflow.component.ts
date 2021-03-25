import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { EnrollmentAuditReviewWorkflowService } from "../../services/enrollment-audit-review-workflow.service";
import { NotifierService } from "src/app/services/notifier.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
@Component({
  selector: "app-enrollment-audit-review-workflow",
  templateUrl: "./enrollment-audit-review-workflow.component.html"
})
export class EnrollmentAuditReviewWorkflowComponent implements OnInit {
  public roleGrp: FormGroup;
  rolesArray = [];
  workRoles: any = [];
  public role: any[];
  selectedValues = [];
  switchValue = "";
  roleList: any = {};
  public isrendered = false;
  isLeadDisabled = true;
  isManagerDisabled = true;
  isAuditorDisabled = true;

  constructor(
    private service: EnrollmentAuditReviewWorkflowService,
    private notifierServive: NotifierService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.switchValue = this.authService.managerType;
    this.authService.updateManagerTypeListener().subscribe(data => {
      this.switchValue = data;
    });
    this.getRoleActions();
  }

  onChange(index, ischecked) {
    for (let i = 0; i <= this.workRoles.length; i++) {
      if (index === i) {
        this.workRoles[i].isReviewWorkflowEnabled = ischecked;
        this.workRoles[i].roleName === "Enrollment Lead"
          ? (this.isLeadDisabled = !this.workRoles[i].isReviewWorkflowEnabled)
          : this.workRoles[i].roleName === "Manager"
          ? (this.isManagerDisabled = !this.workRoles[i]
              .isReviewWorkflowEnabled)
          : (this.isAuditorDisabled = !this.workRoles[i]
              .isReviewWorkflowEnabled);
      }
    }
    this.saveRoleWorkFlow();
  }

  saveRoleWorkFlow() {
    if (
      this.isLeadDisabled &&
      this.isManagerDisabled &&
      this.isAuditorDisabled
    ) {
      this.notifierServive.throwNotification({
        type: "error",
        message: "Atleast one role need to be selected!"
      });
      return;
    } else {
      const payload = this.workRoles;
      this.service.saveEnrollmentWorkFlowRoles(payload).subscribe(
        data => {
          this.notifierServive.throwNotification({
            type: "success",
            message: "Workflow Updated Successfully!"
          });
        },
        err => {
          this.notifierServive.throwNotification({
            type: "error",
            message: "Workflow Update Failed!"
          });
        }
      );
    }
  }

  createFormInputs(role) {
    this.workRoles = [];
    if (role && role.length > 0) {
      role.forEach(rol => {
        this.workRoles.push({
          isReviewWorkflowEnabled: rol.isReviewWorkflowEnabled,
          isRoutingEnabled: rol.isRoutingEnabled,
          roleName: rol.roleName,
          id: rol.id
        });
        rol.roleName === "Enrollment Lead"
          ? (this.isLeadDisabled = !rol.isReviewWorkflowEnabled)
          : rol.roleName === "Manager"
          ? (this.isManagerDisabled = !rol.isReviewWorkflowEnabled)
          : (this.isAuditorDisabled = !rol.isReviewWorkflowEnabled);
      });
    }
    this.roleGrp = new FormGroup({
      roles: this.createRoles()
    });
  }

  getEnabledRoles() {
    return this.workRoles && this.workRoles.length > 0
      ? this.workRoles.filter(e => e.isReviewWorkflowEnabled)
      : [];
  }

  getAsClass(roleName: string) {
    return roleName ? roleName.replace(" ", "").toLowerCase() : "";
  }

  createRoles() {
    const arr = this.workRoles.map(role => {
      return new FormControl(role.isReviewWorkflowEnabled || false);
    });
    this.isrendered = true;
    return new FormArray(arr);
  }

  getRoleActions() {
    this.service.getEnrollmentReviewWorklowRoles().subscribe(roles => {
      this.role = roles;
      this.createFormInputs(this.role);
    });
  }
}
