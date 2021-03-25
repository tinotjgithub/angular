import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LandingPageComponent } from "./landing-page.component";
import { RouterTestingModule } from "@angular/router/testing";
import { CommonModule } from "@angular/common";
import { GoogleChartsModule } from "angular-google-charts";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MessageService } from "primeng/api";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { of } from "rxjs";
import TodaysCount from "../models/TodaysCount";
import PieChartCount from "../models/PieChartCount";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ComponentsModule } from "src/app/shared/components/components.module";

import { TooltipModule } from "primeng/tooltip";
import { DatePipe } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

describe("LandingPageComponent", () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let service;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageComponent],
      imports: [
        RouterTestingModule,
        TooltipModule,
        DialogModule,
        TableModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        GoogleChartsModule,
        HttpClientTestingModule,
        HttpClientTestingModule,
        ComponentsModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        DatePipe
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(UserManagementService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageComponent);
    service = fixture.debugElement.injector.get(UserManagementService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("getLeadsTodaysStatusCount", async(() => {
    const payload: TodaysCount = {
      examinerCount: 10,
      routedCount: 10,
      routedInCount: 12,
      routedOutCount: 12,
      pendedCount: 12,
      completedCount: 12,
      clientVendorQueueCount: 12
    };
    const spy = spyOn(service, "getLeadsTodaysStatusCount").and.returnValue(
      of(payload)
    );
    component.ngOnInit();
    expect(component.todaysCount).toEqual(payload);
  }));

  it("getLeadsPieChartCount", async(() => {
    const payload: PieChartCount = {
      pendedCount: 15,
      assignedCount: 15,
      toDoCount: 15
    };
    spyOn(service, "getLeadsPieChartCount").and.returnValue(of(payload));
    const spy = spyOn(component, "setGraphData");
    component.ngOnInit();
    expect(component.piechartCount).toEqual(payload);
    expect(spy).toHaveBeenCalled();
  }));

  it("setGraphData", async(() => {
    const data = [
      ["Assigned", 1],
      ["Pended", 2],
      ["To Do", 3]
    ];
    const param = { pendedCount: 2, assignedCount: 1, toDoCount: 3 };
    component.setGraphData(param);
    expect(component.data).toEqual(data);
  }));
});
