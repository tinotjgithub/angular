import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { ConfirmationService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { AuditClaimRoutingService } from "../../services/audit-claim-routing.service";

@Component({
  selector: "app-audit-route-out",
  templateUrl: "./audit-route-out.component.html"
})
export class AuditRouteOutComponent implements OnInit {
  sub: any;
  auditTaskId: any;
  cols: { field: string; header: string }[];
  auditForm: FormGroup;
  claimDetails: any[];
  claim: any;
  toAuditorNamesList: any;
  toRouteReasonList: any;

  constructor(
    private auditorService: AuditClaimRoutingService,
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private taskManagementService: TaskmanagementService
  ) {}

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.auditTaskId = params.auditTaskId || null;
    });

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
      { field: "examinerName", header: "Examiner Name" }
    ];

    if (this.auditTaskId !== null) {
      this.getClaim(this.auditTaskId);
    }
  }

  initiateForm() {
    this.auditForm = this.fb.group({
      claimId: [{ value: "", disabled: false }, [Validators.required]],
      auditTaskId: [{ value: "", disabled: false }],

      fromUserName: [{ value: "", disabled: true }],
      fromUserGroup: [{ value: "", disabled: true }],
      fromRouteReason: [{ value: "", disabled: true }],
      fromRouteComments: [{ value: "", disabled: true }],

      toAuditorName: [{ value: "", disabled: false }, [Validators.required]],
      toRouteReason: [{ value: "", disabled: false }, [Validators.required]],
      toRouteComments: [{ value: "", disabled: false }, [Validators.required]],
      toUserRole: [{ value: "", disabled: true }]
    });
  }

  getClaim(auditTaskId = null) {
    this.claimDetails = [];
    this.auditorService.getAuditRoutedInClaim(auditTaskId).subscribe(res => {
      this.processClaim(res);
    });
  }

  processClaim(res: any) {
    this.claimDetails = res ? [res] : [];
    this.claim = res || null;
    this.setFormValues(res);
  }

  setFormValues(claim) {
    const {
      claimId,
      auditTaskId,
      fromUserName,
      fromUserGroup,
      fromRouteReason,
      fromRouteComments,
      toRouteReason,
      toAuditorExaminerNames,
      toUserRole
    } = claim;
    this.auditForm.patchValue({
      claimId,
      auditTaskId,
      fromUserName,
      fromUserGroup,
      fromRouteReason,
      fromRouteComments,
      toUserRole
    });

    this.toAuditorNamesList = toAuditorExaminerNames;
    this.toRouteReasonList = toRouteReason;
    this.auditTaskId = auditTaskId;
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

  routeClaim() {
    this.confirmationService.confirm({
      message: "Are you sure that you want to Route the Claim?",
      accept: () => {
        this.auditorService
          .routeAuditRoutedInClaim(this.constructParam())
          .subscribe(() => {
            this.notifierService.throwNotification({
              type: "success",
              message: "Claim Routed successfully"
            });
            this.clearForm();
          });
      }
    });
  }

  constructParam() {
    const {
      auditTaskId,
      toRouteReason,
      toRouteComments,
      toAuditorName
    } = this.auditForm.value;
    const param = {
      auditTaskId,
      routeReasonCode: toRouteReason.routeReasonCode,
      routeComments: toRouteComments,
      routeUserId: toAuditorName.id
    };
    return param;
  }

  cancel() {
    this.auditorService.cancelAuditTaskId(this.auditTaskId).subscribe(res => {
      this.clearForm();
    });
  }

  clearForm() {
    this.auditTaskId = null;
    this.initiateForm();
    this.claim = {};
    this.claimDetails = [];
  }

  openClaimInHRP(inputElement) {
    if (!this.claim || (this.claim && !this.claim.claimId)) {
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

  confirm() {
    this.confirmationService.confirm({
      message: "Are you sure that you want to cancel the changes?",
      accept: () => {
        this.cancel();
      }
    });
  }
}
