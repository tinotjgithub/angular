import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NotifierService } from "src/app/services/notifier.service";
import { ConfigureRoutereasonsComponent } from "./configure-routereasons.component";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MessageModule } from "primeng/message";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { Table } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { MessageService, ConfirmationService } from "primeng/api";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  routeList,
  routeArray,
  duplicateRouteList
} from "src/app/mocks/mock-data";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { of, throwError } from "rxjs";

class MockTaskMgtService extends TaskmanagementService {
  getRouteReasonsConfig() {
    const reasonArray: any = routeArray;
    this.routeReasonsConfigSub.next(reasonArray);
  }
  addRouteReason() {
    return of(routeArray);
  }
}
class MockNotiferService extends NotifierService {
  throwNotification(notification) {
    this.notifierListener.next({
      type: notification.type,
      message: notification.message
    });
  }
}

describe("ConfigureRoutereasonsComponent", () => {
  let component: ConfigureRoutereasonsComponent;
  let fixture: ComponentFixture<ConfigureRoutereasonsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigureRoutereasonsComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MessageModule,
        DialogModule,
        ConfirmDialogModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        TableModule,
        TooltipModule,
        CardModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TaskmanagementService, useClass: MockTaskMgtService },
        { provide: NotifierService, useClass: MockNotiferService },
        MessageService,
        ConfirmationService,
        { provide: BaseHttpService, useClass: MockBaseHttpService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureRoutereasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("should set and set values", () => {
    let service;
    let notifer;
    beforeEach(() => {
      service = fixture.debugElement.injector.get(TaskmanagementService);
      fixture = TestBed.createComponent(ConfigureRoutereasonsComponent);
      notifer = fixture.debugElement.injector.get(NotifierService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set fields and header for table", () => {
      component.cols = [];
      fixture.detectChanges();
      component.getTableColumns();
      expect(component.cols.length).toBeGreaterThan(0);
    });
    it("should delete selected row from table", () => {
      component.deletedItems = [];
      component.routeReasonList = routeList;
      fixture.detectChanges();
      const spy = spyOn(service, "deleteRouteReason").and.returnValue(of(true));
      const spy2 = spyOn(component, "getRouteReasons");
      component.deleteRow(0);
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
    it("should not delete selected row from table when selected row routeReasonCode is null", () => {
      const routeReasonTable = jasmine.createSpyObj("routeReasonTable", [
        "reset"
      ]);
      component.routeReasonTable = routeReasonTable;
      component.deletedItems = [];
      component.routeReasonList = [
        {
          routeReasonCode: null,
          routeReason: "Invalid Claim",
          routeRoleDetails: { id: 1 }
        }
      ];
      fixture.detectChanges();
      component.deleteRow(0);
      expect(component.deletedItems.length).toEqual(0);
    });
    it("should fetch route reasons from service", () => {
      const servSpy = spyOn(service, "getRouteReasonsConfig");
      spyOn(service, "getRouteReasonsConfigListner").and.returnValue(of(routeList));
      fixture.detectChanges();
      component.getRouteReasons();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should save route reasons into service for edited reasons", () => {
      component.deletedItems = [
        {
          routeReasonCode: "8",
          routeReason: "test",
          routeRoleDetails: { id: 1 }
        }
      ];
      component.routeReasonGroup.get("role").setValue("Claims Lead");
      component.routeReasonGroup.get("routeReason").setValue("Routed Claim");
      component.routeList = routeList;
      const servSpy = spyOn(service, "addRouteReason")
        .and.returnValue(routeArray)
        .and.callThrough();

      fixture.detectChanges();
      spyOn(service, "getRouteReasonsConfigListner").and.returnValue(of([]));
      component.addRouteReason();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should save route reasons into service for added reason", () => {
      component.deletedItems = [
        {
          routeReasonCode: "#8",
          routeReason: "test",
          routeRoleDetails: { id: 1 }
        }
      ];
      component.routeReasonGroup.get("role").setValue("Claims Lead");
      component.routeReasonGroup.get("routeReason").setValue("Routed Claim");
      component.routeList = routeList;
      const servSpy = spyOn(service, "addRouteReason")
        .and.returnValue(routeArray)
        .and.callThrough();
      fixture.detectChanges();
      component.addRouteReason();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should set values on row edit", () => {
      const route = {
        routeReasonCode: "1",
        routeReason: "Invalid Claim",
        routeRoleDetails: { id: 1 }
      };
      const routes = {
        routeReasonCode: "0",
        routeReason: "Invalid Claim",
        routeRoleDetails: { id: 1 }
      };
      component.routeReasonArray[0] = { ...routes };
      fixture.detectChanges();
      component.onRowEditInit(route, 0);
      expect(component.routeReasonArray[0].routeReasonCode).toEqual("1");
    });
    it("should map route reasons when values are present", () => {
      component.routeList = routeList;
      fixture.detectChanges();
      component.mapRouteReasons();
      expect(component.isRouteReasonPresent).toBeTruthy();
      expect(component.isRouteReasonRendered).toBeTruthy();
    });
    it("should not map route reasons when values are not present", () => {
      component.routeList = [];
      fixture.detectChanges();
      component.mapRouteReasons();
      expect(component.isRouteReasonPresent).toBeFalsy();
      expect(component.isRouteReasonRendered).toBeFalsy();
    });
    it("should map route reasons when reasons are present and no duplication", () => {
      spyOn(component, "checkIfEmptyOrNull").and.returnValue(true);
      const notService = fixture.debugElement.injector.get(NotifierService);
      const spy = spyOn(notService, "throwNotification");
      spyOn(service, "updateRouteReason").and.returnValue(of(true));
      component.routeReasonList = [
        {
          routeReasonCode: "string1",
          routeReason: "string1",
          routeRoleDetails: { id: 1 }
        },
        {
          routeReasonCode: "string2",
          routeReason: "string1",
          routeRoleDetails: { id: 1 }
        }
      ];
      component.routeReasonArray = {
        0: {
          routeReasonCode: "string1",
          routeReason: "string1",
          routeRoleDetails: { id: 1 }
        },
        1: {
          routeReasonCode: "string2",
          routeReason: "string2",
          routeRoleDetails: { id: 1 }
        }
      };
      component.onRowEditSave(
        {
          routeReasonCode: "string",
          routeReason: "string",
          routeRoleDetails: { id: 1 }
        },
        0
      );
      component.onRowEditSave(
        {
          routeReasonCode: "string",
          routeReason: "string",
          routeRoleDetails: { id: 2 }
        },
        1
      );
      expect(spy).toHaveBeenCalled();
    });
    it("should map route reasons when reasons are present and no duplication - error", () => {
      spyOn(component, "checkIfEmptyOrNull").and.returnValue(true);
      const notService = fixture.debugElement.injector.get(NotifierService);
      spyOn(notService, "throwNotification");
      const spy = spyOn(service, "updateRouteReason").and.returnValue(
        throwError(true)
      );
      component.routeReasonList = [
        {
          routeReasonCode: "string1",
          routeReason: "string1",
          routeRoleDetails: { id: 1 }
        },
        {
          routeReasonCode: "string2",
          routeReason: "string1",
          routeRoleDetails: { id: 1 }
        }
      ];
      component.routeReasonArray = {
        0: {
          routeReasonCode: "string1",
          routeReason: "string1",
          routeRoleDetails: { id: 1 }
        },
        1: {
          routeReasonCode: "string2",
          routeReason: "string2",
          routeRoleDetails: { id: 1 }
        }
      };
      component.onRowEditSave(
        {
          routeReasonCode: "string",
          routeReason: "string",
          routeRoleDetails: { id: 1 }
        },
        0
      );
      component.onRowEditSave(
        {
          routeReasonCode: "string",
          routeReason: "string",
          routeRoleDetails: { id: 2 }
        },
        1
      );
      expect(component).toBeTruthy();
    });
    it("should display error message when empty value is set", () => {
      component.isUpdated = false;
      component.reasonCopy = [];
      component.routeList = [];
      const route = {
        routeReasonCode: "1",
        routeReason: "",
        routeRoleDetails: { id: 1 }
      };
      const locSpy = spyOn(notifer, "throwNotification");
      fixture.detectChanges();
      component.onRowEditSave(route, 0);
      expect(locSpy).toHaveBeenCalled();
    });
    it("should display error message when duplicate value is entered", () => {
      component.isUpdated = false;
      component.reasonCopy = [];
      component.reasonCopy.push({
        routeReasonCode: "1",
        routeReason: "Invalid Claim",
        routeRoleDetails: { id: 1 }
      });
      component.routeList = [];
      const route = {
        routeReasonCode: "1",
        routeReason: "test",
        routeRoleDetails: { id: 1 }
      };
      const locSpy = spyOn(notifer, "throwNotification");
      spyOn(component, "checkDuplication").and.returnValue(false);
      fixture.detectChanges();
      component.onRowEditSave(route, 0);
      expect(locSpy).toHaveBeenCalled();
    });
    it("should return true if no changes are made", () => {
      component.routeList = routeList;
      component.routeReasonListCopy = [
        {
          routeReasonCode: "1",
          routeReason: "Invalid Claim",
          routeRoleDetails: { id: 1 }
        }
      ];
      component.routeReasonList = [
        {
          routeReasonCode: "1",
          routeReason: "Invalid Claim",
          routeRoleDetails: { id: 1 }
        }
      ];
      fixture.detectChanges();
      const objSame = component.checkIfReverted();
      expect(objSame).toBeTruthy();
    });

    it("should return false if updation changes are made", () => {
      component.routeReasonListCopy = [
        {
          routeReasonCode: "1",
          routeReason: "Invalid Claim",
          routeRoleDetails: { id: 1 }
        }
      ];
      component.routeReasonList = [
        {
          routeReasonCode: "1",
          routeReason: "Excalated Claim",
          routeRoleDetails: { id: 1 }
        }
      ];
      fixture.detectChanges();
      const objSame = component.checkIfReverted();
      expect(objSame).toBeFalsy();
    });

    it("should set the same details previously present when editing is cancelled", () => {
      component.routeReasonArray = {};
      const route = {
        routeReasonCode: "1",
        routeReason: "Invalid Claim",
        routeRoleDetails: { id: 1 }
      };
      component.routeReasonArray[0] = { ...route };
      component.routeReasonArray[0].routeReasonCode = "1";
      component.routeReasonList = [
        {
          routeReasonCode: "1",
          routeReason: "Invalid Claim",
          routeRoleDetails: { id: 1 }
        }
      ];
      fixture.detectChanges();
      component.onRowEditCancel(0);
      expect(component.routeReasonList[0].routeReasonCode).toEqual("1");
      expect(component.routeReasonList[0].routeReason).toEqual("Invalid Claim");
    });

    it("should return false if new claim is added to the existing list", () => {
      component.routeList = routeList;
      component.routeReasonListCopy = [
        {
          routeReasonCode: "1",
          routeReason: "Invalid Claim",
          routeRoleDetails: { id: 1 }
        }
      ];
      component.routeReasonList = routeList;
      component.routeReasonList = [
        {
          routeReasonCode: "1",
          routeReason: "Invalid Claim",
          routeRoleDetails: { id: 1 }
        },
        {
          routeReasonCode: "15",
          routeReason: "Excalated Claim",
          routeRoleDetails: { id: 1 }
        }
      ];
      fixture.detectChanges();
      const objSame = component.checkIfReverted();
      expect(objSame).toBeFalsy();
    });
  });

  describe("should validate route reasons", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ConfigureRoutereasonsComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should check if reason is empty and return validity as true if not", () => {
      component.routeList = routeList;
      fixture.detectChanges();
      const isValid = component.checkIfEmptyOrNull("Duplicate Claim");
      expect(isValid).toEqual(true);
    });
    it("should check if reason is empty and return validity as false if it is", () => {
      component.routeList = routeList;
      fixture.detectChanges();
      const isValid = component.checkIfEmptyOrNull("");
      expect(isValid).toEqual(false);
    });
    it("should getRole", () => {
      const spy = spyOn(service, 'getRolesToRoute');
      const listenSPy = spyOn(service, 'getRolesToRouteListner').and.returnValue(of({
        roles: []
      }));
      fixture.detectChanges();
      component.getRoles();
      expect(component.roleList).toEqual([]);
      service.rolesToRouteResponse = {
        roles: []
      };
      fixture.detectChanges();
      component.getRoles();
      expect(component.roleList).toEqual([]);
    });

    it("should check for duplication of route reasons in row and set valid as true if duplicate reason is not present", () => {
      component.reasonCopy = routeList;
      const routeLists = {
        routeReasonCode: "11",
        routeReason: "test",
        routeRoleDetails: { id: 1 }
      };
      fixture.detectChanges();
      const isValid = component.checkDuplication(routeLists, 0);
      expect(isValid).toEqual(true);
    });
  });
  it("should check for duplication of route reasons in row and set valid as false if duplicate reason is present", () => {
    component.reasonCopy = [
      {
        routeReasonCode: "11",
        routeReason: "test",
        routeRoleDetails: { id: 1 }
      }
    ];
    const routeLists = {
      routeReasonCode: "1",
      routeReason: "test",
      routeRoleDetails: { id: 1 }
    };
    component.routeReasonListCopy = [
      {
        routeReasonCode: "11",
        routeReason: "test",
        routeRoleDetails: { id: 1 }
      }
    ];
    fixture.detectChanges();
    const isValid = component.checkDuplication(routeLists, 0);
    expect(isValid).toEqual(false);
  });
});
