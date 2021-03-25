import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuditFailedComponent } from "./audit-failed.component";
import { AuditFailedService } from "../../services/audit-failed.service";
import { NotifierService } from "src/app/services/notifier.service";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TooltipModule } from "primeng/tooltip";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TabViewModule, TabPanel } from "primeng/tabview";
import { SharedModule } from "primeng/components/common/shared";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { CheckboxModule } from "primeng/checkbox";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService, Confirmation } from "primeng/api";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { BaseHttpService } from "src/app/services/base-http.service";
import { of } from "rxjs";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { HeaderService } from "src/app/services/header/header.service";
import { ActivatedRoute } from '@angular/router';
import { TaskmanagementService } from 'src/app/services/task-management/taskmanagement.service';
import { DropdownModule } from 'primeng/dropdown';
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

const payload = {
  currentLevel: 4,
  auditFlowId: 26,
  claimId: "20190681000116",
  claimType: "Institutional (OP)",
  claimStatus: "Final",
  receiptDate: "05/17/2020",
  claimsAge: 18,
  providerName: "Supplier_UST5",
  memberGroupName: "Medicare Advantage",
  billedAmount: 900,
  allowedAmount: 630,
  examinerComment: "Test",
  paidAmount: 630,
  queueName: "hcc_super_user",
  examinerName: "Devika Kumari",
  auditorName: "Brian Blaze",
  errorType: "Financial",
  financialImpact: "Over Paid",
  auditorAmount: 20,
  auditorComments: ["Over paid financially, please verify"],
  auditorAttachments: [
    {
      attachmentTwo: {
        filePosition: "attachmentTwo",
        fileId: 29,
        fileName: "Institutional_IP__Claim_Validation_Rules.docx"
      },
      attachmentOne: {
        filePosition: "attachmentOne",
        fileId: 29,
        fileName: "Institutional_IP__Claim_Validation_Rules.docx"
      }
    },
    {
      attachmentOne: {
        filePosition: "attachmentOne",
        fileId: 16,
        fileName: "Audit_Details.xlsx"
      }
    }
  ],
  leadComments: [
    "Finally, verified 1",
    "Finally verified 2",
    "Finally verified 3",
    "Finally verified 4 djaskldjasdjaslkj kjaskjdlkasjldjasdja ljsdkasdkasdl;askldas kl;askdl;askdkas;kdaskd"
  ],
  leadAttachments: [
    {
      attachmentTwo: {
        filePosition: "attachmentTwo",
        fileId: 21,
        fileName: "Audit_Details.xlsx"
      },
      attachmentOne: {
        filePosition: "attachmentOne",
        fileId: 19,
        fileName: "Test Audit Upload Details.docx"
      }
    },
    {
      attachmentTwo: {
        filePosition: "attachmentTwo",
        fileId: 21,
        fileName: "Audit_Details.xlsx"
      },
      attachmentOne: {
        filePosition: "attachmentOne",
        fileId: 19,
        fileName: "Test Audit Upload Details.docx"
      }
    },
    {
      attachmentTwo: {
        filePosition: "attachmentTwo",
        fileId: 20,
        fileName: "FileUpload1.docx"
      },
      attachmentThree: {
        filePosition: "attachmentThree",
        fileId: 21,
        fileName: "Audit_Details.xlsx"
      },
      attachmentOne: {
        filePosition: "attachmentOne",
        fileId: 18,
        fileName: "Audit_Details.xlsx"
      }
    }
  ],
  managerComments: null,
  managerAttachments: null,
  prevExaminerComments: ["Rebutting the claim", "Test2", "Test3"],
  prevExaminerAttachments: [
    {
      attachmentTwo: {
        filePosition: "attachmentTwo",
        fileId: 29,
        fileName: "Institutional_IP__Claim_Validation_Rules.docx"
      },
      attachmentFour: {
        filePosition: "attachmentFour",
        fileId: 18,
        fileName: "Audit_Details.xlsx"
      },
      attachmentThree: {
        filePosition: "attachmentThree",
        fileId: 17,
        fileName: "Institutional_OP__Claim_Validation_Rules.docx"
      },
      attachmentOne: {
        filePosition: "attachmentOne",
        fileId: 28,
        fileName: "Institutional_IP__Claim_Validation_Rules.docx"
      },
      attachmentFive: {
        filePosition: " attachmentFive",
        fileId: 28,
        fileName: "Institutional_IP__Claim_Validation_Rules.docx"
      }
    },
    {
      attachmentTwo: {
        filePosition: "attachmentTwo",
        fileId: 29,
        fileName: "Institutional_IP__Claim_Validation_Rules.docx"
      },
      attachmentFour: {
        filePosition: "attachmentFour",
        fileId: 18,
        fileName: "Audit_Details.xlsx"
      }
    }
  ]
};
describe("AuditFailedComponent", () => {
  let component: AuditFailedComponent;
  let fixture: ComponentFixture<AuditFailedComponent>;
  let service;
  let notifierService;
  let notifierSpy;
  let confirmationService;
  let confirmationSpy;
  let headerService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditFailedComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TooltipModule,
        TableModule,
        ButtonModule,
        TabViewModule,
        ComponentsModule,
        CheckboxModule,
        DialogModule,
        ConfirmDialogModule,
        DropdownModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        ConfirmationService,
        BaseHttpService]
    }).compileComponents();
    fixture = TestBed.createComponent(AuditFailedComponent);
    service = fixture.debugElement.injector.get(AuditorService);
    notifierService = fixture.debugElement.injector.get(NotifierService);
    confirmationService = fixture.debugElement.injector.get(
      ConfirmationService
    );
    headerService = fixture.debugElement.injector.get(HeaderService);
    notifierSpy = spyOn(notifierService, "throwNotification");
    confirmationSpy = spyOn(confirmationService, "confirm");
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("initiateForm", () => {
    component.initiateForm();
    expect(component.auditForm).toBeDefined();
  });

  it("canDeactivate", () => {
    component.claim = null;
    fixture.detectChanges();
    const vale = component.canDeactivate();
    expect(confirmationSpy).not.toHaveBeenCalled();
    expect(vale).toBeTruthy();
  });

  it("getClaim", () => {
    const spy = spyOn(service, "getAuditFailedDetails").and.returnValue(
      of(payload)
    );
    const spy2 = spyOn(component, "processClaim");
    component.getClaim();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it("rebut", () => {
    const spy = spyOn(service, "getAuditFailedDetails").and.returnValue(
      of(payload)
    );
    const spy2 = confirmationSpy.and.callFake((confirm: Confirmation) =>
      confirm.accept()
    );
    const spy3 = spyOn(component, "rebutClaim");
    component.initiateForm();
    component.getClaim();
    component.rebut();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it("processClaim", () => {
    component.leadAttachments = [];
    component.auditorAttachments = [];
    component.managerAttachments = [];
    component.Oldinput = [];
    component.initiateForm();
    const spy = spyOn(headerService, "updateAuditClaimDetails");
    component.processClaim(payload);
    expect(spy).toHaveBeenCalled();
    expect(component.leadAttachments.length).toBeGreaterThan(0);
    expect(component.auditorAttachments.length).toBeGreaterThan(0);
    expect(component.managerAttachments.length).toBeGreaterThan(0);
    expect(component.Oldinput.length).toBeGreaterThan(0);
  });

  it("viewAttachments", () => {
    component.processClaim(payload);
    component.viewAttachments("leadAttachments");
    expect(component.showAttachments).toBeTruthy();
    expect(component.attachmentsPopup).toEqual(component.leadAttachments);
  });

  it("should delete file", () => {
    const spied = spyOn(service, "deleteAuditFailedFile").and.returnValue(
      of(true)
    );
    component.claim = payload;
    component.input = [payload.prevExaminerAttachments[0].attachmentOne];
    component.deleteFile(0);
    expect(component.input).toEqual([""]);
  });

  it("isNullOrUndefinedArray", () => {
    expect(component.isNullOrUndefinedArray(null)).toEqual([]);
    expect(component.isNullOrUndefinedArray(["A", "B"])).toEqual(["A", "B"]);
  });

  it("setFormValues", () => {
    const claim = {
      claimId: "20190681000116",
      auditFlowId: "122",
      financialImpact: "Over Paid",
      auditorAmount: 20,
      auditorComments: ["Over paid financially, please verify"],
      leadComments: [
        "Finally, verified 1",
        "Finally verified 2",
        "Finally verified 3",
        "Finally verified 4 djaskldjasdjaslkj kjaskjdlkasjldjasdja ljsdkasdkasdl;askldas kl;askdl;askdkas;kdaskd"
      ],
      managerComments: null,
      auditorName: "Manu",
      errorType: "Financial",
      currentLevel: 4,
      examinerComment: ["Over paid financially, please verify"]
    };
    fixture.detectChanges();
    component.setFormValues(claim);
    expect(component.isRebutEnabled).toBe(true);
    expect(component.auditForm.get("claimId").value).toEqual("20190681000116");
    expect(component.auditForm.get("claimsExaminerComments").value).toEqual([
      "Over paid financially, please verify"
    ]);
    expect(component.auditForm.get("currentLevel").value).toEqual(4);
  });

  it("selectRouteToLead", () => {
    component.initiateForm();
    component.setFormValues(payload);
    component.selectRouteToLead();
    expect(component.isRebutEnabled).toBeTruthy();

    component.initiateForm();
    payload.currentLevel = 3;
    component.setFormValues(payload);
    fixture.detectChanges();
    component.selectRouteToLead();
    expect(component.isRebutEnabled).toBeFalsy();
  });

  it("should download file", () => {
    const data = payload.leadAttachments[0];
    spyOn<any>(service, "downloadFile").and.returnValue(of(true));
    component.downloadFile(data.attachmentOne);
    component.downloadFile(data.attachmentTwo);
    const element = document.createElement("a");
    spyOn<any>(document, "createElement").and.returnValue(element);
    spyOnProperty(element, "download").and.returnValue(undefined);
    component.downloadFile(data.attachmentOne);
    expect(component).toBeTruthy();
  });

  it("should NOT just copy", () => {
    const input = document.createElement("input");
    input.value = "test";
    const spy = spyOn(component, "copyToClipBoard");
    fixture.detectChanges();
    component.justCopy(input);
    expect(spy).not.toHaveBeenCalled();
  });

  // it("should just copy", () => {
  //   component.claim = 'test';
  //   const input = document.createElement("input");
  //   input.value = "test";
  //   const spy = spyOn(component, "copyToClipBoard");
  //   fixture.detectChanges();
  //   component.justCopy(input);
  //   expect(spy).toHaveBeenCalled();
  // });

  it("should upload file", () => {
    const data = payload.leadAttachments[0];
    const spied = spyOn(service, "uploadFileExaminerFile").and.returnValue(
      of(true)
    );
    component.claim = data;
    component.input = [];
    component.uploadFile();
    component.input = [
      data.attachmentOne,
      {
        ...data.attachmentOne,
        name: "test",
        value: new File([], "test.txt"),
        local: true
      }
    ];
    component.uploadFile();
    expect(spied).toHaveBeenCalled();
  });

  it("accept", () => {
    component.initiateForm();
    component.setFormValues(payload);
    component.auditForm.patchValue({ claimsExaminerComments: "Test" });
    const spy1 = spyOn(service, "acceptAuditFailedTask").and.returnValue(
      of(true)
    );
    const spy2 = spyOn(component, "uploadFile");
    const spy3 = spyOn(component, "resetData");
    const spy4 = spyOn(headerService, "updateAuditClaimDetails");
    component.accept();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(notifierSpy).toHaveBeenCalled();
  });

  it("pend", () => {
    component.initiateForm();
    component.setFormValues(payload);
    component.auditForm.patchValue({ claimsExaminerComments: "Test" });
    const spy1 = spyOn(service, "pendAuditFailedTask").and.returnValue(
      of(true)
    );
    const spy2 = spyOn(component, "uploadFile");
    const spy3 = spyOn(component, "resetData");
    const spy4 = spyOn(headerService, "updateAuditClaimDetails");
    component.pend();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(notifierSpy).toHaveBeenCalled();
  });

  it("rebutClaim", () => {
    component.initiateForm();
    component.setFormValues(payload);
    component.auditForm.patchValue({ claimsExaminerComments: "Test" });
    component.auditForm.patchValue({ routeToLead: true });
    const spy1 = spyOn(service, "rebutAuditFailedTask").and.returnValue(
      of(true)
    );
    const spy2 = spyOn(component, "uploadFile");
    const spy3 = spyOn(component, "resetData");
    const spy4 = spyOn(headerService, "updateAuditClaimDetails");
    component.rebutClaim();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(notifierSpy).toHaveBeenCalled();
  });
  it("resetData should clear data", () => {
    component.claimDetails = ["ClaimID1"];
    component.endTimer = "10:00:01";
    component.resetData();
    expect(component.claimDetails).toEqual([]);
    expect(component.endTimer).toEqual("00:00:00");
  });
  it("resetData should call initiateForm", () => {
    const spy = spyOn(component, "initiateForm");
    component.resetData();
    expect(spy).toHaveBeenCalled();
  });

  // it("openClaimInHRP should not call service when id is present", () => {
  //   component.claim = undefined;
  //   const spy = spyOn(service, "callHealthEdge").and.returnValue(
  //     of({ status: "success" })
  //   );
  //   const input = document.createElement("input");
  //   input.value = "test";
  //   fixture.detectChanges();

  //   component.openClaimInHRP(input);
  //   expect(spy).not.toHaveBeenCalled();
  // });
  it("should copy and open healthedge", () => {
    //   const data = payload.leadAttachments[0];
    //   component.claim = data;
    spyOn(service, "callHealthEdge").and.returnValue(of({ status: "success" }));
    const input = document.createElement("input");
    input.value = "test";
    component.copyToClipBoard(input);
    expect(component).toBeTruthy();
  });

  it("should open healthedge", () => {
    spyOn(service, "callHealthEdge").and.returnValue(of({ status: "Failure" }));
    const input = document.createElement("input");
    input.value = "test";
    component.copyToClipBoard(input);
    expect(component).toBeTruthy();
  });

  it('should not perform actions when form is Invalid', () => {
    component.pend();
    component.accept();
    component.rebutClaim();
    component.processClaim(null);
    component.rebut();
    expect(component).toBeTruthy();
  });

  it('getclaim with id', () => {
    const route: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    spyOn(route.snapshot.queryParamMap, "get").and.returnValue("18");
    spyOn(service, 'getAuditFailedDetails').and.returnValue(of({
      claimId: 1234,
      auditWorkflowAttachmentsAndComments: [
        {
          comment: 'test',
          attachments: [],
          rebuttalLevel: 1,
          timestamp: ''
        }
      ],
      examinerAttachmentDto: {
        attachmentOne: {
          position: 'attachmentOne',
          fileName: 'test'
        }
      },
      auditorAttachments: null,
      leadAttachments: null,
      prevExaminerAttachments: null,
      managerAttachments: [
        {
          attachmentOne: {
            position: 'attachmentOne',
            fileName: 'text'
          }
        }
      ]
    }));
    component.ngOnInit();
    expect(component.claim.claimId).toEqual(1234);
  });

  it("can Deactivate", () => {
    expect(component.canDeactivate()).toBeTruthy();
    component.claim = {
      claimId: 1234,
      auditWorkflowAttachmentsAndComments: [
        {
          comment: 'test',
          attachments: [],
          rebuttalLevel: 1,
          timestamp: ''
        }
      ],
      examinerAttachmentDto: {
        attachmentOne: {
          position: 'attachmentOne',
          fileName: 'test'
        }
      },
      auditorAttachments: null,
      leadAttachments: null,
      prevExaminerAttachments: null,
      managerAttachments: [
        {
          attachmentOne: {
            position: 'attachmentOne',
            fileName: 'text'
          }
        }
      ]
    };
    expect(component.canDeactivate()).toBeFalsy();
  });

  it("on reload", () => {
    component.beforeunloadHandler(new Event('reload'));
    component.claim = {
      claimId: 1234,
      auditWorkflowAttachmentsAndComments: [
        {
          comment: 'test',
          attachments: [],
          rebuttalLevel: 1,
          timestamp: ''
        }
      ],
      examinerAttachmentDto: {
        attachmentOne: {
          position: 'attachmentOne',
          fileName: 'test'
        }
      },
      auditorAttachments: null,
      leadAttachments: null,
      prevExaminerAttachments: null,
      managerAttachments: [
        {
          attachmentOne: {
            position: 'attachmentOne',
            fileName: 'text'
          }
        }
      ]
    };
    component.beforeunloadHandler(new Event('reload'));
    expect(component).toBeTruthy();
  });

  it("should copy and open health Edge", () => {
    const taskService: TaskmanagementService = fixture.debugElement.injector.get(
      TaskmanagementService
    );
    const spied = spyOn(taskService, "callHealthEdge").and.returnValue(
      of(true)
    );
    component.claim = {claimId: 1234};
    component.openClaimInHRP(document.createElement("input"));
    component.justCopy(document.createElement("input"));
    expect(spied).toHaveBeenCalled();
  });

  it("should copy and open health Edge -failure", () => {
    const taskService: TaskmanagementService = fixture.debugElement.injector.get(
      TaskmanagementService
    );
    const spied = spyOn(taskService, "callHealthEdge").and.returnValue(
      of({ status: "Failure" })
    );
    component.claim = {claimId: 1234};
    component.openClaimInHRP(document.createElement("input"));
    expect(spied).toHaveBeenCalled();
  });

  it('role change', () => {
    component.claim = {
      claimId: 12,
      auditWorkflowAttachmentsAndComments: [
        {
          userRole: 'Manager',
          rebuttalLevel: 1
        }
      ]
    };
    component.roleChange('');
    component.roleChange('Manager');
    expect(component.allUserCommentsAttachments[1].length).toEqual(1);
  });
});
