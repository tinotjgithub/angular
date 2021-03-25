import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FalloutReconAssignmentService } from "./../../services/fallout-recon-assignment.service";
import { NotifierService } from "src/app/services/notifier.service";
import { Table } from "primeng/table";
import { FILE_POSITION } from "./../../../../../auditor/model/auditor.model";
import { ConfirmationService } from "primeng/api";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-fallout-recon-assignment",
  templateUrl: "./fallout-recon-assignment.component.html",
  styleUrls: ["./fallout-recon-assignment.component.css"]
})
export class FalloutReconAssignmentComponent implements OnInit {
  @ViewChild("pendReasonTable", { static: false }) pendReasonTable: Table;
  public input: Array<any> = new Array(1);
  showSpinner = false;
  public subscriptionList = [];
  public userGroupSpecialistList = [];
  public assignedCount = "";
  public userGroupList = [];
  public specialistList = [];
  assignmentType = [
    { label: "Manual Assignment", value: "Manual" },
    { label: "Auto Assignment", value: "Auto" }
  ];
  cols: { field: string; header: string; filter?: string }[];
  addUserGroup: any;
  showErrorReport: any;
  editing: any;
  workCategories: any = [];
  workCategory: "";
  public userForm: FormGroup;
  public dialogForm: FormGroup;
  assignmentForm: FormGroup;
  requestTypes: [];
  quenames: [];
  leads: [];
  allSpecialistList: any;
  managers: [];
  selectedClaims: any[];
  auditorName: any;
  count: any;
  selectedToAssign: never[];
  selctedLength: number;
  selectedAll: boolean;
  fileUploadSuccess: boolean;
  errorCount: any;
  successCount: any;
  fileMetadataId: any;
  errorList: any;
  errorCols: { field: string; header: string; filter?: string }[];
  needRefresh: any;
  fileName: string;
  prevWorkCategory: any;
  userGroupResponseDto: any;
  today = new Date();
  checkedMessage: any;
  priorityLevels: any[];
  subscriptionsLoaded: any;
  constructor(
    private fb: FormBuilder,
    private messageService: NotifierService,
    private fb2: FormBuilder,
    private falloutReconAssignmentService: FalloutReconAssignmentService,
    private confirmationService: ConfirmationService,
    public datePipe: DatePipe
  ) {}
  ngOnInit() {
    this.initilaizeForm();
    this.getWorkCategories();
    this.selectedClaims = [];
    this.cols = [
      { field: "subscriptionId", header: "Subscription ID", filter: "text" },
      { field: "subscriberName", header: "Subscriber Name" },
      { field: "reportDate", header: "Report Date" },
      { field: "recordAge", header: "Record Age (In Days)", filter: "text" },
      { field: "memberGroupId", header: "Member Group ID" },
      { field: "memberId", header: "Member ID", filter: "text" },
      { field: "memberLastName", header: "Member Last Name" },
      { field: "memberFirstName", header: "Member First Name" },
      { field: "memberDOB", header: "Member DOB" },
      { field: "relationToSubscriber", header: "Relation To Subscriber" },
      { field: "errorDetails", header: "Error Details" }
    ];
  }

  constructCol(payload) {
    this.errorCols = [];
    payload.map((el, index) => {
      this.errorCols.push({
        field: "val" + index,
        header: el
      });
    });
  }

  constructRecords(payload) {
    this.errorList = [];
    payload.forEach(records => {
      const obj = {};
      records.forEach((value, index) => {
        obj["val" + index] = value;
      });
      this.errorList.push(obj);
    });
  }

  showErrorReportPopUp(show) {
    if (show) {
      this.falloutReconAssignmentService
        .getErrorRecords(this.fileMetadataId)
        .subscribe(res => {
          this.constructCol(res.columnHeader);
          this.constructRecords(res.records);
          this.showErrorReport = true;
        });
    } else {
      this.showErrorReport = show;
    }
  }

  initilaizeForm() {
    this.userForm = this.fb.group({
      workCategory: ["", [Validators.required]],
      reportDate: ["", [Validators.required]],
      referenceNumber: [""]
    });

    this.dialogForm = this.fb2.group({
      userGroup: ["", [Validators.required]],
      specialistName: [[], [Validators.required]],
      priority: ["Low", [Validators.required]],
      comments: [""]
    });

    this.userForm.controls[`workCategory`].valueChanges.subscribe(() => {
      this.prevWorkCategory = this.userForm.value[`workCategory`];
    });
  }

  getWorkCategories() {
    this.workCategories = [];
    this.falloutReconAssignmentService.getWorkCategories().subscribe(res => {
      this.workCategories = res.map(el => {
        return { value: el, label: el };
      });
    });
  }

  onChangeWorkCategory() {
    if (
      this.userForm.get("reportDate").valid ||
      this.userForm.get("referenceNumber").touched
    ) {
      this.confirmationService.confirm({
        message:
          "Changing work category will reset all fields. Do you want to continue?",
        accept: () => {
          this.changeWorkCategory();
        },
        reject: () => {
          this.userForm.patchValue({
            workCategory: this.prevWorkCategory
          });
        }
      });
    } else {
      this.changeWorkCategory();
    }
  }

  changeWorkCategory() {
    this.userForm.get("reportDate").reset();
    this.userForm.get("referenceNumber").reset();
    this.input = [""];
    this.fileUploadSuccess = false;
    this.selectedClaims = [];
    this.subscriptionList = [];
    this.errorList = [];
    this.falloutReconAssignmentService
      .getLoadingStatusAgainstWorkCategory(
        this.userForm.get("workCategory").value
      )
      .subscribe(loading => {
        this.showSpinner = loading;
        this.needRefresh = loading;
        if (loading) {
          this.messageService.throwNotification({
            type: "warning",
            message: "File is still being loaded, please refresh after sometime"
          });
        }
      });
  }

  getOptions(col) {
    const data: any[] =
      this.subscriptionList.length > 0
        ? this.subscriptionList
            .map(c => c[col.field])
            .filter((val, i, self) => self.indexOf(val) === i)
        : [];
    return data;
  }

  deleteFile() {
    this.input = [""];
    this.fileUploadSuccess = false;
  }

  getGridDetails() {
    this.showSpinner = true;
    this.falloutReconAssignmentService
      .getGridDetails({
        workCategory: this.userForm.get("workCategory").value,
        fileMetadataId: this.fileMetadataId
      })
      .subscribe(
        res => {
          this.showSpinner = false;
          this.subscriptionList = res;
          this.subscriptionsLoaded = res;
          if (this.subscriptionList.length <= 0) {
            this.messageService.throwNotification({
              type: "warning",
              message: "No Subscriptions Loaded"
            });
          }
        },
        err => {
          this.showSpinner = false;
          this.messageService.throwNotification({
            type: "error",
            message: "No Subscriptions Loaded"
          });
        }
      );
  }

  select(event) {
    const subscriptionId = event.data.subscriptionId;
    const claims = [...this.subscriptionList].filter(item => {
      return item.subscriptionId === subscriptionId && item.assigned !== "Yes";
    });
    this.selectedClaims.push(...claims);
    this.selectedClaims = [...new Set(this.selectedClaims)];
    this.selectedAll = this.isAllSelected();
  }

  unSelect(event) {
    const subscriptionId = event.data.subscriptionId;
    this.selectedClaims = this.selectedClaims.filter(item => {
      return item.subscriptionId !== subscriptionId;
    });
    this.selectedAll = this.isAllSelected();
  }

  selectRow(checkValue) {
    if (checkValue) {
      this.selectedClaims = [...this.subscriptionList];
    } else {
      this.selectedClaims = [];
    }
    this.selectedAll = this.isAllSelected();
  }

  isAllSelected() {
    const all = this.subscriptionList.length;
    const selected = this.selectedClaims.length;
    return all === selected;
  }

  resetTable(table) {
    if (table) {
      table.reset();
    }
  }

  saveDetails() {
    const stagingIds =
      this.selectedClaims && this.selectedClaims.length > 0
        ? this.selectedClaims.map(item => {
            return item.stagingId;
          })
        : [];

    const {
      userGroup,
      specialistName,
      priority,
      comments
    } = this.dialogForm.value;

    // CREATE REQ
    const payload = {
      stagingIds,
      userGroupIds: userGroup ? userGroup.map(el => el.id) : [],
      specialists: specialistName ? specialistName.map(el => el.id) : [],
      priorityLevel: priority,
      comments
    };

    this.falloutReconAssignmentService.saveDetails(payload).subscribe(res => {
      this.addUserGroup = false;
      this.selectedAll = false;
      this.selectedClaims = [];
      if (res) {
        this.reduceArray(
          stagingIds,
          Array.isArray(res) && res.length > 0 ? res : []
        );
      }
      this.messageService.throwNotification({
        type: "success",
        message: "Subscriptions Assigned Successully."
      });
    });
  }

  reduceArray(assignedIds: any[] = [], failedIds: any[] = []) {
    // REMOVE ASSIGNED SUBS && ADD FAILED SUBS
    const array = [...this.subscriptionsLoaded].filter(el => {
      return !assignedIds.includes(el.stagingId);
    });
    this.subscriptionList = [
      ...array,
      ...this.subscriptionsLoaded.filter(el => {
        return failedIds.includes(el.stagingId);
      })
    ];
    // SET FAILED SUBS AS SELECTED SUBS
    if (failedIds.length > 0) {
      this.selectedClaims = [...this.subscriptionsLoaded].filter(el => {
        return failedIds.includes(el.stagingId);
      });
    }

    this.subscriptionsLoaded = [...this.subscriptionList];
    this.selectedAll = this.isAllSelected();
  }

  onFileChange() {
    this.fileUploadSuccess = false;
  }

  onChangeRequestType() {
    this.dialogForm.get("userGroup").reset();
    this.dialogForm.get("specialistName").reset();
  }

  mapUserGroups(userGrps = []) {
    return userGrps.map(el => {
      return { id: el.id, name: el.name };
    });
  }

  onChangeUserGrp() {
    const usergrpVal: any[] = this.dialogForm.get("userGroup").value.map(el => {
      return el.id;
    });
    const currentUserGrpDetails =
      this.userGroupResponseDto && this.userGroupResponseDto.length > 0
        ? this.userGroupResponseDto.filter(element => {
            return usergrpVal.includes(element.id);
          })
        : [];
    const specialistArray = [];
    currentUserGrpDetails.map(e => {
      specialistArray.push(...e.specialists);
    });
    this.specialistList = specialistArray.map(e => {
      return {
        label: e.name,
        assignedCount: e.assignedCount,
        pendedCount: e.pendedCount,
        value: e
      };
    });
  }

  checkSubscriptionMessage() {
    this.checkedMessage = null;
    const stagingIds = this.selectedClaims.map(el => {
      return el.stagingId;
    });
    const { specialistName } = this.dialogForm.value;
    const requestBody = {
      stagingIds,
      specialists: specialistName ? specialistName.map(el => el.id) : []
    };
    this.falloutReconAssignmentService
      .checkEnrollSubscriptions(requestBody)
      .subscribe(res => {
        this.checkedMessage = res.message;
      });
  }

  cancelChanges() {
    this.dialogForm.reset();
    this.checkedMessage = null;
  }

  assignClick() {
    if (this.selectedClaims.length > 0) {
      const stagingIds = this.selectedClaims.map(el => {
        return el.stagingId;
      });
      this.falloutReconAssignmentService
        .getUsergrpAndItsSpecialists(stagingIds)
        .subscribe(res => {
          this.userGroupResponseDto = res.userGroupResponseDtos;
          this.userGroupList = res.userGroupResponseDtos
            ? this.mapUserGroups(res.userGroupResponseDtos)
            : [];
        });
      this.addUserGroup = true;
      this.dialogForm.patchValue({
        priority: "Low"
      });
      this.falloutReconAssignmentService.getPriorityLevels().subscribe(res => {
        this.priorityLevels = res;
      });
    } else {
      this.messageService.throwNotification({
        type: "warning",
        message: "No subscriptions selected"
      });
    }
  }

  uploadFile() {
    this.userForm.get("workCategory").markAsTouched();
    if (
      this.input.length > 0 &&
      this.input.filter(e => e && e.local).length > 0 &&
      this.userForm.valid
    ) {
      const formData = new FormData();
      this.showSpinner = true;
      let fileUploaded = false;
      this.selectedClaims = [];
      this.selectedAll = false;
      this.fileName = "";
      formData.append(
        "reportDate",
        this.datePipe.transform(
          new Date(this.userForm.get("reportDate").value),
          "MM/dd/yyyy hh:mm"
        )
      );
      formData.append(
        "referenceNumber",
        this.userForm.get("referenceNumber").value
      );
      formData.append("workCategory", this.userForm.get("workCategory").value);
      this.input.forEach((val, i) => {
        if (val && val.local) {
          formData.append(FILE_POSITION[String(i + 1)], val.value, val.name);
          fileUploaded = true;
        }
        this.fileName = val.fileName;
      });
      if (fileUploaded) {
        this.subscriptionList = [];
        this.falloutReconAssignmentService.uploadFile(formData).subscribe(
          res => {
            this.showSpinner = false;
            if (res.rejected) {
              this.confirmationService.confirm({
                header: "Warning",
                message: res.rejectionMessage,
                acceptLabel: "Ok",
                rejectVisible: false
              });
              this.fileMetadataId = res.fileMetadataId;
              if (res.downloadTrigger) {
                this.downloadFile();
              }
              this.input = [""];
              this.fileUploadSuccess = false;
              this.selectedClaims = [];
              this.subscriptionList = [];
              this.errorList = [];
              this.userForm.reset();
            } else {
              this.fileUploadSuccess = true;
              this.errorCount = res.errorCount;
              this.successCount = res.successCount;
              this.fileMetadataId = res.fileMetadataId;
              if (this.errorCount && Number(this.errorCount) > 0) {
                this.downloadFile();
              }
              this.getGridDetails();
            }
          },
          err => {
            this.showSpinner = false;
            this.messageService.throwNotification({
              type: "error",
              message: "File Upload Failed"
            });
          }
        );
      }
    } else {
      this.messageService.throwNotification({
        type: "error",
        message: "File Upload Failed"
      });
    }
  }

  downloadFile() {
    const ext = this.fileName.substring(this.fileName.lastIndexOf(".") + 1);
    if (this.fileMetadataId) {
      const date = new Date(this.userForm.get("reportDate").value);
      const fileName =
        date.getMonth().toString() +
        1 +
        "-"
          .concat(date.getDate().toString() + "-")
          .concat(date.getUTCFullYear().toString());
      this.falloutReconAssignmentService.downloadFile(
        this.fileMetadataId,
        `Fallout-File Load Errors-${fileName}.${ext}`
      );
    }
  }
}
