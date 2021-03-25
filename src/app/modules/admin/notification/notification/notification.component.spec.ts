import { async, ComponentFixture, TestBed  } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationComponent } from './notification.component';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { MessageService } from 'primeng/api';
import { ConfigurationService } from 'src/app/services/configuration/configuration.service';
import { throwError, of } from 'rxjs';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';


describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let service: ConfigurationService;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const getValidForm = (form: FormGroup) => {
    form.patchValue({
      message: 'Minimum Test Message',
      custom: 'test@email.com',
      emailSub: 'TestSubject',
      scheduledDate: today,
      scheduledDateTo: tomorrow
    });
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationComponent],
      imports: [
        CommonModule,
        CalendarModule,
        RouterTestingModule,
        FormsModule,
        TooltipModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        DatePipe,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(ConfigurationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Send Notification - Invalid form', () => {
    component.notificationForm.patchValue({
      emailTriggerDate: new Date()
    });
    component.sendNotification();
    component.sendNow();
    expect(component).toBeTruthy();
  });

  it('Send Notification - Success', () => {
    spyOn(service, 'sendNotification').and.returnValue(of('Test'));
    getValidForm(component.notificationForm);
    component.sendNotification();
    expect(component.getCustom.value).toBeNull();
  });

  it('Send Notification - Fail', () => {
    getValidForm(component.notificationForm);
    component.notificationForm.patchValue({
      users: ['Test', '', 'All'],
      scheduledDate: tomorrow,
      scheduledDateTo: tomorrow,
      emailTriggerDate: tomorrow
    });
    spyOn(service, 'sendNotification').and.returnValue(throwError({status: 400}));
    component.sendNotification();
    expect(component.getCustom.value).toBe('test@email.com');
  });

  it('Send Now - Success', () => {
    spyOn(service, 'sendNow').and.returnValue(of('Test'));
    getValidForm(component.notificationForm);
    component.sendNow();
    expect(component.getCustom.value).toBeNull();
  });

  it('Send Now - Fail', () => {
    getValidForm(component.notificationForm);
    component.notificationForm.patchValue({
      users: ['Test', '', 'All'],
      scheduledDate: tomorrow,
      scheduledDateTo: tomorrow,
      emailTriggerDate: tomorrow
    });
    spyOn(service, 'sendNow').and.returnValue(throwError({status: 400}));
    component.sendNow();
    expect(component.getCustom.value).toBe('test@email.com');
  });

  /* it('getters & function', () => {
    const tmrwStart = new Date(tomorrow);
    tmrwStart.setHours(0, 0, 0, 0);
    console.log(tmrwStart);
    getValidForm(component.notificationForm);
    component.notificationForm.patchValue({
      scheduledDate: tmrwStart,
      scheduledDateTo: tomorrow,
      emailTriggerDate: tomorrow,
      form: tmrwStart,
      to: tomorrow
    });
    component.validateDates();
    component.validateTime();
    expect(component.invalidDate).toBeFalsy();
    component.notificationForm.patchValue({
      scheduledDate: tomorrow,
      scheduledDateTo: tmrwStart,
      emailTriggerDate: tomorrow,
      form: tomorrow,
      to: tmrwStart
    });
    component.validateDates();
    expect(component.invalidDate).toBeTruthy();
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(tomorrow.getDate() + 1);
    dayAfterTomorrow.setHours(tomorrow.getHours(), tomorrow.getMinutes() + 1);
    const newDate = new Date();
    component.notificationForm.patchValue({
      scheduledDate: dayAfterTomorrow,
      scheduledDateTo: tmrwStart,
      emailTriggerDate: tomorrow,
      from: dayAfterTomorrow,
      to: newDate,
    });
    component.validateDates();
    component.validateTime();
    component.cancel();
    expect(component.invalidDate).toBeTruthy();
    expect(component.getFrom.value).toBe(dayAfterTomorrow);
    expect(component.getTo.value).toBe(newDate);
    expect(component.getEmailTriggerTime.value).toBe('');
    component.clearForm();
  }); */
});
