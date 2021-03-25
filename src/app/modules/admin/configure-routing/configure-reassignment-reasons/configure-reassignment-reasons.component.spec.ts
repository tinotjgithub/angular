import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfigureReassignmentReasonsComponent } from "./configure-reassignment-reasons.component";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TableModule, Table } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { of, throwError } from "rxjs";
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

class MockTable extends Table {
  filterGlobal(value, matchmode) {
    console.log(value, matchmode);
  }
}

class MockTaskmanagementService extends TaskmanagementService {
  addReassignmentReason() {
    return null;
  }
}

describe("ConfigureReassignmentReasonsComponent", () => {
  let component: ConfigureReassignmentReasonsComponent;
  let fixture: ComponentFixture<ConfigureReassignmentReasonsComponent>;
  let service: TaskmanagementService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigureReassignmentReasonsComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        TableModule,
        TooltipModule,
        HttpClientTestingModule,
        ConfirmDialogModule
      ],
      providers: [
        { provide: MockTaskmanagementService, useClass: TaskmanagementService },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        {
          provide: Table,
          useClass: MockTable
        },
        ConfirmationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureReassignmentReasonsComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(TaskmanagementService);
    fixture.detectChanges();
  });

  it("should be editted when length equal and reason deleted and added", () => {
    spyOn(service, "getReassignmentReasons").and.returnValue(
      of({ reassignmentReasonDtos: [{ status: "status" }] })
    );
    component.getReasons();
    expect(component.checkIfEdited()).toBeFalsy();
  });

  it("should create", () => {
    spyOn(service, "getReassignmentReasons").and.returnValue(of(""));
    expect(component).toBeTruthy();
  });

  it("get reassignment reasons", () => {
    spyOn(service, "getReassignmentReasons").and.returnValue(
      of({
        reassignmentReasonDtos: []
      })
    );
    component.getReasons();
    expect(component.reasonList).toEqual([]);
  });

  it("get reassignment reasons - null list", () => {
    spyOn(service, "getReassignmentReasons").and.returnValue(
      of({
        reassignmentReasonDtos: null
      })
    );
    component.getReasons();
    expect(component.reasonList).toEqual([]);
  });

  describe("should prevent addition of invalid reasons", () => {
    it("should prevent empty value", () => {
      component.addReason();
      expect(component.reasonList).toEqual([]);
      component.reason = " ";
      component.addReason();
      expect(component.reasonList).toEqual([]);
    });
    it("should prevent empty value - editing", () => {
      component.reasonList = [
        {
          reassignmentReasonCode: 1,
          reassignmentReason: "Test",
          status: true
        },
        {
          reassignmentReasonCode: 2,
          reassignmentReason: "Test-1",
          status: true
        }
      ];
      component.selectedReason = {
        2: {
          reassignmentReasonCode: 2,
          reassignmentReason: "Test-1",
          status: true
        }
      };
      expect(component.checkReasonValidation("", [], true, 1)).toBeFalsy();
    });
    it("should prevent duplicate value", () => {
      component.reasonList = [
        {
          reassignmentReasonCode: 1,
          reassignmentReason: "Test",
          status: true
        }
      ];
      component.reason = "test";
      component.addReason();
      expect(component.reasonList.length).toEqual(1);
    });
    it("should prevent duplicate value - editing", () => {
      component.reasonList = [
        {
          reassignmentReasonCode: 1,
          reassignmentReason: "Test",
          status: true
        },
        {
          reassignmentReasonCode: 2,
          reassignmentReason: "Test-1",
          status: true
        }
      ];
      component.selectedReason = {
        2: {
          reassignmentReasonCode: 2,
          reassignmentReason: "Test-1",
          status: true
        }
      };
      component.checkReasonValidation("test", component.reasonList, true, 1);
      expect(component.reasonList.length).toEqual(2);
    });
  });

  it("should add valid reason", () => {
    const spy = spyOn(service, "addReassignmentReason").and.returnValue(
      of(true)
    );
    component.reason = "test";
    component.reasonList = ["test1", "test2", "test3"];
    const spy1 = spyOn(component, "getReasons");
    component.reason = 'test';
    component.addReason();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it("should delete saved reason", () => {
    const spy = spyOn(service, "deleteReassignmentReason").and.returnValue(
      of(true)
    );
    component.reasonList = [
      {
        reassignmentReasonCode: "##-1",
        reassignmentReason: "Test",
        status: true
      }
    ];
    const spy1 = spyOn(component, "getReasons");
    component.deleteRow(0);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  // it("should delete locally added reason", () => {
  //   component.reasonList = [
  //     {
  //       reassignmentReasonCode: "##-1",
  //       reassignmentReason: "Test",
  //       status: true
  //     }
  //   ];
  //   const spy = spyOn(service, "deleteReassignmentReason").and.returnValue(
  //     of(true)
  //   );
  //   component.deleteRow(0);
  //   expect(component.reasonList.length).toEqual(0);
  // });

  it("should add row to memory on edit init", () => {
    component.reasonList = [
      {
        reassignmentReasonCode: "##-1",
        reassignmentReason: "Test",
        status: true
      }
    ];
    component.onRowEditInit(component.reasonList[0], 0);
    expect(component.selectedReason["##-1"]).toEqual(component.reasonList[0]);
  });

  it("should clear row from memory on edit cancel", () => {
    component.reasonList = [
      {
        reassignmentReasonCode: "##-1",
        reassignmentReason: "Test",
        status: true
      }
    ];
    component.onRowEditInit(component.reasonList[0], 0);
    component.onRowEditCancel(component.reasonList[0], 0);
    expect(component.selectedReason).toEqual({});
  });

  it("should save row data on edit save", () => {
    const data = [
      {
        reassignmentReasonCode: 1,
        reassignmentReason: "Test",
        status: true
      },
      {
        reassignmentReasonCode: 2,
        reassignmentReason: "Test-1",
        status: true
      }
    ];
    component.reasonList = data;
    component.onRowEditInit(component.reasonList[0], 0);
    spyOn(service, "updateReassignmentReason").and.returnValue(of(true));
    spyOn(service, "getReassignmentReasons").and.returnValue(
      of({
        reassignmentReasonDtos: data
      })
    );
    component.onRowEditSave(
      {
        reassignmentReasonCode: 1,
        reassignmentReason: "Test-2",
        status: true
      },
      0
    );
    component.onRowEditSave(
      {
        reassignmentReasonCode: 1,
        reassignmentReason: "Test-1",
        status: true
      },
      0
    );
    component.checkReasonValidation("Test-1", data);
    expect(component.reasonList[0].reassignmentReason).toEqual("Test");
  });

  it("should save row data on edit save - error", () => {
    const data = [
      {
        reassignmentReasonCode: 1,
        reassignmentReason: "Test",
        status: true
      },
      {
        reassignmentReasonCode: 2,
        reassignmentReason: "Test-1",
        status: true
      }
    ];
    component.reasonList = data;
    component.onRowEditInit(component.reasonList[0], 0);
    spyOn(service, "updateReassignmentReason").and.returnValue(
      throwError(true)
    );
    component.onRowEditSave(
      {
        reassignmentReasonCode: 1,
        reassignmentReason: "Test",
        status: true
      },
      0
    );
    component.onRowEditSave(
      {
        reassignmentReasonCode: 1,
        reassignmentReason: "Test-2",
        status: true
      },
      0
    );
    component.checkReasonValidation("", []);
    expect(component.reasonList[0].reassignmentReason).toEqual("Test");
  });

  describe("check whether the reasons are edited", () => {
    /* it("should be editted when length is not equal", () => {
      const spy = spyOn(service, "addReassignmentReason").and.returnValue(
        of(true)
      );
      component.reason = "test";
      component.reasonList = ["test1", "test2", "test3"];
      const spy1 = spyOn(component, "getReasons");
      component.addReason();
      expect(spy).toHaveBeenCalled();
      expect(spy1).toHaveBeenCalled();
    }); */
    it("should be editted", () => {
      spyOn(service, "getReassignmentReasons").and.returnValue(
        of({
          reassignmentReasonDtos: [
            {
              reassignmentReasonCode: 1,
              reassignmentReason: "Test",
              status: true
            },
            {
              reassignmentReasonCode: "##-2",
              reassignmentReason: "Test-1",
              status: true
            }
          ]
        })
      );
      component.getReasons();
      component.reasonList = [
        {
          reassignmentReasonCode: 1,
          reassignmentReason: "Test",
          status: true
        },
        {
          reassignmentReasonCode: "##-2",
          reassignmentReason: "Test-2",
          status: true
        }
      ];
      expect(component.checkIfEdited()).toBeTruthy();
      component.reasonList = [
        {
          reassignmentReasonCode: 2,
          reassignmentReason: "Test",
          status: true
        },
        {
          reassignmentReasonCode: "##-3",
          reassignmentReason: "Test-3",
          status: true
        }
      ];
      expect(component.checkIfEdited()).toBeTruthy();
      component.reasonList = [
        {
          reassignmentReasonCode: 2,
          reassignmentReason: "Test",
          status: true
        }
      ];
      expect(component.checkIfEdited()).toBeTruthy();
    });
  });

  /* it("should save valid reasons", () => {
    spyOn(service, "getReassignmentReasons").and.returnValue(
      of({
        reassignmentReasonDtos: [
          {
            reassignmentReasonCode: 1,
            reassignmentReason: "Test",
            status: true
          },
          {
            reassignmentReasonCode: "##-2",
            reassignmentReason: "Test-1",
            status: true
          }
        ]
      })
    );
    component.reasonList = [
      {
        reassignmentReasonCode: 1,
        reassignmentReason: "Test",
        status: true
      }
    ];
    component.reason = "Test-1";
    component.addReason();
    spyOn(service, "saveReassignmentReasons").and.returnValue(of(true));
    component.save();
    expect(component.reasonList.length).toEqual(2);
  }); */

  it("filter Table", () => {
    component.filteTable("");
    component.reasonList = [
      {
        reassignmentReasonCode: 1,
        reassignmentReason: "Test",
        status: true
      }
    ];
    const table = jasmine.createSpyObj("table", ["filterGlobal"]);
    component.table = table;
    component.filteTable("");
    expect(component).toBeTruthy();
  });
});
