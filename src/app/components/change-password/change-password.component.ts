import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { NotifierService } from "src/app/services/notifier.service";
import { GlobalValidators } from "src/app/shared/validators";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html"
})
export class ChangePasswordComponent implements OnInit {
  @Input()
  public headerNeeded: boolean;
  public resetForm: FormGroup;
  resetFailed: boolean;
  @Output()
  resetSuccess: EventEmitter<boolean> = new EventEmitter(false);
  errorMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private userManagementService: UserManagementService,
    private notifierService: NotifierService
  ) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      currentPassword: ["", [Validators.required]],
      newPassword: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(18),
          GlobalValidators.passwordValidation,
        ],
      ],
      confirmPassword: ["", [Validators.required]],
    });
    this.resetForm.setValidators(this.passwordMatch);
  }

  passwordMatch(fromGroup: FormGroup) {
    const password = fromGroup.value.newPassword;
    const confirmPassword = fromGroup.value.confirmPassword;

    if (password && confirmPassword) {
      return password === confirmPassword
        ? null
        : {
            passwordMatch: true,
          };
    } else {
      return null;
    }
  }

  onResetSubmit() {
    this.resetFailed = false;
    const payLoad = {
      currentPassword: this.resetForm.value.currentPassword,
      password: this.resetForm.value.newPassword,
      confirmPassword: this.resetForm.value.confirmPassword,
    };
    this.userManagementService.resetPassword(payLoad).subscribe(
      (res) => {
        this.notifierService.throwNotification({
          type: "success",
          message: "Password reset successful.",
        });
        this.resetSuccess.emit(true);
      },
      (err) => {
        this.resetFailed = true;
        this.resetSuccess.emit(false);
        if (err.error && err.error.message && err.error.message !== "") {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = "Password reset failed, Please try again.";
        }
      }
    );
  }
}
