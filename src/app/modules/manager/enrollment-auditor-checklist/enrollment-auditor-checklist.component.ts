import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { ChecklistService } from "./services/checklist.service";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { EnableAuditChecklistService } from "../../admin/enable-audit-checklist/service/enable-audit-checklist.service";

@Component({
  selector: "app-enrollment-auditor-checklist",
  templateUrl: "./enrollment-auditor-checklist.component.html",
  styleUrls: ["./enrollment-auditor-checklist.component.css"]
})
export class EnrollmentAuditorChecklistComponent implements OnInit {
  public cols: any[];
  public selectedClaims: ClaimsChecklist = ClaimsChecklist.initialize();
  public claimsData: any[] = [];
  public checklistForm: FormGroup;
  public addChecklist: boolean;
  workCategoryList: any;
  edit: boolean;
  unEditedCheckpoint: any;
  unEditedWorkCategory: any;
  workCategoryStatus: any;

  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private auditorService: ChecklistService,
    private enrollmentManagementService: EnrollmentManagementService,
    private enableAuditChecklistService: EnableAuditChecklistService
  ) {}

  ngOnInit() {
    this.checklistForm = this.fb.group({
      type: ["", [Validators.required]],
      checkpoint: ["", [Validators.required, Validators.maxLength(100)]]
    });
    this.cols = [
      { field: "checkpoint", header: "Checkpoint" },
      { field: "delete", header: "Delete" },
      { field: "select", header: "Select" }
    ];

    this.getChecklistItems();
    this.getWorkCategories();
  }

  getWorkCategories() {
    this.enrollmentManagementService.getUserWorkItemTypes().subscribe(res => {
      this.workCategoryList = res;
    });
  }

  getChecklistItems() {
    this.auditorService.getChecklist().subscribe(res => {
      if (res.workCategoryEnabledOrDisabled) {
        this.workCategoryStatus = res.workCategoryEnabledOrDisabled;
      }

      const claimsData = this.getChecklistValue(res);
      this.claimsData = [];
      this.setChecklistData(res, claimsData);
    });
  }

  addCheckPoint() {
    if (this.checklistForm.invalid) {
      const message =
        this.checklistForm.get("checkpoint").hasError("required") ||
        this.checklistForm.get("type").hasError("required")
          ? "Claim Type & Checkpoint Name are required."
          : "Checkpoint Name should be alphanumeric.";
      this.notifierService.throwNotification({
        type: "warning",
        message
      });
      return;
    }
    if (!String(this.checklistForm.value.checkpoint).trim()) {
      this.notifierService.throwNotification({
        type: "warning",
        message: "Work Item Type & Checkpoint Name are required."
      });
      return;
    }
    const payload = {
      checkpoints: {
        [this.checklistForm.value.type.name]: [
          String(this.checklistForm.value.checkpoint).trim()
        ]
      }
    };
    this.auditorService.addChecklist(payload).subscribe(res => {
      this.notifierService.throwNotification({
        type: "success",
        message: "Checkpoint successfully added!"
      });
      this.addChecklist = false;
      this.checklistForm.reset();
      const claimsData = this.getChecklistValue(res);
      this.claimsData = [];
      this.setChecklistData(res, claimsData);
    });
  }

  editCheckPoint() {
    if (this.checklistForm.invalid) {
      const message =
        this.checklistForm.get("checkpoint").hasError("required") ||
        this.checklistForm.get("type").hasError("required")
          ? "Work Item Type & Checkpoint Name are required."
          : "Checkpoint Name should be alphanumeric.";
      this.notifierService.throwNotification({
        type: "warning",
        message
      });
      return;
    }
    if (!String(this.checklistForm.value.checkpoint).trim()) {
      this.notifierService.throwNotification({
        type: "warning",
        message: "Work Item Type & Checkpoint Name are required."
      });
      return;
    }

    const editedArray = this.claimsData
      .filter(el => el.workCategory === this.unEditedWorkCategory)
      .shift()
      .checkList.map(item => {
        if (item === this.unEditedCheckpoint) {
          return this.checklistForm.get("checkpoint").value;
        } else {
          return item;
        }
      });
    const workCategory = this.checklistForm.get("type").value.name;
    const payload = {
      checkpoints: {
        [workCategory]: editedArray
      }
    };

    this.auditorService.editChecklist(payload).subscribe(res => {
      this.notifierService.throwNotification({
        type: "success",
        message: "Checkpoint successfully added!"
      });
      this.addChecklist = false;
      this.checklistForm.reset();
      const claimsData = this.getChecklistValue(res);
      this.claimsData = [];
      this.setChecklistData(res, claimsData);
    });
  }

  deleteChecklist(type) {
    const payload = {
      checkpoints: {
        [type]: this.selectedClaims[type]
      }
    };
    this.auditorService.removeChecklist(payload).subscribe(res => {
      this.notifierService.throwNotification({
        type: "warning",
        message: "Checkpoints successfully removed!"
      });
      const claimsData = this.getChecklistValue(res);
      this.claimsData = [];
      this.setChecklistData(res, claimsData);
      this.selectedClaims[type] = [];
    });
  }

  private getChecklistValue(res) {
    return res && res.checkpoints
      ? res.checkpoints
      : ClaimsChecklist.initialize();
  }

  editCheckList(unEditedCheckpoint, unEditedWorkCategory) {
    // Saving it for preparing edit request
    this.unEditedCheckpoint = unEditedCheckpoint;
    this.unEditedWorkCategory = unEditedWorkCategory;

    this.edit = true;
    this.checklistForm.patchValue({
      type:
        this.workCategoryList &&
        this.workCategoryList
          .filter(item => item.name === unEditedWorkCategory)
          .shift(),
      checkpoint: unEditedCheckpoint
    });
    this.addChecklist = true;
  }

  private setChecklistData(res: any, claimsData: any) {
    if (res.workCategoryEnabledOrDisabled) {
      this.workCategoryStatus = res.workCategoryEnabledOrDisabled;
    }
    if (Object.keys(claimsData).length) {
      Object.keys(claimsData).forEach(key => {
        this.claimsData.push({
          workCategory: key,
          checkList: claimsData[key]
        });
      });
    }
  }
}

class ClaimsChecklist {
  Reconciliation: any[];
  Workbasket: any[];
  Fallout: any[];
  "New Group Enrollment": any[];
  "Group Renewal": any[];
  "ID Card Request": any[];
  "Bulk Termination": any[];
  "Other Tickets": any[];

  constructor() {
    this.Reconciliation = [];
    this.Workbasket = [];
    this.Fallout = [];
    this["New Group Enrollment"] = [];
    this["Group Renewal"] = [];
    this["ID Card Request"] = [];
    this["Bulk Termination"] = [];
    this["Other Tickets"] = [];
  }

  public static initialize() {
    return new ClaimsChecklist();
  }
}
