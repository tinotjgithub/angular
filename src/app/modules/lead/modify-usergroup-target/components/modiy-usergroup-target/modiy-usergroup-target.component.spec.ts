import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { BaseHttpService } from "src/app/services/base-http.service";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { of } from "rxjs";
import { NotifierService } from "src/app/services/notifier.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ModiyUsergroupTargetComponent } from "./modiy-usergroup-target.component";
import { RadioButtonModule } from "primeng/radiobutton";
import { DialogModule } from "primeng/dialog";
import { ComponentsModule } from "src/app/shared/components/components.module";

import { ConfirmDialogModule } from "primeng/confirmdialog";
describe("ModiyUsergroupTargetComponent", () => {
  let component: ModiyUsergroupTargetComponent;
  let fixture: ComponentFixture<ModiyUsergroupTargetComponent>;
  let service;
  let notifierService;
  const data: any[] = [
    {
      groupId: 7,
      groupName: "Itemized_Bill_Team",
      leadId: 5,
      leadNmae: "Manju Varghese",
      managerId: 3,
      managerName: "Deepa John",
      target: 55,
      description: "Itemized Bill Work Group",
      userGroupType: {
        id: 1,
        name: "Claims"
      },
      queueName: {
        queuename: "Itemized Bill WB",
        queueId: 1
      }
    }
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModiyUsergroupTargetComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        DialogModule,
        ConfirmDialogModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentsModule,
        RadioButtonModule,
        TableModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ModiyUsergroupTargetComponent);
    service = fixture.debugElement.injector.get(UserManagementService);
    notifierService = fixture.debugElement.injector.get(NotifierService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModiyUsergroupTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("ngOnInit", () => {
    const spy = spyOn(component, "getUserGroupList");
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it("getUserGroupTargetList", () => {
    spyOn(service, "getUserGroupTargetList").and.returnValue(of(data));
    component.getUserGroupList();
    expect(component.userGroupList).toEqual(data);
  });

  it("editUserGrupTarget", () => {
    spyOn(service, "editUserGroupTarget").and.returnValue(of(true));
    const spy = spyOn(notifierService, "throwNotification");
    const spy2 = spyOn(service, "getUserGroupTargetList").and.returnValue(
      of(data)
    );
    component.editUserGrupTarget(data);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.userGroupList).toEqual(data);
  });

  it("onRowEditInit", () => {
    component.onRowEditInit(data[0]);
    expect(component.clonedUserGroups[data[0][`groupId`]]).toEqual(data[0]);
  });

  it("onRowEditCancel", () => {
    component.userGroupList = data;
    component.onRowEditInit(data[0]);
    expect(component.clonedUserGroups[data[0][`groupId`]]).toEqual(data[0]);
    component.onRowEditCancel(data[0], 0);
    expect(component.clonedUserGroups[data[0][`groupId`]]).toBeUndefined();
  });

  it("onRowEditSave", () => {
    const spy2 = spyOn(component, "editUserGrupTarget");
    component.onRowEditSave(data[0], 0);
    expect(spy2).toHaveBeenCalled();
    component.userGroupList = data;
    data[0].target = "sadsaas";
    component.onRowEditSave(data[0], 0);
    expect(spy2).not.toHaveBeenCalledTimes(2);
  });

  it('prevent input', () => {
    component.preventInput('', {target: 80});
    const event = {
      preventDefault: () => console.log('event')
    };
    const rowData = {
      target: 120
    };
    component.preventInput(event, rowData);
    expect(rowData.target).toEqual(12);
  });

  it("onRowEditSave", () => {
    const spy2 = spyOn(component, "editUserGrupTarget");
    // component.onRowEditInit(data[0]);
    component.userGroupList = data;
    // data[0].target = "e";
    component.onRowEditSave({target: '1E'}, 0);
    expect(spy2).not.toHaveBeenCalledTimes(2);
  });
});
