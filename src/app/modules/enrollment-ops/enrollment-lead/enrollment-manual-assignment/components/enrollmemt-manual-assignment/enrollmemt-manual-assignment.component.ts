import { FalloutReconAssignmentService } from './../../../fallout-recon-assignment/services/fallout-recon-assignment.service';
import { EnrollmentManagementService } from 'src/app/services/enrollment-management/enrollment-management.service';
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { EnrollmentManualAssigmentService } from "./enrollment-manual-assignment.service";
import { NotifierService } from 'src/app/services/notifier.service';
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';

@Component({
  selector: "app-enrollmemt-manual-assignment",
  templateUrl: "./enrollmemt-manual-assignment.component.html",
  styleUrls: ["./enrollmemt-manual-assignment.component.css"]
})
export class EnrollmemtManualAssignmentComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private enrollmentService: EnrollmentManagementService,
    private assignmentService: EnrollmentManualAssigmentService,
    private notifierService: NotifierService,
    private falloutReconAssignmentService: FalloutReconAssignmentService,
    private securedLocalStorage: CryptoService
  ) {}
  public subscriptionList = [];
  public cols = [];
  public requestTypes: any[];
  public selectedSubscription: any[];
  public listForm: FormGroup;
  public today = new Date();
  public subscriptionLoading: boolean;
  public addingToQueue: boolean;
  public assignableSubscriptions: any[];
  public showAuditorAssign: boolean;
  public auditorDetails: any[];
  public viewGeneralQueue: boolean;
  public priorities: any[];
  public generalForm: FormGroup;
  public assignmentForm: FormGroup;
  public auditorNames: any[];
  public currentRole: string;
  public noData: boolean;

  ngOnInit() {
    this.currentRole = this.securedLocalStorage.getItem('roleId');
    this.cols = [
      {
        header: "Work Category Name",
        field: "workCategory",
        visible: true,
      },
      {
        header: "Subscription ID",
        field: "subscriptionId",
        visible: true,
      },
      { header: "Priority", field: "priorityLevel", visible: true },
      {
        header: "PROMT Completion Date",
        field: "completionDate",
        visible: true,
      },
      { header: "Receipt Date", field: "receiptDate", visible: true },
      {
        header: "Record Age (In Days)",
        field: "recordAge",
        visible: true,
      },
      {
        header: "Enrollment Specialist Name",
        field: "specialistName",
        visible: true,
      },
      { header: "Member Name", field: "memberName", visible: true },
      { header: "Benefit Plan Name", field: "benefitPlanName", visible: true },
      { header: "Member Group ID", field: "memberGroupId", visible: true },
      { header: "Member Group Name", field: "memberGroupName", visible: true },
      { header: "User Group Name", field: "userGroupName", visible: true },
    ];
    this.setForm();
    this.getRequestType();
    this.getPriority();
  }

  getRequestType() {
    this.requestTypes = [];
    this.enrollmentService.getUserWorkItemTypes().subscribe(res => {
      this.requestTypes = res ? res : [];
    });
  }

  getPriority() {    
    this.priorities = [];
    this.falloutReconAssignmentService
    .getPriorityLevels()
    .subscribe(res => {
      this.priorities = res;
    });
  }

  setForm() {
    const yesterday = new Date(this.today);
    yesterday.setDate(yesterday.getDate() - 1);
    this.listForm = this.fb.group({
      workCategory: [null, [Validators.required]],
      from: [yesterday, [Validators.required]],
      to: [yesterday, [Validators.required]]
    });
    this.generalForm = this.fb.group({
      priorityLevel: ['', [Validators.required]],
      comment: ['', [Validators.required]]
    });
    this.assignmentForm = this.fb.group({
      auditorNames: ['', [Validators.required]],
      priorityLevel: ['', [Validators.required]],
      comment: ['', [Validators.required]]
    });
    this.assignmentForm.get('auditorNames').valueChanges.subscribe(val => console.log(val));
  }

  getSubscription() {
    if (this.listForm.invalid) {
      return;
    }
    const {workCategory, from, to} = this.listForm.value;
    const payload = {
      workCategory,
      fromDate: this.getFormattedDate(from),
      toDate: this.getFormattedDate(to),
    };
    this.subscriptionLoading = true;
    this.subscriptionList = [];
    this.noData = false;
    this.assignmentService.getSubscription(payload).subscribe(res => {
      this.subscriptionLoading = false;
      this.subscriptionList = res || [];
      if (this.subscriptionList.length < 1) {
        this.noData = true;
      }
    }, err => {
      this.subscriptionLoading = false;
    });
  }

  showAssign() {
    this.showAuditorAssign = true;
    this.assignableSubscriptions = this.selectedSubscription;
    this.getAuditorNames()
  }

  showGeneral() {
    this.viewGeneralQueue = true;
  }

  auditorNameChange() {
    const val: any[] = this.assignmentForm.value.auditorNames || [];
    if (val && val.length > 0) {
      const userGroupIds = this.setUserGropIds(val);
      this.assignableSubscriptions = this.selectedSubscription.filter(e => {
        return userGroupIds.indexOf(e.userGroupId) > -1;
      });
    } else {
      this.assignableSubscriptions = this.selectedSubscription;
    }
  }

  private setUserGropIds(val: any[]) {
    let userGroupIds = [];
    val.forEach(aud => {
      userGroupIds = [...userGroupIds, ...aud.userGroupIds];
    });
    return userGroupIds;
  }

  getOptions(col, array = []) {
    const data: any[] =
    array && array.length > 0
        ? array.map((c) => c[col.field]).filter((val, i, self) => self.indexOf(val) === i)
        : [];
    return data;
  }  

  getFormattedDate(date) {
    const year = new Date(date).getFullYear();
    const month = (1 + new Date(date).getMonth()).toString().padStart(2, "0");
    const day = new Date(date)
      .getDate()
      .toString()
      .padStart(2, "0");
    return  year + "-" + month + "-" + day;
  }

  getAuditorNames() {
    this.auditorDetails = [];
    this.assignmentService.getAuditorNames().subscribe(res => {
      const details = res || [];
      this.auditorDetails = details.length > 0 ? [
        ...details.map(e => {
          return {
            label: e.name,
            value: e
          }
        })
      ] : [];
    });
  }

  assigntoAuditor() {
    if (this.assignmentForm.invalid) {
      return;
    }
    const {auditorNames, comment, priorityLevel} = this.assignmentForm.value;
    const payload = {
      taskIds: this.assignableSubscriptions.map(e => e.enrollmentTaskId),
      auditorIds: (auditorNames && auditorNames.length > 0) ? auditorNames.map(e => e.id) : [],
      userGroupIds: (auditorNames && auditorNames.length > 0) ? this.setUserGropIds(auditorNames) : [],
      comments: comment,
      priorityLevel,
    };  
    this.assignmentService.assignToAuditor(payload).subscribe(res => {
      this.showAuditorAssign = false;
      this.notifierService.throwNotification({
        type: "success",
        message: `${this.assignableSubscriptions.length} Subscriptions Added to Auditor Queue`,
      });
    });
  }

  assignToGeneral() { 
    if (this.generalForm.invalid) {
      return;
    }
    const {comment, priorityLevel} = this.generalForm.value;
    const payload = {
      taskIds: this.selectedSubscription.map(e => e.enrollmentTaskId),
      comments: comment,
      priorityLevel,
    };  
    this.assignmentService.assignToGeneral(payload).subscribe(res => {
      this.viewGeneralQueue = false;
      this.notifierService.throwNotification({
        type: "success",
        message: `${this.assignableSubscriptions.length} Subscriptions Added to General Queue`,
      });
    });
  }

  clearForm() {
    this.assignmentForm.setValue({
      auditorNames: [],
      priorityLevel: '',
      comment: ''
    });
    this.generalForm.setValue({
      priorityLevel: '',
      comment: ''
    });
  }
}
