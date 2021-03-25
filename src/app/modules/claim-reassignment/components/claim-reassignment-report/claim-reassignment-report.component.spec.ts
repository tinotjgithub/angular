import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NotifierService } from "src/app/services/notifier.service";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MessageModule } from "primeng/message";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ClaimReassignmentService } from "./../../service/claim-reassignment.service";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { MessageService, ConfirmationService } from "primeng/api";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  reassignmentReport,
  reassignedBy,
  mockReport
} from "./reassignment.mock";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { ClaimReassignmentReportComponent } from "./claim-reassignment-report.component";
import { CalendarModule } from "primeng/calendar";
import { DatePipe } from "@angular/common";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { MultiSelectModule } from "primeng/multiselect";
import { of, Subscription, throwError } from "rxjs";

class MockAuditorReportService extends ClaimReassignmentService {
  getReassignmentReport() {
    const auditReportArray: any = reassignmentReport;
    this.reassignmentReportSub.next(auditReportArray);
  }
  getReassignmentReportExcel() {
    return mockReport;
  }
  getReassignedBy() {
    const auditReportArray: any = reassignedBy;
    this.reassignmentBySub.next(auditReportArray);
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

describe("ClaimReassignmentReportComponent", () => {
  let component: ClaimReassignmentReportComponent;
  let fixture: ComponentFixture<ClaimReassignmentReportComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimReassignmentReportComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MessageModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        ComponentsModule,
        ProgressSpinnerModule,
        TableModule,
        TooltipModule,
        CalendarModule,
        MultiSelectModule,
        CardModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ClaimReassignmentService,
          useClass: MockAuditorReportService
        },
        { provide: NotifierService, useClass: MockNotiferService },
        MessageService,
        ConfirmationService,
        DatePipe,
        { provide: BaseHttpService, useClass: MockBaseHttpService }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    localStorage.setItem("user-details", JSON.stringify({ id: 1 }));
    fixture = TestBed.createComponent(ClaimReassignmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("get and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimReassignmentReportComponent);
      service = fixture.debugElement.injector.get(ClaimReassignmentService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should get report data", () => {
      component.isDataPresent = false;
      component.claimReassignmentGroup
        .get("reassignmentStartDate")
        .setValue(new Date());
      component.claimReassignmentGroup
        .get("reassignmentEndDate")
        .setValue(new Date());
      const res = [
        { code: "Deepa John", id: 3, name: "Deepa John" },
        {
          code: "Dhanya Saraswathi",
          id: 12,
          name: "Dhanya Saraswathi"
        }
      ];
      component.claimReassignmentGroup.get("reassignedByNam").setValue(res);
      fixture.detectChanges();

      spyOn(service, "getReassignmentReport");
      component.getReassignmentReport();
      expect(component.isDataPresent).toBeTruthy();
    });
    // it("should handle error on getting report data", () => {
    //   component.isDataPresent = false;
    //   component.claimReassignmentGroup
    //     .get("reassignmentStartDate")
    //     .setValue(new Date());
    //   component.claimReassignmentGroup
    //     .get("reassignmentEndDate")
    //     .setValue(new Date());
    //   const res = [
    //     { code: "Deepa John", id: 3, name: "Deepa John" },
    //     {
    //       code: "Dhanya Saraswathi",
    //       id: 12,
    //       name: "Dhanya Saraswathi"
    //     }
    //   ];
    //   component.showSpinner = false;
    //   component.claimReassignmentGroup.get("reassignedByNam").setValue(res);
    //   spyOn(service, "getReassignmentReport").and.returnValue(
    //     throwError({})
    //   );
    //   fixture.detectChanges();
    //   component.getReassignmentReport();
    //   expect(component.showSpinner).toBeFalsy();
    // });
    it("should set filtered values", () => {
      component.filteredValues = [];
      fixture.detectChanges();
      component.getFilteredUsers({ filteredValue: [1] });
      expect(component.filteredValues.length).toBeGreaterThan(0);
    });
    it("should set table columns", () => {
      component.cols = [];
      fixture.detectChanges();
      component.setCols();
      expect(component.cols.length).toBeGreaterThan(0);
    });
    it("should able to get auditor report and set to table", () => {
      component.isDataPresent = false;
      spyOn(service, "getAuditedClaimsReportListner").and.returnValue(
        of(reassignmentReport)
      );
      component.claimReassignmentGroup.patchValue({
        reassignmentStartDate: new Date(),
        reassignmentEndDate: new Date(),
        status: "All"
      });
      fixture.detectChanges();
      component.reportSubscription = new Subscription();
      try {
        component.getReassignmentReport();
      } catch (error) {
        console.log(error);
      }
      expect(component.isDataPresent).toBeTruthy();
    });
  });

  describe("Should fetch data from service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimReassignmentReportComponent);
      service = fixture.debugElement.injector.get(ClaimReassignmentService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should fetch report data from service", () => {
      component.isDataPresent = false;
      component.gridData = [];
      component.claimReassignmentGroup
        .get("reassignmentStartDate")
        .setValue(new Date());
      component.claimReassignmentGroup
        .get("reassignmentEndDate")
        .setValue(new Date());
      const res = [
        { code: "Deepa John", id: 3, name: "Deepa John" },
        {
          code: "Dhanya Saraswathi",
          id: 12,
          name: "Dhanya Saraswathi"
        }
      ];
      component.claimReassignmentGroup.get("reassignedByNam").setValue(res);
      const servSpy = spyOn(service, "getReassignmentReport");
      fixture.detectChanges();
      component.getReassignmentReport();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should get reassigned by data", () => {
      component.reassignedBy = [];
      fixture.detectChanges();
      const servSpy = spyOn(service, "getReassignedBy");
      component.getReassignedBy();
      expect(servSpy).toHaveBeenCalled();
    });

    it("should map reassigned by when present", () => {
      component.reassignedByList = [];
      component.reassignedBy = [
        { value: 3, label: "Deepa John" },
        { value: 12, label: "Dhanya Saraswathi" }
      ];
      fixture.detectChanges();
      component.mapReassignedBy();
      const ress = component.claimReassignmentGroup.get("reassignedByNam")
        .value;
      expect(ress.length).toBeGreaterThan(0);
    });

    it("should not map reassigned by when not present", () => {
      component.reassignedByList = [];
      component.reassignedBy = [];
      fixture.detectChanges();
      component.mapReassignedBy();
      expect(component.reassignedByList).toEqual([]);
    });

    it("should allow to download excel - Passed", () => {
      const res = [
        { code: "Deepa John", id: 3, name: "Deepa John" },
        {
          code: "Dhanya Saraswathi",
          id: 12,
          name: "Dhanya Saraswathi"
        }
      ];
      spyOn(service, "getReassignmentReportExcel").and.returnValue(
        of({ body: "test" })
      );
      component.claimReassignmentGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        status: "Passed",
        reassignedByNam: res
      });
      fixture.detectChanges();
      component.exportExcel();
      expect(component).toBeTruthy();
    });

    it("should allow to download excel - All", () => {
      const res = [
        { code: "Deepa John", id: 3, name: "Deepa John" },
        {
          code: "Dhanya Saraswathi",
          id: 12,
          name: "Dhanya Saraswathi"
        }
      ];
      spyOn(service, "getReassignmentReportExcel").and.returnValue(
        of({ body: "test" })
      );
      component.claimReassignmentGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        status: "All",
        reassignedByNam: res
      });
      fixture.detectChanges();
      component.exportExcel();
      expect(component).toBeTruthy();
    });

    it("should allow to download excel - Failed", () => {
      const res = [
        { code: "Deepa John", id: 3, name: "Deepa John" },
        {
          code: "Dhanya Saraswathi",
          id: 12,
          name: "Dhanya Saraswathi"
        }
      ];
      spyOn(service, "getReassignmentReportExcel").and.returnValue(
        of({ body: "test" })
      );
      component.claimReassignmentGroup.patchValue({
        activeFrom: new Date(),
        activeTo: new Date(new Date().setDate(new Date().getDate() - 1)),
        status: "Failed",
        reassignedByNam: res
      });
      fixture.detectChanges();
      component.exportExcel();
      expect(component).toBeTruthy();
    });
  });

  // describe("excel", () => {
  //   it("should not allow to download excel when form is invalid", () => {
  //     component.claimReassignmentGroup.reset();
  //     component.claimReassignmentGroup.updateValueAndValidity();
  //     component.claimReassignmentGroup.patchValue({
  //       activeFrom: "",
  //       activeTo: "",
  //       status: "",
  //       reassignedByNam: ""
  //     });
  //     fixture.detectChanges();
  //     component.exportExcel();
  //     expect(component).toBeTruthy();
  //   });
  // });

  describe("Should validate", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ClaimReassignmentReportComponent);
      service = fixture.debugElement.injector.get(ClaimReassignmentService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should call service when data is valid", () => {
      component.claimReassignmentGroup
        .get("reassignmentStartDate")
        .setValue(new Date());
      component.claimReassignmentGroup
        .get("reassignmentEndDate")
        .setValue(new Date());
      const res = [
        { code: "Deepa John", id: 3, name: "Deepa John" },
        {
          code: "Dhanya Saraswathi",
          id: 12,
          name: "Dhanya Saraswathi"
        }
      ];
      component.claimReassignmentGroup.get("reassignedByNam").setValue(res);
      const ressignmentTable = jasmine.createSpyObj("ressignmentTable", [
        "reset"
      ]);
      component.ressignmentTable = ressignmentTable;
      fixture.detectChanges();
      const getAudit = spyOn(component, "getReassignmentReport");
      component.submit();
      expect(component.ressignmentTable.reset).toHaveBeenCalled();
      expect(getAudit).toHaveBeenCalled();
    });
    it("should not call service when data is invalid", () => {
      const daysBeforeDate = new Date();
      daysBeforeDate.setDate(daysBeforeDate.getDate() - 500);
      component.claimReassignmentGroup
        .get("reassignmentEndDate")
        .setValue(new Date());
      component.claimReassignmentGroup
        .get("reassignmentStartDate")
        .setValue(daysBeforeDate);
      const res = [
        { code: "Deepa John", id: 3, name: "Deepa John" },
        {
          code: "Dhanya Saraswathi",
          id: 12,
          name: "Dhanya Saraswathi"
        }
      ];
      component.claimReassignmentGroup.get("reassignedByNam").setValue(res);
      const ressignmentTable = jasmine.createSpyObj("ressignmentTable", [
        "reset"
      ]);
      component.ressignmentTable = ressignmentTable;
      fixture.detectChanges();
      const getAudit = spyOn(component, "getReassignmentReport");
      component.submit();
      expect(component.ressignmentTable.reset).not.toHaveBeenCalled();
      expect(getAudit).not.toHaveBeenCalled();
    });
    it("should format a given date in mm-dd-yyyy format", () => {
      const currentDate =
        "Mon May 25 2020 16:12:52 GMT+0530 (India Standard Time)";
      fixture.detectChanges();
      const formatedDate = component.getFormattedDate(currentDate, false);
      expect(formatedDate).toEqual("05/25/2020");
    });
    it("should format a given date in yyyy-mm-dd format", () => {
      const currentDate =
        "Mon May 25 2020 16:12:52 GMT+0530 (India Standard Time)";
      fixture.detectChanges();
      const formatedDate = component.getFormattedDate(currentDate, true);
      expect(formatedDate).toEqual("2020-05-25");
    });
    it("should clear to date value if from date is greater than to date", () => {
      const currentDate = new Date();
      const threeDaysBefore = new Date();
      threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
      component.claimReassignmentGroup
        .get("reassignmentStartDate")
        .setValue(currentDate);
      component.claimReassignmentGroup
        .get("reassignmentEndDate")
        .setValue(threeDaysBefore);
      fixture.detectChanges();
      component.checkToDate();
      const dat = component.claimReassignmentGroup.get("reassignmentEndDate")
        .value;
      expect(dat).toEqual(null);
    });

    it("should call validate if from date is less than to date", () => {
      const oneDayBeforeDate = new Date();
      const currentDate = new Date();
      component.claimReassignmentGroup
        .get("reassignmentStartDate")
        .setValue(oneDayBeforeDate);
      component.claimReassignmentGroup
        .get("reassignmentEndDate")
        .setValue(currentDate);
      const spy = spyOn(component, "validateDates").and.returnValue(true);
      fixture.detectChanges();
      component.checkToDate();
      expect(spy).toHaveBeenCalled();
    });
    it("should errors if dates exceed 6 months", () => {
      const currentDate = new Date();
      const sevenDate = new Date();
      sevenDate.setDate(sevenDate.getDate() - 350);
      component.claimReassignmentGroup
        .get("reassignmentStartDate")
        .setValue(sevenDate);
      component.claimReassignmentGroup
        .get("reassignmentEndDate")
        .setValue(currentDate);
      spyOn(component, "validateDates").and.returnValue(false);
      fixture.detectChanges();
      component.checkToDate();
      expect(
        component.claimReassignmentGroup.controls.reassignmentEndDate.valid
      ).toBeTruthy();
      expect(
        component.claimReassignmentGroup.controls.reassignmentStartDate.valid
      ).toBeTruthy();
    });
    it("change Reassigned By", () => {
      const spy = spyOn(component, "updateMultiSelectLabels");
      component.changeReassignedBy();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });
  afterAll(() => {
    localStorage.clear();
  });
});
