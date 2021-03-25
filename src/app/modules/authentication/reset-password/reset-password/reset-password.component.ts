import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalValidators } from 'src/app/shared/validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {

  public resetFrom: FormGroup;
  public resetFailed: boolean;
  public resetSuccess: boolean;
  public resetStarted: boolean;
  winSize: string;
  public errorMessage: string;
  private token: string;
  myIndex: number;
  private carouselTimer: any;

  constructor(
    private AuthService: AuthenticationService,
    private fb: FormBuilder,
    private notifierService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) {}

  ngOnInit() {
    this.winSize = "100vh";
    this.resetFrom = this.fb.group({
      newPassword: ["", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(18),
        GlobalValidators.passwordValidation
      ]],
      confirmPassword: ["", [Validators.required]]
    });
    this.resetFrom.setValidators(this.passwordMatch);
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
    if (this.token) {
      this.AuthService.checkResetToken(this.token).subscribe(res => {
        if (res && res.isTokenExpired) {
          this.notifierService.add({
            key: "errorKey",
            severity: "error",
            summary: "Error",
            detail: "The reset URL has expired",
          });
          this.router.navigateByUrl('/');
        }
      });
    } else {
      this.notifierService.add({
        key: "errorKey",
        severity: "error",
        summary: "Error",
        detail: "Invalid Reset URL",
      });
      this.router.navigateByUrl('/');
    }
  }

  ngAfterViewInit() {
    this.myIndex = 0;
    this.carousel();
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

  passwordMatch(fromGroup: FormGroup) {
    const password = fromGroup.value.newPassword;
    const confirmPassword = fromGroup.value.confirmPassword;

    if (password && confirmPassword) {
      return (password === confirmPassword) ? null : {
        passwordMatch: true
      };
    } else {
      return null;
    }
  }

  onResetSubmit() {
    if (this.resetFrom.invalid) {
      return;
    }
    const payload = {
      confirmPassword: this.resetFrom.value.confirmPassword,
      password: this.resetFrom.value.newPassword,
      token: this.token,
    };
    this.resetFailed = false;
    this.resetSuccess = false;
    this.resetStarted = true;
    this.AuthService.resetForgotPassword(payload).subscribe(res => {
      this.resetStarted = false;
      this.resetSuccess = true;
      this.resetFailed = false;
      this.notifierService.add({
        key: "successKey",
        severity: "success",
        summary: "Success",
        detail: "'Your password has been changed successfully",
      });
      this.router.navigateByUrl('/');
    }, err => {
      this.resetStarted = false;
      this.resetFailed = true;
      this.resetSuccess = false;
    });
  }

}
