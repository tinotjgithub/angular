import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AuthenticationService } from "../../services/authentication.service";
import { MessageService } from "primeng/api";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { MultiSelectModule } from "primeng/multiselect";
import { ResetPasswordComponent } from "./reset-password.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { of, throwError } from "rxjs";
import { Observable } from "rxjs";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { RouterModule, ActivatedRoute, Router } from "@angular/router";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";

class MockTaskMgtService extends AuthenticationService {
  resetForgotPassword(): Observable<any> {
    return of("success");
  }
}

describe("ResetPasswordComponent", () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        MultiSelectModule,
        DialogModule,
        RouterModule.forRoot([]),
        ProgressSpinnerModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthenticationService, useClass: MockTaskMgtService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        DatePipe
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ResetPasswordComponent);
      service = fixture.debugElement.injector.get(AuthenticationService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  });

  describe("should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ResetPasswordComponent);
      service = fixture.debugElement.injector.get(AuthenticationService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service to save data", () => {
      component.resetFrom.get("newPassword").setValue("PromtHps@486");
      component.resetFrom.get("confirmPassword").setValue("PromtHps@486");
      const servSpy = spyOn(service, "resetForgotPassword").and.returnValue(
        of("success")
      );
      fixture.detectChanges();
      component.onResetSubmit();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should not call service in case of invalid password", () => {
      component.resetFrom.get("newPassword").setValue("6");
      component.resetFrom.get("confirmPassword").setValue("6");
      const servSpy = spyOn(service, "resetForgotPassword").and.returnValue(
        of("success")
      );
      fixture.detectChanges();
      component.onResetSubmit();
      expect(servSpy).not.toHaveBeenCalled();
    });
    it("should set resetStarted as false in case of error", () => {
      component.resetStarted = true;
      component.resetFrom.get("newPassword").setValue("PromtHps@486");
      component.resetFrom.get("confirmPassword").setValue("PromtHps@486");
      spyOn(service, "resetForgotPassword").and.returnValue(
        throwError({ status: 404 })
      );
      fixture.detectChanges();
      component.onResetSubmit();
      expect(component.resetStarted).toBeFalsy();
    });
    it("should set passwords match as null when they are equal", () => {
      component.resetStarted = true;
      component.resetFrom.get("newPassword").setValue("PromtHps@486");
      component.resetFrom.get("confirmPassword").setValue("PromtHps@486");
      fixture.detectChanges();
      const match = component.passwordMatch(component.resetFrom);
      expect(match).toEqual(null);
    });
    it("should set passwords as matched when they are not equal", () => {
      component.resetStarted = true;
      component.resetFrom.get("newPassword").setValue("PromtHps@486");
      component.resetFrom.get("confirmPassword").setValue("PromtHpps@486");
      fixture.detectChanges();
      const match = component.passwordMatch(component.resetFrom);
      expect(match).toEqual({ passwordMatch: true });
    });
  });

  it("token for reset", () => {
    const activatedRoute: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    const router: Router = fixture.debugElement.injector.get(Router);
    const spi = spyOn(router, 'navigateByUrl');
    spyOn(activatedRoute.snapshot.queryParamMap, "get").and.returnValue("2sdfs");
    const service: AuthenticationService = fixture.debugElement.injector.get(AuthenticationService);
    spyOn(service, 'checkResetToken').and.returnValue(of({isTokenExpired: true}));
    component.ngOnInit();
    expect(spi).toHaveBeenCalled();
  });

  it("token for reset - not expired", () => {
    const activatedRoute: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    const router: Router = fixture.debugElement.injector.get(Router);
    const spi = spyOn(router, 'navigateByUrl');
    spyOn(activatedRoute.snapshot.queryParamMap, "get").and.returnValue("2sdfs");
    const service: AuthenticationService = fixture.debugElement.injector.get(AuthenticationService);
    spyOn(service, 'checkResetToken').and.returnValue(of({isTokenExpired: false}));
    component.ngOnInit();
    expect(spi).not.toHaveBeenCalled();
  });
});
