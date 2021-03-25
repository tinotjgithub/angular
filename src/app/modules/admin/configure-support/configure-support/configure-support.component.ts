import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { NotifierService } from "src/app/services/notifier.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-configure-support",
  templateUrl: "./configure-support.component.html",
  styleUrls: ["./configure-support.component.css"],
})
export class ConfigureSupportComponent implements OnInit {
  formGroup: FormGroup;
  hasData = false;
  constructor(
    private fromBuilder: FormBuilder,
    private userManagementService: UserManagementService,
    private notifierService: NotifierService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.userManagementService.getSupportDetails().subscribe((res) => {
      if (
        res.helpDeskNumber !== null &&
        res.supportEmailDL != null &&
        res.adminOrManagerEmailDL != null
      ) {
        this.hasData = true;
      }
      this.formGroup.patchValue({
        helpDeskNumber: res.helpDeskNumber,
        supportEmailDL: res.supportEmailDL,
        adminOrManagerEmailDL: res.adminOrManagerEmailDL,
      });
    });

    this.formGroup = this.fromBuilder.group({
      helpDeskNumber: [
        "",
        [
          Validators.required,
          // Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        ],
      ],
      supportEmailDL: ["", [Validators.required, Validators.email]],
      adminOrManagerEmailDL: ["", [Validators.required, Validators.email]],
    });
  }

  getFormControl(controlName) {
    return this.formGroup.get(controlName);
  }

  submit() {
    const payload = this.formGroup.value;
    this.userManagementService.saveSupportDetails(payload).subscribe((res) => {
      this.initializeForm();
      this.notifierService.throwNotification({
        type: "success",
        message: "Details Saved Successully.",
      });
    });
  }

  conirmCancel() {
    this.confirmationService.confirm({
      message: "Are you sure want to Cancel the changes?",
      accept: () => {
        this.initializeForm();
      },
    });
  }
}
