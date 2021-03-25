import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalValidators } from "src/app/shared/validators";
import { NotifierService } from "src/app/services/notifier.service";
import { ReviewService } from "src/app/services/review/review.service";
import { FILE_POSITION } from "./../../../../auditor/model/auditor.model";
import { TemplateConfigurationService } from "./../template-configuration.service";
import { ConfirmationService } from "primeng/api";
import { duplicatePendList } from "src/app/mocks/mock-data";

@Component({
  selector: "app-create-template-configuration",
  templateUrl: "./create-template-configuration.component.html",
  styleUrls: ["./create-template-configuration.component.css"],
  providers: [ConfirmationService]
})
export class CreateTemplateConfigurationComponent implements OnInit, OnChanges {
  public userForm: FormGroup;
  public disableUpload = false;
  public isUploadedFile = false;
  public editUser: any;
  public fileValue: any;
  public input: Array<any> = new Array(1);
  public editMode: boolean;
  public submitFailMessage: any;
  public failed: boolean;
  public filterType: string;
  public typeList: any[] = [];
  public workCategoryList: any[] = [];
  public filteredUserList: any[];
  public filterValue: string;
  public userList: any[];
  public attachmentTab = "addAttachment";
  public today = new Date();
  public manArray: any[] = [];
  public valid = true;
  public fileId = "";
  public mandatoryHeaders: any[] = [];
  public fieldsFromFile: any[] = [];
  public workCategoryArray = [];
  public mapToFields: any[] = [];
  constructor(
    private fb: FormBuilder,
    private templateConfigurationService: TemplateConfigurationService,
    private messageService: MessageService,
    private notifierServices: NotifierService,
    private reviewService: ReviewService,
    private confirmationService: ConfirmationService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      workCategory: ["", [Validators.required]],
      existingTemplate: [{}]
    });
  }

  ngOnInit() {
    this.getWorkCategory();
    this.userForm.controls.existingTemplate.setErrors(null);
    this.userForm.updateValueAndValidity();

    this.activateRoute.queryParams.subscribe(params => {
      if (params.editUser) {
        const edt = JSON.parse(params.editUser);
        this.editUser = edt.user;
        this.fileValue = params.fileValue;
      } else {
        this.workCategoryArray = [];
        const users = params.addUser;
        this.workCategoryArray = users;
      }
    });
    this.editMode = this.editUser ? true : false;

    if (this.editUser) {
      this.getEditDetails();
    }
    this.userForm.controls.existingTemplate.valueChanges.subscribe(val => {
      if (val) {
        let vals = [];
        vals.push(Object.values(val));
        let keys = [];
        keys.push(Object.keys(val));
        vals[0].forEach((e, i) => {
          if (!e || e === null) {
            const k = keys[0][i];
            delete val[k];
          }
        });
      }
    });
  }

  ngOnChanges(change) {
    if (this.editUser) {
      this.getEditDetails();
    } else {
      this.editMode = false;
    }
  }

  getMapping() {
    let vals = [];
    vals.push(Object.values(this.editUser.existingTemplate));
    let keys = [];
    keys.push(Object.keys(this.editUser.existingTemplate));
    keys[0].map(el => {
      if (!this.fieldsFromFile.includes(el)) {
        this.fieldsFromFile.push(el);
      }
    });
    vals[0].map(el => {
      if (!this.mapToFields.includes(el)) {
        this.mapToFields.push(el);
      }
    });
  }

  getEditDetails() {
    this.fieldsFromFile = this.editUser.fileHeaders || [];
    this.mapToFields = this.editUser.systemHeaders || [];
    this.userForm.patchValue({
      workCategory: this.editUser.workCategory || "",
      fileId: this.editUser.fileId || "",
      existingTemplate: this.editUser.existingTemplate
        ? { ...this.editUser.existingTemplate }
        : {}
    });
    this.mandatoryHeaders = this.editUser.mandatoryHeaders
      ? [...this.editUser.mandatoryHeaders]
      : [];

    this.getMapping();

    if (this.editMode) {
      const file = [];
      this.fileId = this.editUser.fileId || "";
      file.push({
        fileName: this.editUser.fileName,
        fileId: this.editUser.fileId
      });
      this.fileValue = file;
    }
    this.isUploadedFile = true;
    if (this.fileValue) {
      this.input = this.fileValue.length > 0 ? this.fileValue : [""];
    }
  }
  mapUpload() {
    if (this.editUser) {
      let vals = [];
      vals.push(Object.values(this.editUser.existingTemplate));
      let keys = [];
      keys.push(Object.keys(this.editUser.existingTemplate));
      keys[0].map(el => {
        if (!this.fieldsFromFile.includes(el)) {
          this.fieldsFromFile.push(el);
        }
      });
      vals[0].map(el => {
        if (!this.mapToFields.includes(el)) {
          this.mapToFields.push(el);
        }
      });
    }
  }

  getWorkCategory() {
    this.workCategoryList = [];
    this.templateConfigurationService.getWorkCategory().subscribe(res => {
      if (res) {
        res.map(r => {
          this.workCategoryList.push(r);
        });
      }
    });
  }

  public fileupload() {
    this.fieldsFromFile = [];
    this.mapToFields = [];
    const formData = new FormData();
    if (this.editMode && this.input.length > 0) {
      this.isUploadedFile = true;
      this.templateConfigurationService
        .uploadFileCreate(this.fileValue)
        .subscribe(res => {
          if (res) {
            this.fieldsFromFile = res.fileHeaders || [];
            this.mapToFields = res.systemHeaders || [];
            this.userForm.controls.existingTemplate.setValue({});
            this.fileId = res.fileId ? (this.fileId = res.fileId) : "";
            this.mandatoryHeaders = res.mandatoryHeaders
              ? [...res.mandatoryHeaders]
              : [];
            this.mapUpload();
          }
        });
    } else if (
      this.input.length > 0 &&
      this.input.filter(e => e && e.local).length > 0
    ) {
      this.isUploadedFile = true;
      this.input.forEach((val, i) => {
        if (val && val.local) {
          formData.append(FILE_POSITION[String(i + 1)], val.value, val.name);
        }
      });
      this.fieldsFromFile = [];
      this.mapToFields = [];
      this.templateConfigurationService
        .uploadFileCreate(formData)
        .subscribe(res => {
          if (res) {
            this.fieldsFromFile = res.fileHeaders || [];
            this.mapToFields = res.systemHeaders || [];
            this.userForm.controls.existingTemplate.setValue({});
            this.fileId = res.fileId ? (this.fileId = res.fileId) : "";
            this.mandatoryHeaders = res.mandatoryHeaders
              ? [...res.mandatoryHeaders]
              : [];
          }
          this.mapUpload();
        });
    }
  }

  changedFile() {
    if (!this.editMode) {
      this.mapToFields = [];
      this.fieldsFromFile = [];
      if (
        this.input.length > 0 &&
        this.input.filter(e => e && e.local).length > 0
      ) {
        this.isUploadedFile = true;
      } else {
        this.isUploadedFile = false;
      }
    } else {
      this.isUploadedFile = true;
    }
  }

  updateTemplate(payload) {
    this.templateConfigurationService.updateTemplate(payload).subscribe(
      () => {
        this.failed = false;
        this.messageService.add({
          key: "successKey",
          severity: "success",
          detail: "Template updated successfully!!",
          summary: "SUCCESS"
        });
        // this.updateSuccess.emit(true);
        this.router.navigateByUrl("template-configuration");
      },
      err => {
        this.failed = true;
        if (err.error && err.error.message && err.error.message !== "") {
          this.submitFailMessage = err.error.message;
        } else {
          this.submitFailMessage = "Template updation failed please try again.";
        }
        this.router.navigateByUrl("template-configuration");
      }
    );
  }

  cancelChanges() {
    this.confirmationService.confirm({
      message: "Do you want to cancel the changes?",
      accept: () => {
        this.resetData();
        this.router.navigateByUrl("template-configuration");
      }
    });
  }

  createTemplate(payload) {
    this.templateConfigurationService.createTemplate(payload).subscribe(
      () => {
        this.failed = false;
        this.messageService.add({
          key: "successKey",
          severity: "success",
          detail: "Template created successfully!!",
          summary: "SUCCESS"
        });
        this.router.navigateByUrl("template-configuration");
      },
      err => {
        this.failed = true;
        if (err.error && err.error.message && err.error.message !== "") {
          this.submitFailMessage = err.error.message;
        } else {
          this.submitFailMessage = "Template creation failed please try again.";
        }
        this.router.navigateByUrl("template-configuration");
      }
    );
  }

  submit(payload) {
    this.failed = false;
    if (this.userForm.invalid || !this.isUploadedFile) {
      return;
    }
    if (this.editMode) {
      this.updateTemplate(payload);
    } else {
      this.createTemplate(payload);
    }
  }

  checkDuplicateWorkCategory(selectedValue) {
    let duplicate = false;
    if (this.workCategoryArray.length > 0) {
      duplicate = this.workCategoryArray.includes(selectedValue);
    }
    return duplicate;
  }

  filterChange(e) {
    const selectedValue = e.target.value;
    this.userForm.get("workCategory").setValue(selectedValue);
    if (!this.checkDuplicateWorkCategory(selectedValue)) {
      this.disableUpload = false;
      this.userForm.get("workCategory").setValue(selectedValue);
    } else {
      this.disableUpload = true;
      this.messageService.add({
        key: "errorKey",
        severity: "error",
        detail: "Selected work category already exists!!",
        summary: "Error"
      });
      this.userForm.get("workCategory").setValue("");
    }
  }
  downloadAttachment(fileInfo) {
    if (fileInfo) {
      this.templateConfigurationService
        .downloadAttachment(fileInfo.fileId)
        .subscribe(res => {
          const responseBody = res.body;
          const blob = new Blob([responseBody]);
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, fileInfo.fileName);
          } else {
            const link = document.createElement("a");
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", fileInfo.fileName);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }
        });
    }
  }
  saveFile() {
    const formData = new FormData();
    const formValue = this.userForm.value;
    this.valid = true;
    this.userForm.controls.existingTemplate.setErrors(null);
    this.userForm.updateValueAndValidity();
    if (this.mandatoryHeaders.length > 0 && formValue.existingTemplate !== {}) {
      this.manArray = [];
      const arr = [];
      arr.push(Object.values(formValue.existingTemplate));
      this.mandatoryHeaders.map(e => {
        if (!arr[0].includes(e)) {
          this.manArray.push(e);
          this.valid = false;
          this.userForm.controls.existingTemplate.setErrors({
            req: true
          });
          this.userForm.updateValueAndValidity();
        }
      });
    }
    if (!this.valid) {
      return;
    } else {
      const fileHeaders = [];
      const systemHeaders = [];
      fileHeaders.push(this.fieldsFromFile.filter(e => e !== '$inputNew'));
      systemHeaders.push(this.mapToFields);
      let vals = [];

      vals.push(Object.values(formValue.existingTemplate));
      let keys = [];
      keys.push(Object.keys(formValue.existingTemplate));
      const filHeadersArray = [];
      const syseHeadersArray = [];
      fileHeaders[0].map(el => {
        if (!keys[0].includes(el)) {
          filHeadersArray.push(el);
        }
      });

      systemHeaders[0].map(el => {
        if (!vals[0].includes(el)) {
          syseHeadersArray.push(el);
        }
      });
      let payload = {};
      if (this.editMode) {
        payload = {
          workCategory: formValue.workCategory,
          existingTemplate: formValue.existingTemplate,
          fileId: this.fileId,
          file: this.input,
          fileHeaders: filHeadersArray,
          systemHeaders: syseHeadersArray,
          mandatoryHeaders: this.mandatoryHeaders,
          id: this.editUser.id
        };
      } else {
        if (
          !this.input ||
          this.input === null ||
          this.input[0] === null ||
          this.input[0] === ""
        ) {
          this.isUploadedFile = false;
          return;
        } else {
          payload = {
            workCategory: formValue.workCategory,
            existingTemplate: formValue.existingTemplate,
            fileId: this.fileId,
            file: this.input,
            fileHeaders: filHeadersArray,
            systemHeaders: syseHeadersArray,
            mandatoryHeaders: this.mandatoryHeaders
          };
        }
      }
      this.confirmationService.confirm({
        message: "Do you want to save the changes?",
        accept: () => {
          this.submit(payload);
          this.resetData();
        }
      });
    }
  }

  resetData() {
    this.userForm.reset();
    this.input = [""];
    this.isUploadedFile = true;
    this.attachmentTab = "addAttachment";
    this.mapToFields = [];
    this.fieldsFromFile = [];
  }

  getControl(controlName: string) {
    return this.userForm.get(controlName);
  }

  clearForm() {
    this.userForm.reset();
    this.userList = [];
    this.mapToFields = [];
    this.fieldsFromFile = [];
  }

  isFileUploaded() {
    let isUpload = false;
    if (this.input.length > 0) {
      if (
        this.input.filter &&
        this.input.filter(e => e && e.local).length > 0
      ) {
        isUpload = this.input.filter(e => e && e.fileName).length > 0;
      } else {
        isUpload = true;
      }
    }
    return isUpload;
  }
}
