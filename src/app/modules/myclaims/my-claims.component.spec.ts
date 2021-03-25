import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MyClaimsComponent } from "./my-claims.component";
import { RouterTestingModule } from "@angular/router/testing";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { CommonModule, DatePipe } from "@angular/common";
import { ConfirmationService } from "primeng/api";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of } from "rxjs";
import { MyClaims } from "src/app/services/task-management/models/MyClaims";
import { Router } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

describe("MyClaimsComponent", () => {
  let component: MyClaimsComponent;
  let fixture: ComponentFixture<MyClaimsComponent>;
  let service: TaskmanagementService;
  let service1: ConfirmationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyClaimsComponent],
      imports: [
        RouterTestingModule,
        TableModule,
        DropdownModule,
        ConfirmDialogModule,
        CommonModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        ConfirmationService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MyClaimsComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(TaskmanagementService);
    service1 = fixture.debugElement.injector.get(ConfirmationService);
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyClaimsComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(TaskmanagementService);
    service1 = fixture.debugElement.injector.get(ConfirmationService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("getFilteredUsers", () => {
    const event = { filteredValue: [{ Test: "Test" }] };
    component.getFilteredUsers(event);
    expect(component.filteredValues).toEqual(event.filteredValue);
  });

  it("confirmAndNavigate", async(() => {
    const spy = spyOn(service1, "confirm");
    component.confirmAndNavigate(10, "Pended");
    expect(spy).toHaveBeenCalled();
  }));

  it("popupMessage", () => {
    const spy = spyOn(service1, "confirm");
    component.popupMessage("Pended");
    expect(spy).toHaveBeenCalled();
  });

  it("getPendReasonsListner", async(() => {
    const data: Array<{
      pendReasonCode: number;
      pendReason: string;
    }> = [{ pendReasonCode: 10, pendReason: "12" }];
    const spy = spyOn(service, "getPendReasonsListner").and.returnValue(
      of(data)
    );
    component.getPendReasons();
    expect(component.pendReasonList).toBe(data);
  }));

  it("getReAssignedRouteReasonsListner", async(() => {
    const routeReasonList: Array<{
      routeReasonCode: number;
      routeReason: string;
    }> = [{ routeReasonCode: 10, routeReason: "Test" }];
    const spy = spyOn(service, "getReAssignedRouteReasonsListner").and.returnValue(
      of(routeReasonList)
    );
    component.getRouteReasons();
    expect(component.routeReasonList).toEqual(routeReasonList);
  }));

  it("mapPendReasons", () => {
    component.pendReasonList = [{ pendReasonCode: 10, pendReason: "12" }];
    component.mapPendReasons();
    const pendReason = [
      { label: "All", value: null },
      { label: "12", value: "12" }
    ];
    expect(component.pendReason).toEqual(pendReason);
  });

  it("mapRouteReasons", () => {
    component.routeReasonList = [{ routeReasonCode: 10, routeReason: "12" }];
    component.mapRouteReasons();
    const routeReason = [
      { label: "All", value: null },
      { label: "12", value: "12" }
    ];
    expect(component.routeReason).toEqual(routeReason);
  });

  it("getClaimList", async(() => {
    const claimDetails: MyClaims[] = [
      {
        claimId: 946217084455,
        receivedDate: null,
        selectedReason: null,
        age: null,
        status: null,
        queueName: null,
        pendReason: null,
        firstPendDate: null,
        recentPendDate: null,
        comments: null
      }
    ];
    const spy = spyOn(service, "getClaimListListner").and.returnValue(
      of(claimDetails)
    );
    component.getClaimList('claimId');
    expect(component.claimList).toEqual(claimDetails);
  }));

  it('should export excel', () => {
    const claimDetails: MyClaims[] = [
      {
        claimId: 946217084455,
        receivedDate: null,
        selectedReason: null,
        age: null,
        status: 'Pended',
        queueName: null,
        pendReason: null,
        firstPendDate: null,
        recentPendDate: null,
        comments: null
      },
      {
        claimId: 946217084345,
        receivedDate: null,
        selectedReason: null,
        age: null,
        status: null,
        queueName: null,
        pendReason: null,
        firstPendDate: null,
        recentPendDate: null,
        comments: null
      }
    ];
    component.filteredValues = claimDetails;
    component.exportExcel();
    expect(component.getClaims().length).toEqual(2);
  });

  it('selectedCol', () => {
    component.selectedCol({field: 'claimId'}, '', {status: 'Pended', taskId: 1});
    component.selectedCol({field: 'claimId'}, '', {status: 'Routed In', taskId: 1});
    component.selectedCol({field: 'comments'}, '', {status: 'Pended'});
    component.selectedCol({field: 's.no'}, '', {status: 'Pended'});
    expect(component).toBeTruthy();
  });

  it('should select and navigate', () => {
    service.claimDetails = {
      claimId: '946217084455',
      age: null,
      status: 'Pended',
      queueName: null,
      pendReason: null,
      firstPendDate: null,
      comments: null,
      claimFactKey: 1,
      taskId: 1,
      claimReceivedDate: null,
      endTimer: '',
      lastPendDate: null,
      routeReason: ''
    };
    component.selectAndNavigate(1, 'Pended');
    expect(component).toBeTruthy();
  });

  it('should confirmAndNavigate accept', () => {
    const spy = spyOn(service1, "confirm").and.callFake((confirm) => confirm.accept());
    const router = fixture.debugElement.injector.get(Router);
    spyOn<any>(router, 'navigate').and.returnValue(true);
    component.confirmAndNavigate('test', 'test');
    expect(component).toBeTruthy();
  });
});
