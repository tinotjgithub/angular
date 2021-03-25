import { Component, OnInit, HostListener } from '@angular/core';
import { AuditorService } from 'src/app/services/auditor/auditor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';
import { TaskmanagementService } from 'src/app/services/task-management/taskmanagement.service';
import { HttpClient } from '@angular/common/http';
import { FILE_POSITION } from '../model/auditor.model';
import { CanComponentDeactivate } from 'src/app/guards/route.guard/can-deactivate.gaurd';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { HeaderService } from 'src/app/services/header/header.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-auditor-queue",
  templateUrl: "./auditor-queue.component.html"
})
export class AuditorQueueComponent implements OnInit, CanComponentDeactivate {
  public cols: any[];
  public claimDetails: any[];
  public input: Array<any>;
  public checkListItem: any[] = [];
  public checkedItem: any[] = [];
  public claim: any;
  public auditForm: FormGroup;
  private interval: any;
  public endTimer: string;
  public actualCheckListLength: number;
  private timerRedColor = "#bf0000";
  private timerAmberColor = "#FFBF00";
  public timerColor = "#00bf96";
  public taskId: string;
  public routeForm: FormGroup;
  public steps: MenuItem[] = [
    {label: 'CheckList'},
    {label: 'Audit'},
    {label: 'Attachments'},
  ];
  public step = 0;
  public routeClaimPopup: boolean;
  private STATUS = ['Final', 'Denied', 'Rejected'];
  public isCompleteRouteClaim: boolean;
  public touchedExaminers: any[];

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
    private taskManagementService: TaskmanagementService,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute
  ) {}

  canDeactivate() {
    if (this.claim && this.claim.claimId) {
      this.confirmationService.confirm({
        message: "Please Save/Submit the claim before you navigate to other page",
        acceptLabel: "OK",
        rejectVisible: false
      });
      return false;
    } else {
      return true;
    }
  }

  ngOnInit() {
    this.startTimer('00:00:00');
    this.initiateForm(true);
    this.routeForm = this.fb.group({
      leadManagerName: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      comments: ['', [Validators.required]]
    });
    this.formSubscription();
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
      { field: "queueName", header: "Queue Name" },
    ];
    this.taskId = this.activatedRoute.snapshot.queryParamMap.get('taskId');
    if (this.taskId) {
      this.getClaimByTaskId();
    }
  }

  private initiateForm(disable?) {
    this.auditForm = this.fb.group({
      status: [{ value: "", disabled: disable }, [Validators.required]],
      errorType: [{ value: "", disabled: true }],
      financialImpact: [{ value: "", disabled: true }],
      amount: [{ value: "", disabled: true }],
      reviewComments: [
        { value: "", disabled: true },
        [Validators.maxLength(256)],
      ],
      examiner: [{ value: "", disabled: true }]
    });
  }

  formSubscription() {
    const {
      status,
      errorType,
      financialImpact,
      amount
    } = this.auditForm.controls;
    status.valueChanges.subscribe((val) => {
      this.statusUpdate(val);
    });
    errorType.valueChanges.subscribe((val) => {
      this.errorTypeUpdate(val);
    });
    financialImpact.valueChanges.subscribe((val) => {
      amount.setValue('');
      if (val) {
        amount.setValidators([Validators.required]);
        amount.enable();
        amount.updateValueAndValidity();
      } else {
        amount.setValidators([]);
        amount.disable();
        amount.updateValueAndValidity();
      }
    });
  }

  private errorTypeUpdate(val: any) {
    const {
      financialImpact,
      amount
    } = this.auditForm.controls;
    this.auditForm.patchValue({
      financialImpact: '',
      amount: ''
    });
    if ((val && val === "Financial") || val === "Both") {
      financialImpact.setValidators([Validators.required]);
      financialImpact.enable();
      financialImpact.updateValueAndValidity();
    } else {
      financialImpact.setValidators([]);
      financialImpact.disable();
      financialImpact.updateValueAndValidity();
      amount.setValidators([]);
      amount.disable();
      amount.updateValueAndValidity();
    }
  }

  private statusUpdate(val: any) {
    const {
      errorType,
      financialImpact,
      amount,
      reviewComments,
      examiner
    } = this.auditForm.controls;
    this.auditForm.patchValue({
      errorType: '',
      amount: '',
      financialImpact: '',
      reviewComments: ''
    });
    if (val && val === "FAILED") {
      errorType.setValidators([Validators.required]);
      errorType.enable();
      errorType.updateValueAndValidity();
      reviewComments.setValidators([
        Validators.required,
        Validators.maxLength(256),
      ]);
      reviewComments.enable();
      reviewComments.updateValueAndValidity();
      this.examinerEnableDisable(true);
    } else if (val === "PASSED") {
      errorType.setValidators([]);
      errorType.disable();
      errorType.updateValueAndValidity();
      reviewComments.setValidators([
        Validators.maxLength(256),
      ]);
      reviewComments.enable();
      /* reviewComments.setValidators([]);
      reviewComments.disable(); */
      reviewComments.updateValueAndValidity();
      this.examinerEnableDisable(false);
    } else {
      // this.initiateForm();
      errorType.disable();
      financialImpact.disable();
      reviewComments.disable();
      amount.disable();
      examiner.disable();
    }
  }

  getClaim() {
    this.claimDetails = [];
    this.auditorService.getInitializedClaimForAuditorQueue().subscribe((res) => {
      if (res) {
        this.processClaim(res);
      } else {
        this.auditorService.getClaimForAuditorQueue().subscribe((freshClaim) => {
          this.processClaim(freshClaim);
        });
      }
    });
  }

  getClaimByTaskId() {
    this.claimDetails = [];
    this.auditorService.getClaimForAuditorQueueById(this.taskId).subscribe((res) => {
      this.processClaim(res);
    });
  }

  private processClaim(res: any) {
    this.claimDetails = res ? [res] : [];
    this.claim = res || null;
    res
      ? this.auditForm.controls.status.enable()
      : this.auditForm.controls.status.disable();
    const checklistItems: any[] = (res && res.checkListItems) || [];
    this.actualCheckListLength = checklistItems.length;
    this.checkedItem = (res && res.savedCheckListItems) || [];
    this.checkListItem = checklistItems.filter(e => {
      const selectedChecks = this.checkedItem.map(s => s.name);
      return selectedChecks.indexOf(e.name) === -1;
    });
    this.isCompleteRouteClaim = false;
    if (this.claim) {
      this.checkIsCompleteRouteClaim();
      this.headerService.updateAuditClaimDetails(this.claim);
      const inputArray = [
        this.claim.attachmentOne,
        this.claim.attachmentTwo,
        this.claim.attachmentThree,
        this.claim.attachmentFour,
        this.claim.attachmentFive,
        this.claim.attachmentSix
      ].filter(e => e);
      this.input = inputArray.length > 0 ? inputArray : [''] ;
    }
    this.setFormValues(res);
    this.startTimer(res);
  }

  startTimer(val) {
    this.endTimer = (val && val.endTimer) || '00:00:00';
    if (val && val.claimId) {
      const timeValues = this.endTimer.split(':');
      let seconds = timeValues[2];
      let minutes = timeValues[1];
      let hours = timeValues[0];
      const secFn = (e) => {
        seconds = `0${e - 60}`;
        minutes = String(Number(minutes) + 1);
      };
      const minFn = (e) => {
        minutes = `0${e - 60}`;
        hours = String(Number(hours) + 1);
      };
      this.interval = setInterval(() => {
        const sec = (Number(seconds) + 1);
        sec < 10 ? seconds = `0${sec}` :
        sec > 60  ? secFn(sec)
        : seconds = String(sec);
        const min = Number(minutes);
        if (min < 10) {
          minutes = `0${min}`;
        } else if (min > 60) {
          minFn(min);
        }
        this.endTimer = `${hours}:${minutes}:${seconds}`;
        if (Number(hours) >= 1 || Number(minutes) >= 1 || Number(seconds) >= 30) {
          this.timerColor = this.timerRedColor;
        } else if (Number(seconds) >= 20 && Number(seconds) < 30) {
          this.timerColor = this.timerAmberColor;
        } else {
          this.timerColor = "#00bf96";
        }
      }, 1000);
    }
  }

  setFormValues(claim) {
    if (claim && claim.savedForLater) {
      const {savedForLaterStatus, errorType, financialImpact, auditorAmount, auditorComments} = claim;
      this.auditForm.patchValue({
        status: savedForLaterStatus,
        errorType,
        financialImpact,
        amount: auditorAmount,
        reviewComments: auditorComments
      });
      // this.statusUpdate(status);
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
    this.copyToClipBoard(inputElement);
    this.notifierService.throwNotification({
      type: "success",
      message: "Claim ID copied"
    });
  }

  copyAndOpenHRP(inputElement) {
    this.copyToClipBoard(inputElement);
    this.openHealthEdgeApp();
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

  /* displayCopySuccess() {
    this.notifierService.throwNotification({
      type: "success",
      message: "Claim ID copied"
    });
    this.http
      .get(environment.HEALTH_EDGEURL + "/" + "status")
      .subscribe(res => {});
  } */

  openHealthEdgeApp() {
    this.taskManagementService.callHealthEdge().subscribe(res => {
      if (res.status === "Failure") {
        this.notifierService.throwNotification({
          type: "error",
          message: res.message
        });
      }
    });
  }

  deleteFile(index) {
    this.auditorService.deleteFile(this.claim.auditTaskId, FILE_POSITION[index + 1]).subscribe(res => {
      this.input.splice(index, 1);
      if (res && res.length > 0) {
        const localArray = this.input.filter(e => e.local);
        this.input = [...res, ...localArray];
      }
      if (index === 0 && this.input.length < 1) {
        this.input.push('');
      }
    });
  }

  uploadFile() {
    if (this.input.length > 0 && this.input.filter(e => e && e.local).length > 0) {
      const formData = new FormData();
      formData.append("auditTaskId", this.claim.auditTaskId);
      /* const sortedInput = this.input.filter(e => e).sort((a, b) => {
        const aNo = a.local ? a.index + 1 : FILE_POSITION_NO[a.filePosition];
        const bNo = b.local ? b.index + 1 : FILE_POSITION_NO[b.filePosition];
        return aNo === bNo ? a.local ? -1 : 1 : aNo - bNo;
      }); */
      this.input.forEach((val, i) => {
        if (val && val.local) {
          console.log(val);
          formData.append(FILE_POSITION[String(i + 1)], val.value, val.name);
        }
      });
      this.auditorService.uploadFile(formData).subscribe(res => {
       /*  this.notifierService.throwNotification({
          type: 'success',
          message: 'Files are uplaoded.'
        }); */
      });
    }
  }

  saveForLater(submit?) {
    if (this.checkForCheckList(submit)) {
      return;
    }
    const {status, errorType, financialImpact, amount, reviewComments, examiner} = this.auditForm.value;
    let payload: any = {
      auditTaskId: this.claim.auditTaskId,
      auditorAmount: amount,
      auditorComments: reviewComments,
      endTimer: this.endTimer,
      errorType,
      financialImpact,
      auditorStatus: status,
      saveCheckListItems: this.checkedItem.map(e => e.name),
      examinerId: examiner ? examiner.value : null
    };
    if (this.isCompleteRouteClaim) {
      payload = {...payload, examinerId: examiner ? examiner.value : null};
    }
    if (submit) {
      this.auditorService.submitAuditClaim(payload).subscribe(res => {
        this.notifierService.throwNotification({
          type: 'success',
          message: 'Claim is submitted successfully!'
        });
        this.uploadFile();
        this.headerService.updateAuditClaimDetails(null);
        this.resetData();
      }, err => {
        if (err && err.status === 307) {
          this.notifierService.throwNotification({
            type: 'error',
            message: 'Claims examiner not found. Claim routed to lead'
          });
          this.headerService.updateAuditClaimDetails(null);
          this.resetData();
        }
      });
    } else {
      this.auditorService.saveAuditQueueClaim(payload).subscribe(res => {
        this.notifierService.throwNotification({
          type: 'success',
          message: 'Claim is successfully saved!'
        });
        this.uploadFile();
        this.headerService.updateAuditClaimDetails(null);
        this.resetData();
      });
    }
  }

  private resetData() {
    this.claimDetails = [];
    this.claim = null;
    this.checkListItem = [];
    this.checkedItem = [];
    this.auditForm.reset();
    this.auditForm.disable();
    clearInterval(this.interval);
    this.endTimer = '00:00:00';
    this.timerColor = "#00bf96";
    this.input = [''];
    this.routeForm.reset();
  }

  routeClaim() {
    const formValue = this.routeForm.value;
    const payload = {
      auditTaskId: this.claim.auditTaskId,
      managerLeadUserId: formValue.leadManagerName.id,
      routeComments: formValue.comments,
      routeReasonId: formValue.reason.id,
      endTimer: this.endTimer
    };
    this.auditorService.auditorRouteClaim(payload).subscribe(res => {
      this.routeClaimPopup = false;
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Claim is successfully routed!'
      });
      this.headerService.updateAuditClaimDetails(null);
      this.resetData();
    });
  }

  checkIsCompleteRouteClaim() {
    // this.isCompleteRouteClaim = this.STATUS.indexOf(this.claim.claimStatus) === -1;
    this.touchedExaminers = [];
    this.auditorService.getTouchedClaimsExaminer(this.claim.auditTaskId).subscribe(res => {
      this.touchedExaminers = res || [];
      if (this.touchedExaminers.length === 1) {
        this.auditForm.patchValue({
          examiner: this.touchedExaminers[0]
        });
      }
    });
  }

  stepChange(event) {
    this.step = event;
  }

  private examinerEnableDisable(enable) {
    const { examiner } = this.auditForm.controls;
    examiner.setValidators(enable ? [Validators.required] : []);
    enable ? examiner.enable() : examiner.disable();
    examiner.updateValueAndValidity();
  }

  public checkForCheckList(submit?: boolean) {
    const isChecklistAvailable = this.checkListItem.length > 0;
    return isChecklistAvailable ? (submit ? (this.actualCheckListLength !== this.checkedItem.length) 
      : !(this.checkedItem.length > 0)) : false;
  }
}
