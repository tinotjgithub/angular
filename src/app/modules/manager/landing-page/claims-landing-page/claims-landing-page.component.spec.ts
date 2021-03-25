// /* tslint:disable:no-unused-variable */
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { DebugElement } from '@angular/core';

// import { ClaimsLandingPageComponent } from './claims-landing-page.component';

// describe('ClaimsLandingPageComponent', () => {
//   let component: ClaimsLandingPageComponent;
//   let fixture: ComponentFixture<ClaimsLandingPageComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ClaimsLandingPageComponent ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ClaimsLandingPageComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsLandingPageComponent } from './claims-landing-page.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { GoogleChartsModule } from 'angular-google-charts';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { UserManagementService } from 'src/app/services/user-management/user-management.service';
import { TaskmanagementService } from 'src/app/services/task-management/taskmanagement.service';
import { of } from 'rxjs';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuditorService } from 'src/app/services/auditor/auditor.service';

describe('ClaimsLandingPageComponent', () => {
  let component: ClaimsLandingPageComponent;
  let fixture: ComponentFixture<ClaimsLandingPageComponent>;
  let service: UserManagementService;
  let taskService: TaskmanagementService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsLandingPageComponent],
      imports: [
        RouterTestingModule,
        CommonModule,
        GoogleChartsModule,
        HttpClientTestingModule,
        ConfirmDialogModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        ConfirmationService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(UserManagementService);
    taskService = fixture.debugElement.injector.get(TaskmanagementService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get manager active snapshot count', () => {
    spyOn(service, 'getManagersTodaysStatusCount').and.returnValue(of(
      {
        claimExaminerCount: 10,
        auditorCount: 10,
        userGroupCount: 10,
        leadUserCount: 10
      }
    ));
    const auditorService: AuditorService = fixture.debugElement.injector.get(AuditorService);
    spyOn(auditorService, 'getAuditStatusLeadManager').and.returnValue(of({
      reviewRebuttalCount: 1,
      routedInCount: 1
    }));
    component.ngOnInit();
    expect(component.activeUsers.auditorCount).toBe(10);
  });

  it('should get chart data', () => {
    const data: any = [
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          ToDo: 5,
          quename: "High Dollar WB",
          Pended: 21
        }
      }
    ];
    spyOn(taskService, 'getManagerClaimsStatus').and.returnValue(of(data));
    component.getStatusChartData();
    expect(component.dataStatus.length).toBe(1);
  });

  it('should get chart data - 2', () => {
    const data: any = [
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          ToDo: 5,
          quename: "High Dollar WB",
          Pended: 21
        }
      },
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          ToDo: 5,
          quename: "High Dollar WB",
          Pended: 21
        }
      },
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          ToDo: 5,
          quename: "High Dollar WB",
          Pended: 21
        }
      },
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          ToDo: 5,
          quename: "High Dollar WB",
          Pended: 21
        }
      },
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          ToDo: 5,
          quename: "High Dollar WB",
          Pended: 21
        }
      },
      {
        managerStatusDto: {
          quename: "High Dollar WB"
        }
      }
    ];
    spyOn(taskService, 'getManagerClaimsStatus').and.returnValue(of(data));
    component.getStatusChartData();
    expect(component.dataStatus.length).toBe(6);
  });

  it('No chart data', () => {
    spyOn(taskService, 'getManagerClaimsStatus').and.returnValue(of(null));
    component.getStatusChartData();
    expect(component.optionsStatusEnlarged.legend.position).toBe('none');
  });

  it('should get chart data > 7', () => {
    const data: any = [
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          'To-Do': 5,
          quename: "High Dollar WB",
          Pended: 21
        }
      },
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          'To-Do': 5,
          quename: "High Dollar WB",
          Pended: 21
        }
      },
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          ToDo: 5,
          quename: "High Dollar WB",
          Pended: 21
        }
      },
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          'To-Do': 5,
          quename: "High Dollar WB",
          Pended: 21
        }
      },
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          ToDo: 5,
          quename: "High Dollar WB",
          Pended: 21
        }
      },
      {
        managerStatusDto: {
          quename: "High Dollar WB"
        }
      },
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          'To-Do': 5,
          quename: "High Dollar WB",
          Pended: 21
        }
      },
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          'To-Do': 5,
          quename: "High Dollar WB",
          Pended: 21
        }
      },
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          'To-Do': null,
          quename: "High Dollar WB",
          Pended: 21
        }
      },
      {
        managerStatusDto: {
          Completed: 7,
          Assigned: 3,
          'To-Do': '23sa',
          quename: "High Dollar WB",
          Pended: 21
        }
      },
    ];
    spyOn(taskService, 'getManagerClaimsStatus').and.returnValue(of(data));
    component.getStatusChartData();
    expect(component.optionsStatusEnlarged.legend.position).toBe('top');
  });

  it("confirm & refresh", () => {
    try {
      const spi = spyOn(taskService, 'refreshClaimWorkBasket').and.returnValue(of(true));
      const confServ: ConfirmationService = fixture.debugElement.injector.get(ConfirmationService);
      spyOn(confServ, 'confirm').and.callFake(e => e.accept());
      component.confirm();
      expect(spi).toHaveBeenCalled();
    } catch (error) {}
  });

  it('resize', () => {
    (component.chart1 as any) = {
      ngOnChanges: () => console.log('changes')
    };
    component.onWindowResize('');
  });
});
