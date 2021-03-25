import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPageComponent } from './list-page.component';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { NotificationComponent } from '../notification/notification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MessageService } from 'primeng/api';
import { NotificationModule } from '../notification.module';
import { TooltipModule } from 'primeng/tooltip';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { UserManagementService } from 'src/app/services/user-management/user-management.service';
import { of } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration/configuration.service';

describe('ListPageComponent', () => {
  let component: ListPageComponent;
  let fixture: ComponentFixture<ListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPageComponent, NotificationComponent ],
      imports: [
        CommonModule,
        CalendarModule,
        RouterTestingModule,
        FormsModule,
        TooltipModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TableModule,
        DialogModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        DatePipe,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get schedule details', () => {
    const service: ConfigurationService = fixture.debugElement.injector.get(ConfigurationService);
    spyOn(service, 'getSavedNotification').and.returnValue(of([{
      maintenanceMessage: 'Test',
      maintenanceFrom: 'Test',
      maintenanceTo: 'Test',
      fromTime: 'Test',
      toTime: 'Test',
    }]));
    component.ngOnInit();
    expect(component.upcomingMaintenance.length).toEqual(1);
  });

  it('should get schedule details - no data', () => {
    const service: ConfigurationService = fixture.debugElement.injector.get(ConfigurationService);
    spyOn(service, 'getSavedNotification').and.returnValue(of(''));
    component.ngOnInit();
    expect(component.upcomingMaintenance.length).toEqual(0);
  });

  it('functions', () => {
    const str = "test,ty";
    expect(component.processString(str)).toEqual("test, ty");
    expect(component.processString('')).toEqual("");
  });
});
