import { ConfirmationService } from 'primeng/api';
import { HeaderService } from 'src/app/services/header/header.service';
import { FILE_POSITION } from 'src/app/modules/auditor/model/auditor.model';
import { EnrollmentAuditorService } from './../../services/enrollment-auditor.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { NotifierService } from 'src/app/services/notifier.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auditor-queue',
  templateUrl: './auditor-queue.component.html'
})
export class AuditorQueueComponent implements OnInit {

  public subscription: any;
  public requestType: string;
  public requestTypes: any[];
  public cols: any[];
  public auditForm: FormGroup;
  public input: Array<any>;
  public checkListItem: any[] = [];
  public checkedItem: any[] = [];
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
  public step: any;
  public routeClaimPopup: boolean;
  public routeReasons: any[];
  public managerLeadNameDetails: any[];
  public routeRoleList: any[];
  public assignedData = [];
  public backlogData = [];
  public totalData = {
    assigned: 0,
    backlog: 0
  };
  public activeIndex = 0;

  @HostListener("window:beforeunload", ["$event"])
  public beforeunloadHandler($event) {
    $event.preventDefault();
    if (this.subscription) {
      $event.returnValue = "Are you sure?";
    }
  }

  constructor(
    private fb: FormBuilder,
    private auditorService: EnrollmentAuditorService,
    private notifierService: NotifierService,
    private headerService: HeaderService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  canDeactivate() {
    if (this.subscription && this.subscription.subscriptionId) {
      this.confirmationService.confirm({
        message: "Please Save/Submit the transaction before you navigate to other page",
        acceptLabel: "OK",
        rejectVisible: false
      });
      return false;
    } else {
      return true;
    }
  }

  ngOnInit() {
    this.initiateForm();
    this.cols = [
      { header: "Work Category", field: "workCategory", visible: true },
      { header: "Processed Date", field: "processedDate", visible: true },
      {
        header: "Record Age (In Days)",
        field: "recordAge",
        visible: true,
      },
      { header: "Subscriber Name", field: "subscriberName", visible: true },
      { header: "Member Group Name", field: "memberGroupName", visible: true },
      { header: "Member ID", field: "memberId", visible: true },
      { header: "Member Last Name", field: "memberLastName", visible: true },
      { header: "Member First Name", field: "memberFirstName", visible: true },
      { header: "Member DOB", field: "memberDob", visible: true },
      {
        header: "Relation To Subscriber",
        field: "relationToSubscriber",
        visible: true,
      },
      { header: "User Group Name", field: "userGroupName", visible: true },
      // { header: "Error Details", field: "errorDetails", visible: true, large: true },
    ];
    const taskId = this.activatedRoute.snapshot.queryParamMap.get('taskId');
    if (taskId) {
      this.getSubscriptionById(taskId)
    } 
    this.getStatusCount();
    this.getRequestTypes();
    this.setStep();
  }

  navigateToDetail(status: string, requestType) {
    const statusRoute = status.replace(/\s/g, '').toLowerCase();
    this.router.navigateByUrl(`/enrollment-auditor/${statusRoute}-queue?type=${requestType}`);
  }

  getStatusCount() {
    this.assignedData = [];
    this.backlogData = [];
    this.auditorService.getLandingPageCount().subscribe(res => {
      const array = res || [];
      array.forEach(e => {
        if (e.status === 'Assigned') {
          this.assignedData = e.workCategoryList;
          this.totalData.assigned = (e.workCategoryList as any[]).map(e => e.requestCount).reduce((prev, current) => {
            return prev + current
          });
        }
        if (e.status === 'Backlog') {
          this.backlogData = e.workCategoryList;
          this.totalData.backlog = (e.workCategoryList as any[]).map(e => e.requestCount).reduce((prev, current) => {
            return prev + current
          });
        }
      });
    })
  }

  stepChange(index) {
    this.step = this.steps[index];
    this.activeIndex = index;
  }

  private initiateForm() {
    this.auditForm = this.fb.group({
      status: ["", [Validators.required]],
      reviewComments: ["", [Validators.maxLength(256)]],
    });
    this.routeForm = this.fb.group({
      role: ['', [Validators.required]],
      leadManagerName: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      comments: ['', [Validators.required]]
    });
    this.routeForm.controls.role.valueChanges.subscribe(val => val && this.changeRole(val.id));
  }

  loadRolesAndReasons() {
    this.routeRoleList = [];
    this.routeReasons = [];
    this.auditorService.getRolesAndReasons(this.subscription.auditTaskId).subscribe(res => {
      this.routeRoleList = res? res.routeRoles : [];
      this.routeReasons = res? res.routeReasons : [];
    });
  }

  changeRole(role) {
    this.managerLeadNameDetails = [];
    this.auditorService.getManagerLeadNames(this.subscription.auditTaskId, role).subscribe(res => {
      this.managerLeadNameDetails = res ? [res] : [];
    });
  }
  
  setFormValues(subscription) {
    if (subscription && subscription.savedForLater) {
      const {savedForLaterStatus, savedAuditorComments} = subscription;
      this.auditForm.patchValue({
        status: savedForLaterStatus,
        reviewComments: savedAuditorComments
      });
    }
  }

  startTimer(val) {
    this.endTimer = (val && val.endTimer) || "00:00:00";
    if (val && val.subscriptionId) {
      const timeValues = this.endTimer.split(":");
      let seconds = timeValues[2];
      let minutes = timeValues[1];
      let hours = timeValues[0];
      const secFn = e => {
        seconds = `0${e - 60}`;
        minutes = String(Number(minutes) + 1);
      };
      const minFn = e => {
        minutes = `0${e - 60}`;
        hours = String(Number(hours) + 1);
      };
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(() => {
        const sec = Number(seconds) + 1;
        sec < 10
          ? (seconds = `0${sec}`)
          : sec > 59
          ? secFn(sec)
          : (seconds = String(sec));
        const min = Number(minutes);
        if (min < 10) {
          minutes = `0${min}`;
        } else if (min > 59) {
          minFn(min);
        }
        this.endTimer = `${hours}:${minutes}:${seconds}`;
        if (
          Number(hours) >= 1 ||
          Number(minutes) >= 1 ||
          Number(seconds) >= 30
        ) {
          this.timerColor = this.timerRedColor;
        } else if (Number(seconds) >= 20 && Number(seconds) < 30) {
          this.timerColor = this.timerAmberColor;
        } else {
          this.timerColor = "#00bf96";
        }
      }, 1000);
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
  }

  openHealthEdgeApp() {
    /* this.taskManagementService.callHealthEdge().subscribe(res => {
      if (res.status === "Failure") {
        this.notifierService.throwNotification({
          type: "error",
          message: res.message
        });
      }
    }); */
  }

  deleteFile(index) {
    this.auditorService.deleteFile(this.subscription.auditTaskId, FILE_POSITION[index + 1]).subscribe(res => {
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
      formData.append("auditTaskId", this.subscription.auditTaskId);
      this.input.forEach((val, i) => {
        if (val && val.local) {
          console.log(val);
          formData.append(FILE_POSITION[String(i + 1)], val.value, val.name);
        }
      });
      this.auditorService.uploadFile(formData).subscribe(res => {});
    }
  }

  getRequestTypes() {
    this.requestTypes = [];
    this.auditorService.getWorkCategoryForAuditor().subscribe((res: any) => {
      this.requestTypes = res;
    });
  }

  public checkForCheckList(submit?: boolean) {
    const isChecklistAvailable = this.subscription.checkListEnabled && this.checkListItem.length > 0;
    return isChecklistAvailable ? (submit ? (this.actualCheckListLength !== this.checkedItem.length) 
      : false) : false;
  }

  getSubscription() {
    if (this.requestType) {
      this.subscription = null;
      this.auditorService.getSubscriptionAuditor(this.requestType.toLowerCase()).subscribe(res => {
        this.procesSubscription(res);
      });
    }
  }

  getSubscriptionById(taskID) {
    this.subscription = null;
    this.auditorService.getSubscriptionAuditorByTaskID(taskID).subscribe(res => {
      this.procesSubscription(res);
    });
  }

  private procesSubscription(res: any) {
    this.subscription = res || null;
    const checklistItems: any[] = (res && res.checkListItems) || [];
    this.actualCheckListLength = checklistItems.length;
    this.checkedItem = (res && res.savedCheckListItems) || [];
    this.checkListItem = checklistItems.filter(e => {
      return this.checkedItem.indexOf(e) === -1;
    });
    if (this.subscription && (!this.subscription.checkListEnabled)) {
      this.steps = this.steps.filter(e => e.label !== 'CheckList');
    }
    this.setStep();
    if (this.subscription) {
      this.headerService.updateAuditClaimDetails(this.subscription);
      const inputArray = [
        this.subscription.auditAttachmentOne,
        this.subscription.auditAttachmentTwo,
        this.subscription.auditAttachmentThree,
        this.subscription.auditAttachmentFour,
        this.subscription.auditAttachmentFive,
        this.subscription.auditAttachmentSix
      ].filter(e => e);
      this.input = inputArray.length > 0 ? inputArray : [''] ;
    }
    this.setFormValues(res);
    this.startTimer(res);
  }

  private resetData() {
    this.subscription = null;
    this.checkListItem = [];
    this.checkedItem = [];
    this.auditForm.reset();
    this.routeClaimPopup = false;
    clearInterval(this.interval);
    this.endTimer = '00:00:00';
    this.timerColor = "#00bf96";
    this.input = [''];
    this.routeForm.reset();
    this.headerService.updateAuditClaimDetails(null);
  }

  route() {
    if (this.routeForm.valid) {
      const formValue = this.routeForm.value;
      const payload = {
        auditTaskId: this.subscription.auditTaskId,
        endTimer: this.endTimer,
        managerLeadUserId: formValue.leadManagerName ? formValue.leadManagerName.id : null,
        routeComments: formValue.comments,
        routeReasonId: formValue.reason ? formValue.reason.id : null,
      };
      this.auditorService.routeSubscription(payload).subscribe(res => {
        this.notifierService.throwNotification({
          type: 'success',
          message: 'Subscription routed successfully.'
        });
        this.resetData();
        this.getStatusCount();
      }, err => {
        this.notifierService.throwNotification({
          type: 'error',
          message: 'Failed to route suscription.'
        });
      });      
    }
  }

  saveForLater(submit?) {
    if (this.auditForm.valid && !this.checkForCheckList(submit)) {
      const formValue = this.auditForm.value;
      const payload = {
        auditTaskId: this.subscription.auditTaskId,
        auditorComments: formValue.reviewComments,
        auditStatus: formValue.status,
        endTimer: this.endTimer,
        saveCheckListItems: this.checkedItem,
      };
      this.auditorService.saveOrSubmitSubscription(payload, submit).subscribe(res => {
        this.notifierService.throwNotification({
          type: 'success',
          message: `Subscription ${submit ? 'submitted' : 'saved'} successfully.`
        });
        this.uploadFile();
        this.resetData();
        this.getStatusCount();
      }, err => {
        if (err && err.status === 307) {
          this.notifierService.throwNotification({
            type: 'error',
            message: 'Enrollment Specialist Not Found & Routing To Enrollment Lead.'
          });
          this.headerService.updateAuditClaimDetails(null);
          this.resetData();
          this.getStatusCount();
        }
      });      
    }
  }

  setStep() {
    this.step = this.steps[0];
    this.activeIndex = 0;
  }

}
