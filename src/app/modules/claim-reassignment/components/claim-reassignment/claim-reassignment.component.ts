import { Component, OnInit } from "@angular/core";
import { ConfirmationService, SelectItem } from "primeng/api";
import { ClaimReassignmentService } from "../../service/claim-reassignment.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { ROLES } from "src/app/shared/constants.js";
import { isNullOrUndefined } from "util";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-claim-reassignment",
  templateUrl: "./claim-reassignment.component.html"
})
export class ClaimReassignmentComponent implements OnInit {
  showSpinner = false;
  gridData: any = [];
  cols: { field: string; header: string }[];
  toRoles: SelectItem[];
  fromRoles: SelectItem[];
  getReassignmentReasonSource: SelectItem[];
  assignFromForm: FormGroup;
  assignToForm: FormGroup;
  userNamesAssignFrom: SelectItem[] = [];
  filtereduserNamesAssignFrom: SelectItem[];
  assignmentReasons: SelectItem[] = [];
  userNamesAssignTo: SelectItem[] = [];
  filteredUserNamesAssignTo: SelectItem[] = [];
  selectedValues: any[] = [];
  assinToStatus: SelectItem[];
  claimsRefreshed: boolean;
  fit = "fit";
  emptyMessage = "No Users found";
  listedCount: any;
  refreshLength: any;
  userGroups: any;
  disableStatus = false;
  multiSelectUsers: boolean;
  managerToManagerOrLeadToLead = false;
  claimStatusCount: { status: string; count: number }[] = [];
  assignToExaminerFromLeadlogin = false;
  loadedUserNames: any;
  pendingAssignment: any;
  public auto: boolean;
  constructor(
    private claimRessignmentService: ClaimReassignmentService,
    private messageService: NotifierService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const type = this.route.snapshot.queryParamMap.get("type");
    this.auto = type && type === "auto";
    this.setCols();
    this.initiallizeAssignToForm();
    this.pendingAssignment = JSON.parse(
      this.route.snapshot.queryParamMap.get("pendingAssignment")
    );
    if (this.pendingAssignment) {
      this.pendingAssignmentInitialization(this.pendingAssignment);
    } else {
      this.normalIntilize();
    }
  }

  initiallizeAssignFromForm() {
    this.assignFromForm = this.formBuilder.group({
      role: [null, Validators.required],
      userName: ["", Validators.required],
      userGroup: [[]],
      assignmentType: ["", Validators.required]
    });
    this.assignFromForm.valueChanges.subscribe(() => {
      this.gridData = [];
      this.selectedValues = [];
      this.listedCount = 0;
    });
    this.assignFromForm.controls.assignmentType.valueChanges.subscribe(val => {
      this.auto = val && val === "auto";
      this.loadClaimStatusCount();
    });
  }

  initiallizeAssignToForm() {
    this.assignToForm = this.formBuilder.group({
      role: [null, Validators.required],
      userName: ["", Validators.required],
      reassignReason: ["", Validators.required],
      reassignComments: ["", [Validators.maxLength(256)]],
      status: ["", Validators.required]
    });
  }

  normalIntilize() {
    this.initiallizeAssignFromForm();
    this.getFromRoles();
    this.getReasignmentReasons();
  }

  // This method will execute only i user came to this page from home page pending assignment Tile
  pendingAssignmentInitialization(pendingAssignment) {
    this.getReasignmentReasons();
    this.userNamesAssignFrom = [
      {
        label: pendingAssignment.userName,
        value: pendingAssignment.userId
      }
    ];
    this.fromRoles = [
      {
        label: pendingAssignment.userRole,
        value: pendingAssignment.roleId
      }
    ];
    this.assignFromForm = this.formBuilder.group({
      role: [
        {
          label: pendingAssignment.userRole,
          value: pendingAssignment.roleId
        },
        Validators.required
      ],
      userName: [
        {
          label: pendingAssignment.userName,
          value: pendingAssignment.userId
        },
        Validators.required
      ],
      userGroup: [[]],
      assignmentType: ["manual", Validators.required]
    });
    this.loadClaimStatusCount();
    this.getToRoles({
      label: pendingAssignment.userRole,
      value: pendingAssignment.roleId
    });
    this.loadUserGroups({
      value: {
        label: pendingAssignment.userName,
        value: pendingAssignment.userId
      }
    });

    this.assignFromForm.valueChanges.subscribe(() => {
      this.gridData = [];
      this.selectedValues = [];
      this.listedCount = 0;
    });
    this.assignFromForm.controls.assignmentType.valueChanges.subscribe(val => {
      this.auto = val && val === "auto";
      this.loadClaimStatusCount();
    });
  }

  getAssignToStatus() {
    const { role: assignFromDto } = this.assignFromForm.value;
    const { role: assignToDto } = this.assignToForm.value;
    const param = { assignFromDto, assignToDto };
    this.claimRessignmentService.getAssignToStatus(param).subscribe(res => {
      const array = res.map(item => {
        return {
          label: item,
          value: item,
          disabled: this.claimStatusCount
            ? this.claimStatusCount.filter(
                e => e.count === 0 && e.status === item
              ).length > 0
            : false
        };
      });
      this.assinToStatus = array.filter(el => {
        if (el.disabled !== true) {
          return { label: el.label, value: el.value };
        }
      });
      if (
        (assignToDto &&
          assignFromDto.label === ROLES.manager &&
          assignToDto.label === ROLES.manager) ||
        (assignToDto &&
          assignFromDto.label === ROLES.lead &&
          assignToDto.label === ROLES.lead)
      ) {
        this.confirmationService.confirm({
          message:
            "Status selection cannot be modified if you assign claims from Manager to Manger or from Lead to Lead",
          acceptLabel: "OK",
          rejectVisible: false
        });
        this.disableStatus = true;
        this.assignToForm.patchValue({
          status: this.assinToStatus
        });
      } else {
        this.disableStatus = false;
      }
    });
  }

  listClaims() {
    this.listedCount = 0;
    this.selectedValues = [];
    const { userName, userGroup, role: fromRole } = this.assignFromForm.value;
    const {
      role: toRole,
      status,
      userName: assignToDto
    } = this.assignToForm.value;

    const param = {
      claimStatus: status.map(e => e.value),
      assignFromDto: userName
    };

    if (this.multiSelectUsers) {
      param[`assignToDtos`] = assignToDto;
    } else {
      param[`assignToDto`] = assignToDto;
    }
    if (userGroup !== null && userGroup.length > 0) {
      param[`userGroups`] = userGroup;
    }
    this.showSpinner = true;
    this.claimRessignmentService.listClaims(param).subscribe(
      res => {
        this.showSpinner = false;
        this.listedCount = res.length;
        this.claimsRefreshed = true;
        this.gridData = res;
        this.messageService.throwNotification({
          type: "success",
          message: "Claims Listed Successfully"
        });
        this.selectAllClaimsForManagerToMangerAndLeadToLead(fromRole, toRole);
      },
      error => {
        this.showSpinner = false;
        this.listedCount = 0;
        this.gridData = [];
        this.messageService.throwNotification({
          type: "warning",
          message: "No Claims Loaded"
        });
      }
    );
  }

  assignFromRoleSelected(event) {
    const param = event.value;
    this.claimRessignmentService
      .getAssignFromUsersList(param)
      .subscribe(res => {
        this.userNamesAssignFrom = res;
      });
    this.assignToForm.reset();
    this.getToRoles(param);
    this.assignFromForm.patchValue({
      userName: null,
      userGroup: null
    });
    this.selectedValues = [];
    this.claimStatusCount = [];
    this.listedCount = 0;
    this.gridData = [];
    this.disableStatus = false;
    this.assignToExaminerFromLeadlogin = false;
  }

  assignToRoleSelected() {
    if (this.assignToExaminerFromLeadlogin) {
      this.assignFromForm.patchValue({
        userName: null
      });
      this.assignToExaminerFromLeadlogin = false;
    }
    const { role: fromRole } = this.assignFromForm.value;
    const { role: toRole } = this.assignToForm.value;
    this.multiSelectUsers =
      fromRole.label === ROLES.manager && toRole.label === ROLES.lead
        ? true
        : false;
    if (
      (fromRole.label === ROLES.lead || fromRole.label === ROLES.manager) &&
      toRole.label === ROLES.processor
    ) {
      this.confirmationService.confirm({
        message:
          "Routed In and Rebuttal/Review statuses are only allowed for examiner Role. Do you want to proceed?",

        reject: () => {
          this.assignToForm.patchValue({
            role: null
          });
          return;
        },
        accept: () => {
          if (
            this.authenticationService.userRole === ROLES.lead &&
            fromRole.label === ROLES.lead &&
            !this.pendingAssignment
          ) {
            this.setMyUserNameAsLead();
          }
          this.getAssignToStatus();
          this.getAssignToUsersList(toRole);
        }
      });
    } else {
      this.getAssignToStatus();
      this.getAssignToUsersList(toRole);
    }
    this.gridData = [];
    this.selectedValues = [];
    this.assignToForm.patchValue({
      status: ""
    });
  }

  setMyUserNameAsLead() {
    this.assignToExaminerFromLeadlogin = true;
    const userName = {
      label: this.authenticationService.userName,
      value: this.authenticationService.userId
    };
    this.assignFromForm.patchValue({
      userName
    });
    this.loadUserGroups({ value: userName });
  }

  onAssignToStatusSelcted() {
    this.gridData = [];
    this.selectedValues = [];
    this.listedCount = 0;
  }

  getAssignToUsersList(toRole: any) {
    const { userName } = this.assignFromForm.value;
    const param = {
      roleDto: toRole,
      assignFromDto: userName
    };
    this.claimRessignmentService.getAssignToUsersList(param).subscribe(res => {
      this.userNamesAssignTo = res;
    });
    this.assignToForm.patchValue({ userName: null });
  }

  getFromRoles() {
    this.claimRessignmentService.getFromRoles().subscribe(data => {
      this.fromRoles = data;
      if (this.auto) {
        this.fromRoles = this.fromRoles.filter(
          e => e.label === "Claims Examiner" || e.label === "Claims Auditor"
        );
      }
    });
  }

  getToRoles(param) {
    this.claimRessignmentService.getToRoles(param).subscribe(data => {
      this.toRoles = data;
    });
  }

  getReasignmentReasons() {
    this.claimRessignmentService.getReassignmentReasonList().subscribe(data => {
      this.mapReassignmentReasons(data.reassignmentReasonDtos);
    });
  }

  mapReassignmentReasons(reassignmentReasonDtos) {
    this.getReassignmentReasonSource = [];
    if (
      reassignmentReasonDtos &&
      reassignmentReasonDtos !== undefined &&
      reassignmentReasonDtos.length > 0
    ) {
      reassignmentReasonDtos.forEach(s => {
        this.getReassignmentReasonSource.push({
          value: s.reassignmentReasonCode,
          label: s.reassignmentReason
        });
      });
    }
  }

  getReasonFromCode(reasonCode) {
    return this.getReassignmentReasonSource.filter(
      reason => reason.value === reasonCode
    );
  }

  reAssign() {
    if (this.selectedValues.length === 0) {
      this.messageService.throwNotification({
        type: "warning",
        message: "Please select Claim ID's to Reassign"
      });
      return;
    }

    const { role: fromRole } = this.assignFromForm.value;
    const { role: toRole } = this.assignToForm.value;
    const message =
      fromRole.label === ROLES.lead && toRole.label === ROLES.processor
        ? // tslint:disable-next-line: max-line-length
          "Rebuttal/Review Status Claim Should be Reassigned to Claims Examiner 'Audit Failed' queue. Press Ok to Proceed and Cancel to Go Back"
        : "Are you sure that you want to Reassign the selected Claim Id(s)?";

    this.confirmationService.confirm({
      message,
      accept: () => {
        this.reAssignClaims();
      },
      acceptLabel: "OK",
      reject: () => {
        return;
      },
      rejectLabel: "Cancel",
      rejectVisible: true
    });
  }

  setCols() {
    this.cols = [
      { field: "claimId", header: "Claim ID" },
      { field: "claimType", header: "Claim Type" },
      { field: "claimStatus", header: "Claim Status" },
      { field: "receiptDate", header: "Receipt Date" },
      { field: "age", header: "Claim Age (In Days)" },
      { field: "providerName", header: "Provider Name" },
      { field: "billedAmount", header: "Billed Amount ($)" },
      { field: "memberName", header: "Member Name" },
      { field: "queueName", header: "Queue Name" },
      { field: "wfmStatus", header: "WFM Status" },
      { field: "wfmAge", header: "WFM Age (In Days)" },
      { field: "userGroup", header: "User Group" }
    ];
  }

  searchAssignFromUserName(event) {
    this.filtereduserNamesAssignFrom = [...this.userNamesAssignFrom].filter(
      item => {
        return item.label.toLowerCase().includes(event.query.toLowerCase());
      }
    );
  }

  searchAssignToUserName(event) {
    this.filteredUserNamesAssignTo = [...this.userNamesAssignTo].filter(
      item => {
        return item.label.toLowerCase().includes(event.query.toLowerCase());
      }
    );
  }

  getFormControl(controlName) {
    return this.assignFromForm.get(controlName);
  }

  getAssignToFormControl(controlName) {
    return this.assignToForm.get(controlName);
  }

  selectAllClaimsForManagerToMangerAndLeadToLead(fromUser, toUser) {
    if (
      !isNullOrUndefined(fromUser) &&
      !isNullOrUndefined(toUser) &&
      fromUser.label === toUser.label &&
      (fromUser.label === ROLES.lead || toUser.label === ROLES.manager)
    ) {
      this.selectedValues = [...this.gridData];
      this.managerToManagerOrLeadToLead = true;
    } else {
      this.managerToManagerOrLeadToLead = false;
    }
  }

  reAssignClaims() {
    const { userName: assignFromDto } = this.assignFromForm.value;
    const {
      userName: assignToDto,
      reassignReason,
      reassignComments,
      userGroup
    } = this.assignToForm.value;
    this.auto
      ? this.autoReassignment(assignFromDto)
      : this.manualReassignment(
          assignFromDto,
          reassignComments,
          reassignReason,
          userGroup,
          assignToDto
        );
  }

  private manualReassignment(
    assignFromDto: any,
    reassignComments: any,
    reassignReason: any,
    userGroup: any,
    assignToDto: any
  ) {
    const param = {
      assignFromDto,
      claimDetailsDtos: this.selectedValues,
      reassignComments,
      reassignReason: {
        reassignmentReasonCode: reassignReason
      }
    };
    if (!isNullOrUndefined(userGroup) && userGroup.length > 0) {
      param[`userGroups`] = userGroup;
    }
    if (this.multiSelectUsers) {
      param[`assignToDtos`] = assignToDto;
    } else {
      param[`assignToDto`] = assignToDto;
    }
    this.showSpinner = true;
    this.claimRessignmentService.reAssignClaims(param).subscribe(res => {
      this.reset();
      this.messageService.throwNotification({
        type: "success",
        message: "Claims Reassigned Successfully"
      });
    });
  }

  private autoReassignment(assignFromDto: any) {
    const param = {
      assignFromDto,
      claimDetailsDtos: this.selectedValues
    };
    this.showSpinner = true;
    this.claimRessignmentService.autoReAssignClaims(param).subscribe(res => {
      this.reset();
      this.messageService.throwNotification({
        type: "success",
        message: "Claims Reassigned Successfully"
      });
    });
  }

  private reset() {
    this.assignToForm.reset();
    this.assignToExaminerFromLeadlogin = false;
    this.selectedValues = [];
    this.userNamesAssignTo = [];
    this.assinToStatus = [];
    this.refreshLength = 0;
    this.listedCount = 0;
    this.disableStatus = false;
    this.managerToManagerOrLeadToLead = false;
    this.showSpinner = false;
    this.gridData = [];
    this.loadClaimStatusCount();
  }

  loadUserGroups(event) {
    const { value, label } = event.value;
    const param = {
      assignFromDto: {
        value,
        label
      }
    };
    this.claimRessignmentService.loadUserGroups(param).subscribe(res => {
      this.userGroups = res;
      this.assignFromForm.patchValue({
        userGroup: res
      });
      this.autoLoadGrid();
    });
  }

  loadClaimStatusCount() {
    this.claimStatusCount = [];
    this.gridData = [];
    const { userName: assignFromDto, userGroup } = this.assignFromForm.value;
    const param = {
      assignFromDto,
      userGroups: userGroup
    };
    this.auto ? this.autoLoadCount(param) : this.manualLoadCount(param);
  }

  autoLoadGrid() {
    if (this.assignFromForm.value.assignmentType === "auto") {
      this.loadClaimStatusCount();
    }
  }

  private manualLoadCount(param: { assignFromDto: any; userGroups: any }) {
    this.claimRessignmentService.loadClaimStatusCount(param).subscribe(
      res => {
        this.claimStatusCount = res;
      },
      error => {
        this.listedCount = 0;
        this.gridData = [];
        this.selectedValues = [];
        this.messageService.throwNotification({
          type: "warning",
          message: "No Claims for selected criteria"
        });
      }
    );
  }

  private autoLoadCount(param: { assignFromDto: any; userGroups: any }) {
    this.showSpinner = true;
    this.claimRessignmentService.loadClaimStatusCountAndList(param).subscribe(
      res => {
        this.showSpinner = false;
        this.claimStatusCount = res ? res.statusResponseDtoList : [];
        this.gridData = res ? res.claimDetailsDtos : [];
        this.selectedValues = [...this.gridData];
      },
      error => {
        this.showSpinner = false;
        this.listedCount = 0;
        this.gridData = [];
        this.selectedValues = [];
        this.messageService.throwNotification({
          type: "warning",
          message: "No Claims for selected criteria"
        });
      }
    );
  }
}
