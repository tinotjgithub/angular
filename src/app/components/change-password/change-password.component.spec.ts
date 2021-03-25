import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordComponent } from './change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { UserManagementService } from 'src/app/services/user-management/user-management.service';
import { of, throwError } from 'rxjs';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let userManagementService: UserManagementService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        UserManagementService,
        MessageService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userManagementService = fixture.debugElement.injector.get(UserManagementService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Reset submit - success', () => {
    spyOn(userManagementService, 'resetPassword').and.returnValue(of('test'));
    let resetSuccess = false;
    component.resetSuccess.subscribe(val => resetSuccess = val);
    component.onResetSubmit();
    expect(resetSuccess).toBeTruthy();
  });

  it('Reset submit - fail', () => {
    spyOn(userManagementService, 'resetPassword').and.returnValue(throwError({status: 400}));
    component.onResetSubmit();
    expect(component.resetFailed).toBeTruthy();
  });

  it('Reset submit - fail', () => {
    spyOn(userManagementService, 'resetPassword').and.returnValue(throwError({status: 400, error: {message: 'test'}}));
    component.onResetSubmit();
    expect(component.resetFailed).toBeTruthy();
  });

  it('Password Match', () => {
    const form = component.resetForm;
    form.patchValue({
      newPassword: 'Ksk@12345',
      confirmPassword: 'Ksk@12345'
    });
    component.passwordMatch(form);
    expect(form.hasError('passwordMatch')).toBeFalsy();
    form.patchValue({
      newPassword: 'Ksk@12345',
      confirmPassword: 'Ksk@123456'
    });
    component.passwordMatch(form);
    expect(form.hasError('passwordMatch')).toBeTruthy();
  });
});
