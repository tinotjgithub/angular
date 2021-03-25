import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ReprioritizeComponent } from "./reprioritize.component";
import { RouterTestingModule } from "@angular/router/testing";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule, Table } from "primeng/table";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { CheckboxModule } from "primeng/checkbox";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { ConfirmationService, Confirmation, FilterUtils, MessageService } from "primeng/api";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of } from "rxjs";
import { NotifierService } from "src/app/services/notifier.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { MultiSelectModule } from 'primeng/multiselect';

describe("ReprioritizeComponent", () => {
  let component: ReprioritizeComponent;
  let fixture: ComponentFixture<ReprioritizeComponent>;
  let service;
  let service1;
  let service2;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReprioritizeComponent],
      imports: [
        RouterTestingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        CalendarModule,
        DialogModule,
        TooltipModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        ConfirmDialogModule,
        CheckboxModule,
        HttpClientTestingModule,
        MultiSelectModule,
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        ConfirmationService,
        FilterUtils,
        MessageService
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ReprioritizeComponent);
    service = fixture.debugElement.injector.get(TaskmanagementService);
    service1 = fixture.debugElement.injector.get(NotifierService);
    service2 = fixture.debugElement.injector.get(ConfirmationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReprioritizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(TaskmanagementService);
    service1 = fixture.debugElement.injector.get(NotifierService);
    service2 = fixture.debugElement.injector.get(ConfirmationService);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set cols", () => {
    const cols = [
      { field: "claimId", header: "Claim ID" },
      { field: "claimQueueName", header: "Queue Name" },
      { field: "memberId", header: "Member Id" },
      { field: "memberName", header: "Member Name" },
      { field: "providerName", header: "Provider Name" },
      { field: "taxId", header: "Tax Id" },
      { field: "groupName", header: "Group Name" },
      { field: "taskStatus", header: "Status" },
    ];
    component.setCols();
    expect(component.cols).toEqual(cols);
  });

  it("shoud initialize page", async(() => {
    const spy = spyOn(component, "getUnassignedReprioritizeList");
    component.initializePage();
    expect(component.selectedValues).toEqual([]);
    expect(component.searchValue).toEqual("");
    expect(spy).toHaveBeenCalled();
  }));

  it("getUnassignedReprioritizeList", async(() => {
    const data = {
      claimDetails: [
        {
          id: 10,
          claimId: "2019101400000121",
          claimQueueName: "Missing Data Elements WB",
          memberId: "JB123452",
          memberName: "Johnny Blaze",
          providerName: "Physician Billing Services",
          taxId: "DUMMY",
          groupName: "Missing_data_team",
          taskStatus: "UNASSIGNED",
          claimPriorityStatus: false,
        },
      ],
    };
    spyOn(service, "getUnassignedReprioritizeList").and.returnValue(of(data));
    component.getUnassignedReprioritizeList();
    expect(component.gridData).toEqual(data.claimDetails);
  }));

  it("setSearchField", () => {
    component.searchFields = [
      {
        label: "test",
        value: 1,
      },
      {
        label: "test",
        value: 2,
      },
    ];
    const searchiled = {
      label: "test",
      value: 1,
    };
    component.searchField = undefined;
    component.setSearchField(1);
    expect(component.searchField).toEqual(searchiled);
  });

  it("check Empty", () => {
    const spy = spyOn(component, "getUnassignedReprioritizeList");
    component.searchValue = "Test";
    component.checkEmpty();
    expect(spy).not.toHaveBeenCalled();
    component.searchValue = "";
    component.checkEmpty();
    expect(spy).toHaveBeenCalled();
  });

  it("prepareParams", () => {
    const validParams = [
      { id: 1, status: true },
      { id: 2, status: true },
    ];
    const selectedValues = [
      { id: 1, sample: "" },
      { id: 2, sample: "" },
    ];
    const returns: any[] = component.prepareParams(selectedValues);
    expect(returns).toEqual(validParams);
  });

  it("submitSearch", () => {
    component.searchValue = "";
    const spy = spyOn(service1, "throwNotification");
    const spy1 = spyOn(service, "getPriorityListBySearch").and.returnValue(
      of({ claimDetails: true })
    );
    component.submitSearch();
    expect(spy).toHaveBeenCalled();
    component.searchValue = "Test";
    component.submitSearch();
    expect(spy1).toHaveBeenCalled();
    expect(component.gridData).toBe(true);
  });

  it("reprioritize", () => {
    component.selectedValues = [];
    const spy = spyOn(service1, "throwNotification");
    const spy2 = spyOn(service2, "confirm");
    component.reprioritize();
    expect(spy).toHaveBeenCalledTimes(1);

    component.selectedValues = [1, 2, 3];
    component.reprioritize();
    expect(spy2).toHaveBeenCalled();
  });

  it("doReprioritize", () => {
    component.selectedValues = [
      { id: 1, sample: "" },
      { id: 2, sample: "" },
    ];
    const spy1 = spyOn(component, "prepareParams");
    const spy2 = spyOn(service, "reprioritizeClaims").and.returnValue(of(true));
    component.doReprioritize();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it("reset table", () => {
    component.resetTable(null);
    component.resetTable({
      reset: () => console.log("reset"),
    });
    expect(component).toBeTruthy();
  });

  it("filter config", () => {
    component.setFilterConfig();
    // const filter: FilterUtils = fixture.debugElement.injector.get(FilterUtils);
    // tslint:disable-next-line: no-string-literal
    const custom = FilterUtils["custom"];
    expect(custom(null, "2")).toBeFalsy();
    expect(custom(2, "3")).toBeTruthy();
    expect(custom(null, null)).toBeTruthy();
  });

  it("sumbit search with different combinations", () => {
    spyOn(service, "getPriorityListBySearch").and.returnValue(
      of({ claimDetails: null })
    );
    component.searchValue = "Test";
    component.searchField = {
      value: "groupName",
    };
    component.submitSearch();
    component.searchField = {
      value: "memberId",
    };
    component.submitSearch();
    component.searchField = {
      value: "memberName",
    };
    component.submitSearch();
    component.searchField = {
      value: "providerName",
    };
    component.submitSearch();
    component.searchField = {
      value: "taxId",
    };
    component.submitSearch();
    component.searchField = {
      value: "status",
    };
    component.submitSearch();
    expect(component.gridData).toBeNull();
  });

  it("should reprioritize claim", () => {
    const confirmService: ConfirmationService = fixture.debugElement.injector.get(
      ConfirmationService
    );
    spyOn(confirmService, "confirm").and.callFake((confirm) =>
      confirm.accept()
    );
    component.selectedValues = ["test"];
    component.reprioritize();
    expect(component).toBeTruthy();
  });

  it("selectReprioritizableClaims", () => {
    component.selectReprioritizableClaims([], true);
    expect(component.allCheckbox).toBeTruthy();
    component.selectReprioritizableClaims([], false);
    expect(component.allCheckbox).toBeFalsy();
  });

  it("checkAll", () => {
    component.selectedValues = [{
      id: 123,
      taskStatus: 'TEST',
      claimPriorityStatus: false
    }];
    component.checkAll([
      {
        id: 123,
        taskStatus: 'TEST',
        claimPriorityStatus: false
      },
      {
        id: 123,
        taskStatus: 'TEST',
        claimPriorityStatus: true
      }
    ]);
    expect(component.allCheckbox).toBeTruthy();
    component.checkAll([]);
    expect(component.allCheckbox).toBeFalsy();
  });
});
