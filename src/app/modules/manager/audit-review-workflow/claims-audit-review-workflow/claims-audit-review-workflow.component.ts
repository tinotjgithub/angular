import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormArray
} from "@angular/forms";
import { AuditorService } from "./../../../../services/auditor/auditor.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
@Component({
  selector: "app-claims-audit-review-workflow",
  templateUrl: './claims-audit-review-workflow.component.html',
  styleUrls: ['./claims-audit-review-workflow.component.css']
})
export class ClaimsAuditReviewWorkflowComponent implements OnInit {
  public roleGrp: FormGroup;
  rolesArray = [];
  workRoles: any = [];
  switchValue = "";
  public role: any[];
  selectedValues = [];
  roleList: any = {};
  public isrendered = false;
  isLeadDisabled = true;
  isManagerDisabled = true;
  isAuditorDisabled = true;

  constructor(
    private auditorService: AuditorService,
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
        this.workRoles[i].roleName === "Claims Lead"
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
    const payload = this.workRoles;
    this.auditorService.saveWorkFlowRoles(payload);
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
        rol.roleName === "Claims Lead"
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
    return (this.workRoles && this.workRoles.length > 0) ? this.workRoles.filter(e => e.isReviewWorkflowEnabled) : [];
  }

  getAsClass(roleName: string) {
    return roleName ? roleName.replace(' ', '').toLowerCase() : '';
  }

  createRoles() {
    const arr = this.workRoles.map(role => {
      return new FormControl(role.isReviewWorkflowEnabled || false);
    });
    this.isrendered = true;
    return new FormArray(arr);
  }

  getRoleActions() {
    this.auditorService.getWorkFlowRoles();
    this.role = this.auditorService.workFlowRoleResponse;
    this.role = [];
    this.auditorService.getWorkFlowRolesListner().subscribe(data => {
      this.role = data;
      this.createFormInputs(this.role);
    });
  }
}
