import { Component, OnInit, HostListener } from "@angular/core";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { HttpClient } from "@angular/common/http";
import { FILE_POSITION } from "../../../../auditor/model/auditor.model";
import { ConfirmationService } from "primeng/api";
import { HeaderService } from "src/app/services/header/header.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { SendBackReason } from "src/app/services/task-management/models/SendBackReason";

@Component({
  selector: "app-audit-failed",
  templateUrl: "./audit-failed.component.html"
})
export class AuditFailedComponent implements OnInit {
  public cols: any[];
  public claimDetails: any[];
  public input: Array<any> = new Array(4);
  public currentInput: Array<any>;
  public checkListItem: any[] = [];
  public checkedItem: any[] = [];
  public claim: any;
  public auditForm: FormGroup;
  public endTimer: string;
  public actualCheckListLength: number;
  public timerColor = "#00bf96";
  public taskId: string;
  public auditorAttachments: any[];
  public managerAttachments: any[];
  public leadAttachments: any[];
  public isRebutEnabled = false;
  public sub: Subscription;
  public auditFlowId = null;
  public examinerAttachments: any[];
  public comments: any;
  public showAttachments: boolean;
  public attachmentsPopup: any[] = [];
  public num2Str: Array<string> = ["Zeroth", "Others"];
  public Oldinput: Array<any> = new Array(4);
  private interval: any;
  public allUserCommentsAttachments = {
    0: [],
    1: [],
    2: [],
    3: []
  };
  public sendBack: boolean;
  public sendBackReasons: SendBackReason[];
  public sendBackForm: FormGroup;
  public isSendBack: boolean;
  private STATUS = ["Final", "Denied", "Rejected"];
  reviewRebut: boolean;
  @HostListener("window:beforeunload", ["$event"])
  public beforeunloadHandler($event) {
    $event.preventDefault();
    if (this.claim) {
      $event.returnValue = "Are you sure?";
    }
  }

  constructor(
    private auditorService: AuditorService,
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private taskManagementService: TaskmanagementService
  ) {}

  ngOnInit() {
    this.auditFlowId = this.route.snapshot.queryParamMap.get("auditFlowId");
    this.reviewRebut = Boolean(
      this.route.snapshot.queryParamMap.get("reviewRebut")
    );
    this.input = [""];
    this.Oldinput = [""];

    this.initiateForm();
    this.cols = [
      { field: "claimType", header: "Claim Type" },
      { field: "claimStatus", header: "Claim Status" },
      { field: "receiptDate", header: "Receipt Date" },
      { field: "claimsAge", header: "Claim Age (In Days)" },
      { field: "providerName", header: "Provider Name" },
      { field: "memberGroupName", header: "Group Name" },
      { field: "billedAmount", header: "Billed Amount ($)" },
      { field: "allowedAmount", header: "Allowed Amount ($)" },
      { field: "paidAmount", header: "Paid Amount ($)" },
      { field: "processedDate", header: "Processed Date" },
      { field: "examinerName", header: "Examiner Name" },
      { field: "queueName", header: "Queue Name" }
    ];

    if (this.auditFlowId !== null) {
      this.getClaim(this.auditFlowId, this.reviewRebut);
    }
  }

  canDeactivate() {
    if (this.claim && this.claim.claimId) {
      this.confirmationService.confirm({
        message:
          "Please Save/Submit the claim before you navigate to other page",
        acceptLabel: "OK",
        rejectVisible: false
      });
      return false;
    } else {
      return true;
    }
  }

  initiateForm() {
    this.auditForm = this.fb.group({
      claimId: [{ value: "", disabled: false }, [Validators.required]],
      auditFlowId: [{ value: "", disabled: true }],
      financialImpact: [{ value: "", disabled: true }],
      auditorAmount: [{ value: "", disabled: true }],
      auditorComments: [{ value: "", disabled: true }],
      leadComments: [{ value: "", disabled: true }],
      managerComments: [{ value: "", disabled: true }],
      auditorName: [{ value: "", disabled: true }],
      errorType: [{ value: "", disabled: true }],
      routeToLead: [{ value: false, disabled: false }],
      claimsExaminerComments: [
        { value: "", disabled: false },
        [Validators.required]
      ],
      claimsExaminerOldComments: [{ value: "", disabled: false }],
      currentLevel: [{ value: "" }]
    });
    this.sendBackForm = this.fb.group({
      sendBackReason: ["", [Validators.required]],
      comments: [""]
    });
  }

  getClaim(auditFlowId = null, reviewRebut = false) {
    this.claimDetails = [];
    this.auditorService.getAuditFailedDetails(auditFlowId, reviewRebut).subscribe(res => {
      this.processClaim(res);
    });
  }

  rebut() {
    if (this.claim && this.claim.claimId) {
      this.confirmationService.confirm({
        message: "Are you sure you want to Rebut the Claim?",
        acceptLabel: "Yes",
        rejectLabel: "No",
        accept: () => {
          this.rebutClaim();
        }
      });
    }
  }

  processClaim(res: any) {
    this.claimDetails = res ? [res] : [];
    this.claim = res || null;
    this.isSendBack = false;
    if (this.claim) {
      this.checkIsSendBackClaim();
      this.headerService.updateAuditClaimDetails(this.claim);
      const auditorFiles = this.getAttachments(this.claim.auditorAttachments);
      const leadFiles = this.getAttachments(this.claim.leadAttachments);
      const managerFiles = this.getAttachments(this.claim.managerAttachments);
      const examinerFiles = this.getAttachments(
        this.claim.prevExaminerAttachments
      );

      const files = this.claim.examinerAttachmentDto
        ? [
            this.claim.examinerAttachmentDto.attachmentOne,
            this.claim.examinerAttachmentDto.attachmentTwo,
            this.claim.examinerAttachmentDto.attachmentThree,
            this.claim.examinerAttachmentDto.attachmentFour,
            this.claim.examinerAttachmentDto.attachmentFive
          ].filter(e => e)
        : [];
      this.input = files.length > 0 ? files : [""];

      this.leadAttachments = leadFiles.length > 0 ? leadFiles : [""];
      this.auditorAttachments = auditorFiles.length > 0 ? auditorFiles : [""];
      this.managerAttachments = managerFiles.length > 0 ? managerFiles : [""];
      this.Oldinput = examinerFiles.length > 0 ? examinerFiles : [""];
      if (
        this.claim.auditWorkflowAttachmentsAndComments &&
        this.claim.auditWorkflowAttachmentsAndComments.length > 0
      ) {
        this.mapLevelComments();
      }
      this.setFormValues(res);
    }
  }

  private mapLevelComments() {
    this.clearAllUserComments();
    this.claim.auditWorkflowAttachmentsAndComments
      .filter(d => d)
      .forEach(e => {
        this.allUserCommentsAttachments[e.rebuttalLevel].push(e);
      });
  }

  private clearAllUserComments() {
    this.allUserCommentsAttachments[0] = [];
    this.allUserCommentsAttachments[1] = [];
    this.allUserCommentsAttachments[2] = [];
    this.allUserCommentsAttachments[3] = [];
  }

  getAttachments(attachments: any[]) {
    let returnAttachments = [];
    if (attachments) {
      if (attachments.length > 1) {
        returnAttachments = [Object.values(attachments[0]).filter(e => e)];
        let otherAttachments = [];
        attachments
          .filter((f, index) => index > 0)
          .forEach(e => {
            otherAttachments = [
              ...otherAttachments,
              ...Object.values(e).filter(val => val)
            ];
          });
        returnAttachments.push(otherAttachments);
      } else {
        returnAttachments = attachments
          .map(e => Object.values(e).filter(f => f))
          .filter(e => e);
      }
    }
    return returnAttachments;
  }

  viewAttachments(key: string) {
    this.showAttachments = this.claim ? true : false;
    this.attachmentsPopup = this[key] || [];
  }

  deleteFile(index) {
    this.auditorService
      .deleteAuditFailedFile(this.claim.auditFlowId, FILE_POSITION[index + 1])
      .subscribe(res => {
        this.input.splice(index, 1);
        if (index === 0 && this.input.length < 1) {
          this.input.push("");
        }
      });
  }

  isNullOrUndefinedArray(array) {
    return array === undefined || array === null ? [] : array;
  }

  setFormValues(claim) {
    const {
      claimId,
      auditFlowId,
      financialImpact,
      auditorAmount,
      auditorComments,
      leadComments,
      managerComments,
      auditorName,
      errorType,
      currentLevel,
      examinerComment
    } = claim;

    this.isRebutEnabled =
      currentLevel === 2 || currentLevel === 3 ? false : true;

    this.auditForm.patchValue({
      claimId,
      auditFlowId,
      financialImpact,
      auditorAmount,
      auditorComments: this.isNullOrUndefinedArray(auditorComments),
      leadComments: this.isNullOrUndefinedArray(leadComments),
      managerComments: this.isNullOrUndefinedArray(managerComments),
      auditorName,
      errorType,
      claimsExaminerComments: examinerComment,
      currentLevel
    });
  }

  selectRouteToLead() {
    const currentLevel = this.auditForm.get("currentLevel").value;
    if (currentLevel === 2 || currentLevel === 3) {
      this.isRebutEnabled = this.auditForm.get("routeToLead").value;
    }
  }

  downloadFile(input) {
    if (input) {
      this.auditorService.downloadFile(input.fileId).subscribe(res => {
        const responseBody = res.body;
        const blob = new Blob([responseBody]);
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, input.fileName);
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", input.fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      });
    }
  }

  justCopy(inputElement) {
    if (!this.claim) {
      return;
    }
    this.copyToClipBoard(inputElement);
    this.notifierService.throwNotification({
      type: "success",
      message: "Claim ID copied"
    });
  }

  copyToClipBoard(inputElement) {
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
    /* const range = document.createRange();
    range.selectNode(document.getElementById(inputElement));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); */
  }

  openClaimInHRP(inputElement) {
    if (!this.claim && this.claim.claimId) {
      return;
    }
    this.copyToClipBoard(inputElement);
    this.taskManagementService.callHealthEdge().subscribe(res => {
      if (res.status === "Failure") {
        this.notifierService.throwNotification({
          type: "error",
          message: res.message
        });
      }
    });
  }

  uploadFile() {
    const formData = new FormData();
    let fileUploaded = false;
    formData.append("auditFlowId", this.auditForm.get("auditFlowId").value);
    this.input.forEach((val, i) => {
      if (val && val.local) {
        formData.append(FILE_POSITION[String(i + 1)], val.value, val.name);
        fileUploaded = true;
      }
    });

    if (fileUploaded) {
      this.auditorService.uploadFileExaminerFile(formData).subscribe(res => {});
    }
  }

  accept() {
    if (this.auditForm.invalid) {
      return;
    }
    const paylod = {
      auditFlowId: this.auditForm.get("auditFlowId").value,
      comments: this.auditForm.get("claimsExaminerComments").value
    };

    this.auditorService.acceptAuditFailedTask(paylod).subscribe(res => {
      this.uploadFile();
      this.resetData();
      this.notifierService.throwNotification({
        type: "success",
        message: "Changes Saved Successfully."
      });
    });
    this.headerService.updateAuditClaimDetails(null);
  }

  pend() {
    if (this.auditForm.invalid) {
      return;
    }
    const paylod = {
      auditFlowId: this.auditForm.get("auditFlowId").value,
      comments: this.auditForm.get("claimsExaminerComments").value
    };

    this.auditorService.pendAuditFailedTask(paylod).subscribe(res => {
      this.uploadFile();
      this.resetData();
      this.notifierService.throwNotification({
        type: "success",
        message: "Changes Saved Successfully."
      });
    });
    this.headerService.updateAuditClaimDetails(null);
  }

  rebutClaim() {
    if (this.auditForm.invalid) {
      return;
    }
    const paylod = {
      auditFlowId: this.auditForm.get("auditFlowId").value,
      comments: this.auditForm.get("claimsExaminerComments").value,
      routeToLead: this.auditForm.get("routeToLead").value
    };

    this.auditorService.rebutAuditFailedTask(paylod).subscribe(res => {
      this.uploadFile();
      this.resetData();
      this.notifierService.throwNotification({
        type: "success",
        message: "Changes Saved Successfully."
      });
    });
    this.headerService.updateAuditClaimDetails(null);
  }

  resetData() {
    this.claimDetails = [];
    this.attachmentsPopup = [];
    this.claim = null;
    this.sendBackForm.reset();
    this.sendBack = false;
    this.isSendBack = false;
    this.initiateForm();
    clearInterval(this.interval);
    this.endTimer = "00:00:00";
    this.timerColor = "#00bf96";
    this.input = [""];
    this.Oldinput = [""];
  }

  roleChange(val) {
    if (val) {
      this.clearAllUserComments();
      this.claim.auditWorkflowAttachmentsAndComments
        .filter(d => d && d.userRole === val)
        .forEach(e => {
          this.allUserCommentsAttachments[e.rebuttalLevel].push(e);
        });
    } else {
      this.mapLevelComments();
    }
  }

  showSendBack() {
    this.sendBack = true;
  }

  getSendBackReasons() {
    this.sendBackReasons = [];
    this.taskManagementService.getAllSendBackReasons().subscribe(res => {
      this.sendBackReasons = res ? res.sendBackReasonDtos : [];
    });
  }

  sendBackClaim() {
    if (this.sendBackForm.invalid) {
      return;
    }
    const paylod = {
      auditFlowId: this.auditForm.get("auditFlowId").value,
      comments: this.sendBackForm.get("comments").value,
      sendBackReasonDto: {
        sendBackReasonCode: this.sendBackForm.get("sendBackReason").value
          .sendBackReasonCode
      }
    };

    this.auditorService.sendBack(paylod).subscribe(res => {
      this.resetData();
      this.notifierService.throwNotification({
        type: "success",
        message: "Claim sent back to the Auditor."
      });
    });
    this.headerService.updateAuditClaimDetails(null);
  }

  checkIsSendBackClaim() {
    this.isSendBack = this.STATUS.indexOf(this.claim.claimStatus) === -1;
    if (this.isSendBack) {
      this.getSendBackReasons();
    }
  }
}
