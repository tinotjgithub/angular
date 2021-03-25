import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NotifierService } from "src/app/services/notifier.service";
import { ConfigurePendreasonsComponent } from "./configure-pendreasons.component";
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
  pendList,
  pendArray,
  duplicatePendList
} from "src/app/mocks/mock-data";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { of, throwError } from "rxjs";

class MockTaskMgtService extends TaskmanagementService {
  getPendReasonsConfig() {
    const reasonArray: any = pendArray;
    this.pendReasonsConfigSub.next(reasonArray);
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

describe("ConfigurePendreasonsComponent", () => {
  let component: ConfigurePendreasonsComponent;
  let fixture: ComponentFixture<ConfigurePendreasonsComponent>;
  let servSpy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurePendreasonsComponent],
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
    fixture = TestBed.createComponent(ConfigurePendreasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("should set and set values", () => {
    let service: TaskmanagementService;
    let notifer;
    beforeEach(() => {
      service = fixture.debugElement.injector.get(TaskmanagementService);
      fixture = TestBed.createComponent(ConfigurePendreasonsComponent);
      notifer = fixture.debugElement.injector.get(NotifierService);
      component = fixture.componentInstance;
      servSpy = spyOn(service, "getPendReasonsConfig").and.callFake(() =>
        console.log("getPendReason")
      );
      fixture.detectChanges();
    });
    it("should set validity to true", () => {
      component.pendReasonChange("invalid claim");
      expect(component.isValid).toEqual(true);
    });
    it("should not add when it is invalid", () => {
      const pendReasonTable = jasmine.createSpyObj("pendReasonTable", [
        "reset"
      ]);
      component.isValid = false;
      component.pendReasonTable = pendReasonTable;
      component.pendReasonList = [];
      component.pendReasonGroup.get("pendReason").setValue("Pending Claim");
      spyOn(component, "validatePendReason").and.callFake(() => {component.isValid = false});
      spyOn(component, "checkDuplicates");
      fixture.detectChanges();
      component.addPendReason();
      expect(component.isValid).toEqual(false);
    });
    it("should add pend reason if it is valid", () => {
      const pendReasonTable = jasmine.createSpyObj("pendReasonTable", [
        "reset"
      ]);
      component.pendReasonTable = pendReasonTable;
      component.pendReasonGroup.get("pendReason").setValue("Pending Claim");
      spyOn(component, "validatePendReason");
      spyOn(component, "checkDuplicates");
      spyOn(service, "addPendReason").and.returnValue(of(true));
      fixture.detectChanges();
      component.addPendReason();
      expect(component.pendReasonGroup.get("pendReason").value).toEqual("");
    });

    it("should not reset table when there are less than 7 values in table", () => {
      const pendReasonTable = jasmine.createSpyObj("pendReasonTable", [
        "reset"
      ]);
      component.isValid = true;
      component.pendReasonTable = pendReasonTable;
      component.pendReasonList = [];
      component.pendReasonGroup.get("pendReason").setValue("Pending Claim");
      spyOn(component, "validatePendReason");
      spyOn(component, "checkDuplicates");
      fixture.detectChanges();
      component.addPendReason();
      expect(component.pendReasonTable.reset).not.toHaveBeenCalled();
      expect(component.pendReasonGroup.get("pendReason").value).toEqual(
        "Pending Claim"
      );
    });
    it("should reset table when there are more than 7 values in table", () => {
      const pendReasonTable = jasmine.createSpyObj("pendReasonTable", [
        "reset"
      ]);
      component.pendReasonTable = pendReasonTable;
      component.pendReasonList = pendList;
      component.pendReasonGroup.get("pendReason").setValue("Pending Claim");
      spyOn(component, "validatePendReason");
      spyOn(component, "checkDuplicates");
      fixture.detectChanges();
      component.addPendReason();
      expect(component.pendReasonGroup.get("pendReason").value).toEqual(
        "Pending Claim"
      );
    });
    it("should set fields and header for table", () => {
      component.cols = [];
      fixture.detectChanges();
      component.getTableColumns();
      expect(component.cols.length).toBeGreaterThan(0);
    });
    it("should delete selected row from table", () => {
      const pendReasonTable = jasmine.createSpyObj("pendReasonTable", [
        "reset"
      ]);
      spyOn(service, "deletePendReason").and.returnValue(of(true));
      component.pendReasonTable = pendReasonTable;
      component.deletedItems = [];
      component.pendReasonList = pendList;
      fixture.detectChanges();
      component.deleteRow(0);
    });
    it("should fetch pend reasons from service", () => {
      // const servSpy = spyOn(service, "getPendReasonsConfig");
      fixture.detectChanges();
      component.getPendReasons();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should set values on row edit", () => {
      const pend = {
        pendReasonCode: "1",
        pendReason: "Invalid Claim"
      };
      const pends = {
        pendReasonCode: "0",
        pendReason: "Invalid Claim"
      };
      component.pendReasonArray = {};
      component.pendReasonArray[0] = { ...pends };
      fixture.detectChanges();
      component.onRowEditInit(pend, 0);
      expect(component.pendReasonArray[0].pendReasonCode).toEqual("1");
    });
    it("should map pend reasons when values are present", () => {
      component.pendList = pendList;
      fixture.detectChanges();
      component.mapPendReasons();
      expect(component.isPendReasonPresent).toBeTruthy();
      expect(component.isPendReasonRendered).toBeTruthy();
    });
    it("should not map pend reasons when values are not present", () => {
      component.pendList = [];
      fixture.detectChanges();
      component.mapPendReasons();
      expect(component.isPendReasonPresent).toBeFalsy();
      expect(component.isPendReasonRendered).toBeFalsy();
    });
    it("should map pend reasons when reasons are present and no duplication", () => {
      component.isUpdated = false;
      component.pendCopy = [];
      component.pendList = [];
      const pend = {
        pendReasonCode: "1",
        pendReason: "Invalid Claim"
      };
      const pend1 = {
        pendReasonCode: "2",
        pendReason: "Valid Claim"
      };
      component.pendList.push(pend);
      component.pendReasonList.push(pend);
      component.pendCopy.push(pend);
      component.pendReasonArray = {};
      component.pendReasonArray[0] = { ...pend };
      const spy = spyOn(service, "updatePendReason").and.returnValue(of(true));
      fixture.detectChanges();
      component.onRowEditSave(pend, 0);
      expect(spy).not.toHaveBeenCalled();
      component.pendReasonArray[0] = { ...pend1 };
      component.onRowEditSave(pend, 0);
      expect(spy).toHaveBeenCalled();
    });
    it("should map pend reasons when reasons are present and no duplication", () => {
      component.isUpdated = false;
      component.pendCopy = [];
      component.pendList = [];
      const pend = {
        pendReasonCode: "1",
        pendReason: "Invalid Claim"
      };
      const pend1 = {
        pendReasonCode: "2",
        pendReason: "Valid Claim"
      };
      component.pendList.push(pend);
      component.pendReasonList.push(pend);
      component.pendCopy.push(pend);
      component.pendReasonArray = {};
      const spy = spyOn(service, "updatePendReason").and.returnValue(
        throwError(200)
      );
      fixture.detectChanges();
      component.pendReasonArray[0] = { ...pend1 };
      try {
        component.onRowEditSave(pend, 0);
      } catch (error) {}
      expect(spy).toHaveBeenCalled();
    });
    it("should display error message when empty value is set", () => {
      component.isUpdated = false;
      component.pendCopy = [];
      component.pendList = [];
      const pend = {
        pendReasonCode: "1",
        pendReason: ""
      };
      const locSpy = spyOn(notifer, "throwNotification");
      fixture.detectChanges();
      component.onRowEditSave(pend, 0);
      expect(locSpy).toHaveBeenCalled();
    });
    it("should display error message when duplicate value is entered", () => {
      component.isUpdated = false;
      component.pendCopy = [];
      component.pendCopy.push({
        pendReasonCode: "1",
        pendReason: "Invalid Claim"
      });
      component.pendList = [];
      const pend = {
        pendReasonCode: "1",
        pendReason: "test"
      };
      const locSpy = spyOn(notifer, "throwNotification");
      fixture.detectChanges();
      spyOn(component, "checkDuplication").and.returnValue(false);
      component.onRowEditSave(pend, 0);
      expect(locSpy).toHaveBeenCalled();
    });
    it("should return true if no changes are made", () => {
      component.pendList = pendList;
      component.pendReasonListCopy = [
        {
          pendReasonCode: "1",
          pendReason: "Invalid Claim"
        }
      ];
      component.pendReasonList = [
        {
          pendReasonCode: "1",
          pendReason: "Invalid Claim"
        }
      ];
      fixture.detectChanges();
      const objSame = component.checkIfReverted();
      expect(objSame).toBeTruthy();
    });

    it("should return false if updation changes are made", () => {
      component.pendReasonListCopy = [
        {
          pendReasonCode: "1",
          pendReason: "Invalid Claim"
        }
      ];
      component.pendReasonList = [
        {
          pendReasonCode: "1",
          pendReason: "Excalated Claim"
        }
      ];
      fixture.detectChanges();
      const objSame = component.checkIfReverted();
      expect(objSame).toBeFalsy();
    });

    it("should set the same details previously present when editing is cancelled", () => {
      component.pendReasonArray = {};
      const pend = {
        pendReasonCode: "1",
        pendReason: "Invalid Claim"
      };
      component.pendReasonArray[0] = { ...pend };
      component.pendReasonArray[0].pendReasonCode = "1";
      component.pendReasonList = [
        {
          pendReasonCode: "1",
          pendReason: "Invalid Claim"
        }
      ];
      fixture.detectChanges();
      component.onRowEditCancel(0);
      expect(component.pendReasonList[0].pendReasonCode).toEqual("1");
      expect(component.pendReasonList[0].pendReason).toEqual("Invalid Claim");
    });

    it("should return false if new claim is added to the existing list", () => {
      component.pendList = pendList;
      component.pendReasonListCopy = [
        {
          pendReasonCode: "1",
          pendReason: "Invalid Claim"
        }
      ];
      component.pendReasonList = pendList;
      component.pendReasonList = [
        {
          pendReasonCode: "1",
          pendReason: "Invalid Claim"
        },
        {
          pendReasonCode: "15",
          pendReason: "Excalated Claim"
        }
      ];
      fixture.detectChanges();
      const objSame = component.checkIfReverted();
      expect(objSame).toBeFalsy();
    });
  });

  describe("should validate pend reasons", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ConfigurePendreasonsComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should set validity to true", () => {
      component.pendReasonChange("invalid claim");
      expect(component.isValid).toEqual(true);
    });
    it("should check for dulicate pend reason when pend reason is not empty.", () => {
      const locSpy = spyOn(component, "checkDuplicates");
      fixture.detectChanges();
      component.validatePendReason("invalid claim");
      expect(locSpy).toHaveBeenCalled();
    });
    it("should set validity to false when pend reason is empty", () => {
      component.isValid = true;
      const locSpy = spyOn(component, "checkDuplicates");
      fixture.detectChanges();
      component.validatePendReason("");
      expect(component.isValid).toEqual(false);
    });
    it("should check for duplicate pend reasons and set valid as true if duplicate reason is not present", () => {
      component.pendList = [
        {
          pendReasonCode: 1,
          pendReason: "test"
        }
      ];
      fixture.detectChanges();
      const isValid = component.checkDuplicates("Invalid Claim");
      expect(isValid).toEqual(true);
    });
    it("should check for duplicate pend reasons and set valid as false if duplicate reason is present", () => {
      component.pendList = pendList;
      fixture.detectChanges();
      const isValid = component.checkDuplicates("Duplicate Claim");
      expect(isValid).toEqual(false);
    });
    it("should return false when no duplicates present in the table", () => {
      component.pendReasonList = pendList;
      fixture.detectChanges();
      const status = component.checkNoDuplicates();
      expect(status).toEqual(false);
    });
    it("should return true when duplicates present in the table", () => {
      component.pendReasonList = duplicatePendList;
      fixture.detectChanges();
      const status = component.checkNoDuplicates();
      expect(status).toEqual(true);
    });
    it("should check if reason is empty and return validity as true if not", () => {
      component.pendList = pendList;
      fixture.detectChanges();
      const isValid = component.checkIfEmptyOrNull("Duplicate Claim");
      expect(isValid).toEqual(true);
    });
    it("should check if reason is empty and return validity as false if it is", () => {
      component.pendList = pendList;
      fixture.detectChanges();
      const isValid = component.checkIfEmptyOrNull("");
      expect(isValid).toEqual(false);
    });

    it("should check for duplication of pend reasons in row and set valid as true if duplicate reason is not present", () => {
      component.pendCopy = pendList;
      const pendLists = {
        pendReasonCode: "11",
        pendReason: "test"
      };
      fixture.detectChanges();
      const isValid = component.checkDuplication(pendLists, 0);
      expect(isValid).toEqual(true);
    });
  });
  it("should check for duplication of pend reasons in row and set valid as false if duplicate reason is present", () => {
    component.pendCopy = [
      {
        pendReasonCode: "11",
        pendReason: "test"
      }
    ];
    const pendLists = {
      pendReasonCode: "1",
      pendReason: "test"
    };
    component.pendReasonListCopy = [
      {
        pendReasonCode: "11",
        pendReason: "test"
      }
    ];
    fixture.detectChanges();
    const isValid = component.checkDuplication(pendLists, 0);
    expect(isValid).toEqual(false);
  });
});
