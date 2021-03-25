import { Component, OnInit, AfterViewInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { style, transition, animate, trigger } from "@angular/animations";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { GlobalValidators } from 'src/app/shared/validators';
import { NgLocalization } from '@angular/common';
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  animations: [
    trigger("enter", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("500ms", style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit, AfterViewInit {
  roleList = Array();
  form = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [
      Validators.required
      /* Validators.minLength(8),
      Validators.maxLength(18),
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).*$/) */
    ]),
    roleSelected: new FormControl("", [Validators.required])
  });
  winSize: string;
  public loginFailed: boolean;
  public errorMessage: string;
  public isReset: boolean;
  public resetFrom: FormGroup;
  public resetFailed: boolean;
  public resetSuccess: boolean;
  public loginStarted: boolean;
  public resetStarted: boolean;
  forgotPwd: boolean;
  public forgotPwdForm: FormGroup;
  forgotLoading: boolean;
  public supportDetails: any;
  myIndex: number;
  private carouselTimer: any;
  public isSSO = true;
  private logout: boolean;

  constructor(
    private AuthService: AuthenticationService,
    private fb: FormBuilder,
    private userManagementService: UserManagementService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private notifierService: MessageService,
    private secureLocalStorage: CryptoService
  ) {
    this.isSSO = APP_CONFIG.LOGIN_OPTION === 'saml';
  }

  get username() {
    return this.form.get("username");
  }

  get password() {
    return this.form.get("password");
  }

  get roleSelected() {
    return this.form.get("roleSelected");
  }

  getSkillSet() {
    this.roleList = [];
    this.AuthService.getUserRoles();
    this.roleList = this.AuthService.roleResponse;
    this.AuthService.getUserRolesListner().subscribe(data => {
      this.roleList = data;
    });
  }

  ngAfterViewInit() {
    if (!this.isSSO) {
      this.myIndex = 0;
      this.carousel();
    }
    /* this.AuthService.isSSO.subscribe(val => {
      this.isSSO = val;
      if (!val) {
        this.getSkillSet();
      }
    }); */
  }

  carousel() {
    let i;
    const x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
      (x[i] as any).style.display = "none";
    }
    this.myIndex++;
    if (this.myIndex > x.length) {
      this.myIndex = 1;
    }
    (x[this.myIndex - 1] as any).style.display = "block";
    this.carouselTimer = setTimeout(() => this.carousel(), 5000);
  }

  ngOnInit() {
    this.winSize = "100vh";
    this.isSSO = APP_CONFIG.LOGIN_OPTION === 'saml';
    if (this.AuthService.checkIsAuthenticated()) {
      this.afterLogin();
    } else if (this.isSSO) {
      location.reload();
    } else {
      this.getSkillSet();
      this.route.queryParams.subscribe(param => {
        if (param) {
          this.resetSuccess = param.reset ? true : false;
          this.logout = param.logout ? true : false;
        } else {
          this.logout = false;
          this.resetSuccess = false;
        }
        if (this.logout) {
          this.notifierService.clear();
          this.notifierService.add({
            key: "successKey",
            severity: "success",
            detail: "Successfully Logged off."
          });
        }
      });
      this.resetFrom = this.fb.group({
        currentPassword: [
          "",
          [
            Validators.required
            /* Validators.minLength(8),
          Validators.maxLength(18),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).*$/) */
          ]
        ],
        newPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(18),
            GlobalValidators.passwordValidation
          ]
        ],
        confirmPassword: ["", [Validators.required]]
      });
      this.resetFrom.setValidators(this.passwordMatch);
     /*  this.AuthService.authUpdated.subscribe(val => {
        this.notifierService.clear();
        if (val && !val.isAuthenticated && !this.resetSuccess && this.logout) {
          this.notifierService.add({
            key: "successKey",
            severity: "success",
            detail: "Successfully Logged off."
          });
        }
      }); */
    }
    this.forgotPwdForm = this.fb.group({
      username: ["", [Validators.required]],
      role: ["", [Validators.required]]
    });
    this.getSupportDetails();
  }

  private afterLogin() {
    this.isSSO = false;
    this.AuthService.setLogin({
      success: true,
      token: this.secureLocalStorage.getItem("authToken"),
      roleId: this.secureLocalStorage.getItem("roleId")
    });
  }

  getSupportDetails() {
    this.userManagementService.getSupportDetails().subscribe((res) => {
      this.supportDetails = res;
    });
  }

  toggleReset() {
    this.isReset = !this.isReset;
  }

  passwordMatch(fromGroup: FormGroup) {
    const password = fromGroup.value.newPassword;
    const confirmPassword = fromGroup.value.confirmPassword;

    if (password && confirmPassword) {
      return password === confirmPassword
        ? null
        : {
            passwordMatch: true
          };
    } else {
      return null;
    }
  }

  onSubmit() {
    const thirtyMinutesLater = new Date();
    thirtyMinutesLater.setMinutes(thirtyMinutesLater.getMinutes() + 300);
    this.loginFailed = false;
    this.loginStarted = true;
    this.AuthService.login(this.form.value).subscribe(
      res => {
        this.loginStarted = false;
        if (res && res.passwordReset) {
          this.isReset = true;
          this.secureLocalStorage.setItem("isReset", "true");
          this.secureLocalStorage.setItem("authToken", res.jwttoken);
        } else {
          clearTimeout(this.carouselTimer);
          this.AuthService.setLogin({
            success: true,
            token: res.jwttoken,
            roleId: this.form.value.roleSelected
          });
        }
      },
      err => {
        this.loginStarted = false;
        this.loginFailed = true;
        if (err.status === 417) {
          this.errorMessage = err.error.message || "User already logged in.";
          this.confirmationService.confirm({
            message: "User already logged in. Do you want to force logout?",
            accept: () => {
              this.AuthService.forceLogout(this.form.value);
            }
          });
        } else if (err.error && err.error.message && err.error.message !== "") {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = "Invalid User";
        }
      }
    );
  }

  onResetSubmit() {
    this.resetFailed = false;
    this.resetSuccess = false;
    const payload = {
      currentPassword: this.resetFrom.value.currentPassword,
      password: this.resetFrom.value.newPassword,
      confirmPassword: this.resetFrom.value.confirmPassword
    };
    this.resetStarted = true;
    this.userManagementService.resetPassword(payload, true).subscribe(
      res => {
        this.resetStarted = false;
        this.resetSuccess = true;
        this.isReset = false;
        clearTimeout(this.carouselTimer);
        this.AuthService.logout(true);
      },
      err => {
        this.resetStarted = false;
        this.resetFailed = true;
        if (err.error && err.error.message && err.error.message !== "") {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = "Password reset failed, Please try again.";
        }
      }
    );
  }

  forgotPassword() {
    this.forgotPwd = true;
  }

  resetForgotPassword() {
    if (this.forgotPwdForm.invalid) {
      return;
    }
    const payload = {
      userName: this.forgotPwdForm.value.username,
      roleId: this.forgotPwdForm.value.role,
      domainUrl: location.origin
    };
    this.forgotLoading = true;
    this.AuthService.forgotPassword(payload).subscribe(res => {
      this.forgotLoading = false;
      this.forgotPwd = false;
      this.notifierService.add({
        key: "successKey",
        severity: "success",
        detail: "Password reset link sent to your registered email."
      });
    });
  }
  navigateToSSO() {
    this.AuthService.redirectSSO();
  }
}
