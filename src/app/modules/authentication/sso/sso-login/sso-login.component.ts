import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { ConfirmationService } from 'primeng/api';
import { UserManagementService } from 'src/app/services/user-management/user-management.service';
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Component({
  selector: 'app-sso-login',
  templateUrl: './sso-login.component.html',
  styleUrls: ['./sso-login.component.css']
})
export class SsoLoginComponent implements OnInit, AfterViewInit {
  myIndex: number;
  private carouselTimer: any;
  public role: number;
  public roleList: any[];
  private token: string;
  public loginStarted: boolean;
  public loginFailed: boolean;
  public errorMessage: any;
  public supportDetails: any;
  public isLogout = true;
  public show = false;

  constructor(
    private AuthService: AuthenticationService,
    private secureLocalStorage: CryptoService,
    private activatedRoute: ActivatedRoute,
    private notifierService: NotifierService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private userManagementService: UserManagementService,
  ) { }

  ngOnInit() {
    this.role = 0;
    this.show = false;
    this.token = this.activatedRoute.snapshot.queryParamMap.get('user-token');
    if (String(location.href).indexOf('logout') > -1) {
      this.getSupportDetails();
      this.isLogout = true;
      this.show = true;
      this.notifierService.throwNotification({
        type: 'error',
        message: "You are not an authorized user"
      });
    } else if (!this.token || String(location.href).indexOf('login') === -1) {
      window.open(`${APP_CONFIG.SERVER_API_URL}/saml/login?idp=${APP_CONFIG.ENTITY_ID}`, "_self");
    } else {
      this.getSupportDetails();
      this.show = true;
      this.isLogout = false;
      this.secureLocalStorage.setItem('isReset', true);
      this.secureLocalStorage.setItem("authToken", this.token);
      this.getRoles();
    }
  }

  ngAfterViewInit() {
    this.myIndex = 0;
    this.carousel();
  }

  carousel() {
    let i;
    const x = document.getElementsByClassName("mySlides");
    if (x && x.length > 0) {
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
  }

  getRoles() {
    this.roleList = [];
    this.AuthService.getRolesForSaml().subscribe(data => {
      this.roleList = (data && data.roles) ? data.roles : [];
      if (this.roleList.length === 1) {
        this.role = this.roleList[0].id;
        this.submit();
      }
    }, err => {
      this.confirmationService.confirm({
        message: 'No roles configured, Please contact the Administrator or Manager.',
        rejectVisible: false,
        acceptLabel: 'OK',
        accept: () => this.logout(),
        reject: () => this.logout()
      });
    });
  }

  logout() {
    localStorage.clear();
    window.open(`${APP_CONFIG.SERVER_API_URL}/saml/logout`, "_self");
  }

  submit() {
    if (!this.role) {
      return;
    }
    this.loginStarted = true;
    this.loginFailed = false;
    this.secureLocalStorage.setItem('isReset', true);
    const roleSelected = this.roleList.filter(r => String(r.id) === String(this.role))[0];
    this.AuthService.samlLogin(this.role).subscribe(res => {
      clearTimeout(this.carouselTimer);
      this.role = 0;
      this.loginStarted = false;
      this.secureLocalStorage.setItem('isReset', false);
      this.AuthService.setLogin({
        success: true,
        token: res.jwttoken,
        roleId: roleSelected.roleName
      });
    }, err => {
      this.loginStarted = false;
      this.loginFailed = true;
      if (err.status === 417) {
        this.errorMessage = err.error.message || "User already logged in.";
        this.confirmationService.confirm({
          message: "User already logged in. Do you want to force logout?",
          rejectVisible: true,
          acceptLabel: 'Yes',
          accept: () => {
            this.AuthService.forceLogoutSaml(this.role);
          },
        });
      } else if (err.error && err.error.message && err.error.message !== "") {
        this.errorMessage = err.error.message;
      } else {
        this.errorMessage = "Invalid User";
      }
    });
  }

  getSupportDetails() {
    this.userManagementService.getSupportDetails().subscribe((res) => {
      this.supportDetails = res;
    });
  }
}
