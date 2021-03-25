import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureSupportComponent } from './configure-support.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MessageService, ConfirmationService, Confirmation } from 'primeng/api';
import { UserManagementService } from 'src/app/services/user-management/user-management.service';
import { of } from 'rxjs';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe('ConfigureSupportComponent', () => {
  let component: ConfigureSupportComponent;
  let fixture: ComponentFixture<ConfigureSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureSupportComponent ],
      imports: [
        CommonModule,
        CalendarModule,
        TooltipModule,
        RouterTestingModule,
        FormsModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        UserManagementService,
        ConfirmationService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initiate form', () => {
    const service: UserManagementService = fixture.debugElement.injector.get(UserManagementService);
    spyOn(service, 'getSupportDetails').and.returnValue(of({
      helpDeskNumber: '',
      supportEmailDL: '',
      adminOrManagerEmailDL: null
    }));
    component.ngOnInit();
    expect(component.hasData).toBeFalsy();
  });

  it('should initiate form with data from API', () => {
    const service: UserManagementService = fixture.debugElement.injector.get(UserManagementService);
    spyOn(service, 'getSupportDetails').and.returnValue(of({
      helpDeskNumber: '1234567',
      supportEmailDL: 'Test@gmail.com',
      adminOrManagerEmailDL: 'Test@gmail.com'
    }));
    component.ngOnInit();
    expect(component.hasData).toBeTruthy();
  });

  it('should able to submit the support details on update', () => {
    const service: UserManagementService = fixture.debugElement.injector.get(UserManagementService);
    spyOn(service, 'saveSupportDetails').and.returnValue(of('success'));
    component.submit();
    expect(component.hasData).toBeFalsy();
  });

  it('should able to cancel the updation', () => {
    const service: ConfirmationService = fixture.debugElement.injector.get(ConfirmationService);
    spyOn(service, 'confirm').and.callFake((confirm: Confirmation) => {
      return confirm.accept();
    });
    component.conirmCancel();
    expect(component.hasData).toBeFalsy();
  });
});
