import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ManageUsergroupComponent } from "./manage-usergroup.component";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { BaseHttpService } from "src/app/services/base-http.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AutoCompleteModule } from "primeng/autocomplete";
import { UsergroupManagementService } from "../../usergroup-management.service";
import { of } from "rxjs";
import UserGroup from "../models/UserGroup";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";

describe("ManageUsergroupComponent", () => {
  let component: ManageUsergroupComponent;
  let fixture: ComponentFixture<ManageUsergroupComponent>;
  let service;
  let service1;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageUsergroupComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        DialogModule,
        ConfirmDialogModule,
        ButtonModule,
        TableModule,
        TooltipModule,
        CardModule,
        HttpClientTestingModule,
        AutoCompleteModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        ConfirmationService,
        MessageService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ManageUsergroupComponent);
    service = fixture.debugElement.injector.get(UsergroupManagementService);
    service1 = fixture.debugElement.injector.get(ConfirmationService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call ConfirmationService", () => {
    const spy = spyOn(component, "cancelChanges");
    component.confirmCancel();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should call ConfirmationService", () => {
    const userServiceSpy = spyOn(service1, "confirm").and.callThrough();
    component.confirmDelete(-10);
    expect(userServiceSpy).toHaveBeenCalledTimes(1);
  });

  it("should call ConfirmationService", () => {
    const userServiceSpy = spyOn(
      service,
      "deleteUserGroupData"
    ).and.callThrough();
    component.deleteUserGroup(-10);
    expect(userServiceSpy).toHaveBeenCalledTimes(1);
  });

  it("User group should loads", async(() => {
    const payload: UserGroup[] = [
      {
        groupId: 11,
        groupName: "Quality_Audit_Team",
        leadUserMaster: { name: "Master", id: -1 },
        managerUserMaster: { name: "Master", id: -1 },
        target: 50,
        description: "Quality auditing",
        userGroupType: { id: 1, name: "Claims" },
        queueName: { queuename: "Quality Audit and Recovery WB", queueId: 3 }
      }
    ];
    spyOn(service, "getUserGroupListListener").and.returnValue(of(payload));
    component.ngOnInit();
    expect(component.userGroupList).toEqual(payload);
  }));

  it("deleteRow", () => {
    component.deleteRow({});
    expect(component.editing).toBeFalsy();
  });

  it("onRowEditInit", () => {
    const data = {
      groupId: "",
      groupName: "",
      description: "",
      queueName: "",
      target: "",
      userGroupType: "",
      managerId: "",
      leadId: 1
    };
    component.leads = [
      {
        value: 1,
        label: "Claims Lead 1"
      }
    ];
    component.onRowEditInit(data);
    expect(component.editing).toBeTruthy();
  });

  it("cancelChanges", () => {
    component.cancelChanges();
    expect(component.editing).toBeFalsy();
  });

  it("initializeForm", () => {
    component.userGroupForm.patchValue({
      groupId: 100
    });
    component.leadSearchText = "Test Search";
    component.initializeForm();
    expect(component.leadSearchText).not.toEqual("Test Search");
    expect(component.leadSearchText).toEqual("Search...");
  });

  it("queueNameCheck", () => {
    const payload: UserGroup[] = [
      {
        groupId: 11,
        groupName: "Quality_Audit_Team",
        leadUserMaster: { name: "Master", id: -1 },
        managerUserMaster: { name: "Master", id: -1 },
        target: 50,
        description: "Quality auditing",
        userGroupType: { id: 1, name: "Claims" },
        queueName: { queuename: "Quality Audit and Recovery WB", queueId: 3 }
      },
      {
        groupId: 15,
        groupName: "Quality_Audit_Team",
        leadUserMaster: { name: "Master", id: -1 },
        managerUserMaster: { name: "Master", id: -1 },
        target: 50,
        description: "Quality auditing",
        userGroupType: { id: 1, name: "Claims" },
        queueName: { queuename: "Quality Audit and Recovery WB", queueId: 3 }
      }
    ];
    component.userGroupList = payload;
    component.userGroupForm.patchValue({
      groupId: 15
    });
    const userServiceSpy = spyOn(service1, "confirm").and.callFake(confirm =>
      confirm.reject()
    );
    component.queueNameCheck(4);
    expect(userServiceSpy).not.toHaveBeenCalled();
    component.queueNameCheck(3);
    expect(userServiceSpy).toHaveBeenCalled();
  });

  it("onChangeManager", async(() => {
    const event = { value: 10 };
    const spy = spyOn(component, "getLeads");
    component.onChangeManager(event);
    expect(spy).toHaveBeenCalled();
  }));

  it("onChangeLead", () => {
    const event = { value: 10 };
    component.onChangeLead(event);
    expect(component.leadChanged).toBe(true);
  });

  it("getMangers", async(() => {
    const payload = [
      { label: "Manger 1", value: 11 },
      { label: "Manger 2", value: 2 },
      { label: "Manger 3", value: 3 }
    ];
    spyOn(service, "getManagersListListener").and.returnValue(of(payload));
    component.ngOnInit();
    expect(component.managers).toEqual(payload);
  }));

  it("getUserGroupTypes", async(() => {
    const payload = [
      { label: "UserGroupType 1", value: 1 },
      { label: "UserGroupType 2", value: 2 },
      { label: "UserGroupType 3", value: 3 }
    ];
    spyOn(service, "getGroupTypeListListener").and.returnValue(of(payload));
    component.ngOnInit();
    expect(component.workItemTypes).toEqual(payload);
  }));

  it("getQuenames", async(() => {
    const payload = [
      { label: "Queue 1", value: 1 },
      { label: "Queue 2", value: 2 },
      { label: "Queue 3", value: 3 },
      { label: "Queue 4", value: 4 }
    ];
    spyOn(service, "getQueueNameListListener").and.returnValue(of(payload));
    component.ngOnInit();
    expect(component.quenames).toEqual(payload);
  }));

  it("getLeads", async(() => {
    const payload = [
      { label: "Claims Lead 1", value: 1 },
      { label: "Claims Lead 2", value: 2 },
      { label: "Claims Lead 3", value: 3 }
    ];
    spyOn(service, "getLeadsListListener").and.returnValue(of(payload));
    component.ngOnInit();
    expect(component.leads).toEqual(payload);
  }));

  it("submit", () => {
    component.userGroupForm.patchValue({
      groupId: 9,
      groupName: "Missing_Member_Team",
      description: "Missing_Member",
      managerName: 1,
      leadName: 2,
      queueName: 3,
      target: 15,
      userGroupType: 15
    });

    const spy = spyOn(service, "saveUserGroupData");
    component.submit();
    expect(spy).toHaveBeenCalled();
  });

  it("should confirmcancle", () => {
    const userServiceSpy = spyOn(service1, "confirm").and.callFake(confirm =>
      confirm.accept()
    );
    component.confirmCancel();
    expect(component.editing).toBeFalsy();
    component.confirmDelete(1);
  });

  it("should load form", () => {
    spyOn(service, "getAllLeads").and.callFake(() => true);
    spyOn(service, "getLeadsListListener").and.returnValue(
      of([{ label: "test1", value: 1 }])
    );
    component.userGroupForm.patchValue({
      queueName: {
        queueId: "2"
      },
      userGroupType: {
        id: "1"
      }
    });
    component.onChangeManager({
      value: null
    });
    component.loadForm({ ...component.userGroupForm.value, leadId: 1 });
    expect(component.leadSearchText).toEqual("test1");
  });

  it("should filter lead", () => {
    component.leads = [{ label: "test1", value: 1 }];
    component.filterLead({
      query: "test1"
    });
    expect(component.filteredLeads.length).toBeGreaterThan(0);
  });

  it("submit with editing and leadchanged", () => {
    spyOn(service, "getAllLeads").and.callFake(() => true);
    spyOn(service, "saveUserGroupData").and.callFake(() => true);
    component.editing = true;
    component.leadChanged = true;
    component.submit();
    expect(component.editing).toBeFalsy();
  });
});
