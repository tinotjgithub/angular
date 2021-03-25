import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormArray
} from "@angular/forms";
import { ConfigurationService } from "src/app/services/configuration/configuration.service";
import { NotifierService } from "src/app/services/notifier.service";
import { DatePipe } from "@angular/common";
import { GlobalValidators } from "src/app/shared/validators";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html"
})
export class NotificationComponent implements OnInit, OnChanges {
  public notificationForm: FormGroup;

  public today = new Date();

  public tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
  public todayDate: string;
  public maintenanceDateFromMock;
  public maintenanceDateToMock;
  public emailTriggerDateMock;

  public users: string[] = [
    "ALL",
    "MANAGER",
    "CLAIMS LEAD",
    "CLAIMS AUDITOR",
    "CLAIMS EXAMINER",
    "ENROLLMENT SPECIALIST",
    "ENROLLMENT LEAD",
    "ENROLLMENT AUDITOR"
  ];

  @Output()
  public cancelProcess: EventEmitter<boolean> = new EventEmitter();

  @Input()
  public editNotification: any;
  @Input()
  public mode: any;
  public editMode: boolean;
  initialArray: any[];
  disableControl: boolean;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigurationService,
    private notifierService: NotifierService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.tomorrow.setHours(0, 0, 0, 0);
    this.setForm();
  }

  private setForm() {
    this.notificationForm = this.fb.group(
      {
        message: [
          "",
          [
            Validators.required,
            Validators.minLength(15),
            Validators.maxLength(256)
          ]
        ],
        scheduledDate: ["", [Validators.required]],
        scheduledDateTo: ["", [Validators.required]],
        emailTriggerDate: [""],
        emailTriggerTime: ["", []],
        users: this.fb.array([
          ...this.users.map(val => this.fb.control(false))
        ]),
        custom: ["", [GlobalValidators.customEmailValidation]],
        emailSub: [
          "",
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(32)
          ]
        ],
        customAdded: ["", [GlobalValidators.customEmailValidation]]
      },
      {
        validators: [
          this.atleastOne,
          this.invalidTriggerDate,
          this.invalidScheduledDate
        ]
      }
    );
  }

  ngOnChanges() {
    this.disableControl = this.mode === "cancel" || this.mode === "delete";
    if (this.editNotification) {
      this.editMode = true;
      this.notificationForm.patchValue({
        message: this.editNotification.maintenanceMessage,
        scheduledDate: new Date(this.editNotification.maintenanceFrom),
        scheduledDateTo: new Date(this.editNotification.maintenanceTo),
        emailTriggerDate: new Date(this.editNotification.emailTriggerDate),
        customAdded: this.editNotification.customRecipients,
        custom:
          this.mode === "cancel" ||
          (this.mode === "edit" && this.editNotification.emailTriggerDate < new Date())
            ? ""
            : this.editNotification.customRecipients,
        emailSub: this.editNotification.emailSubject
      });
      this.setValueForUserArray();
    } else {
      this.editMode = false;
    }
  }

  private atleastOne(form) {
    const formGroup = form as FormGroup;
    const checkValues: any[] = formGroup.value.users;
    const filteredArray = checkValues.filter(val => val);
    return filteredArray.length > 0
      ? null
      : formGroup.value.custom
      ? null
      : { atleastOne: true };
  }

  private invalidTriggerDate(c: AbstractControl) {
    if (
      new Date(c.get("emailTriggerDate").value).setHours(0, 0, 0, 0) >=
      new Date(c.get("scheduledDate").value).setHours(0, 0, 0, 0)
    ) {
      return { invalidTriggerDate: true };
    }
    return null;
  }

  private invalidScheduledDate(c: AbstractControl) {
    if (
      new Date(c.get("scheduledDate").value) >=
      new Date(c.get("scheduledDateTo").value)
    ) {
      return { invalidScheduledDate: true };
    }
    return null;
  }

  setPayload() {
    let users = [];
    this.getUsers.value.forEach((element, index) => {
      if (element) {
        users = [...users, this.users[index]];
      }
    });

    const formValue = this.notificationForm.value;
    if (
      this.getTimeFromDate(formValue.scheduledDate) &&
      this.getTimeOnly(formValue.scheduledDate)
    ) {
      this.maintenanceDateFromMock =
        this.getTimeFromDate(formValue.scheduledDate) +
        " " +
        this.getTimeOnly(formValue.scheduledDate);
    } else {
      this.maintenanceDateFromMock = null;
    }

    if (
      this.getTimeFromDate(formValue.scheduledDateTo) &&
      this.getTimeOnly(formValue.scheduledDateTo)
    ) {
      this.maintenanceDateToMock =
        this.getTimeFromDate(formValue.scheduledDateTo) +
        " " +
        this.getTimeOnly(formValue.scheduledDateTo);
    } else {
      this.maintenanceDateToMock = null;
    }

    if (
      this.getTimeFromDate(formValue.emailTriggerDate) &&
      this.getTimeOnly(formValue.emailTriggerDate)
    ) {
      this.emailTriggerDateMock =
        this.getTimeFromDate(formValue.emailTriggerDate) +
        " " +
        this.getTimeOnly(formValue.emailTriggerDate);
    } else {
      this.emailTriggerDateMock = null;
    }
    const payload = {
      id: this.editMode ? this.editNotification.id : null,
      emailSubject: formValue.emailSub,
      maintenanceMessage: formValue.message,
      maintenanceFrom: this.maintenanceDateFromMock,
      maintenanceTo: this.maintenanceDateToMock,
      recipients: users.indexOf("ALL") > -1 ? "ALL" : users.join(","),
      customRecipients:
        this.mode === "cancel"
          ? this.getCustomRecepients(formValue)
          : formValue.custom,
      emailTriggerDate: this.emailTriggerDateMock
    };
    return payload;
  }

  getCustomRecepients(formValue) {
    if (formValue.customAdded !== "" && formValue.custom !== "") {
      return formValue.custom.concat(";").concat(formValue.customAdded);
    } else if (formValue.customAdded !== "" && formValue.custom === "") {
      return formValue.customAdded;
    } else if (formValue.customAdded === "" && formValue.custom !== "") {
      return formValue.custom;
    } else {
      return "";
    }
  }
  sendNotification() {
    if (this.notificationForm.invalid) {
      return;
    }
    const payload = this.setPayload();
    this.configService.sendNotification(payload).subscribe(
      res => {
        this.notificationForm.reset();
        if (this.editMode) {
          this.cancelProcess.next(false);
        }
        this.notifierService.throwNotification({
          type: "success",
          message: "Notification saved successfully!!"
        });
        this.cancelProcess.next(false);        
      },
      err => {}
    );
  }

  deleteNotification() {
    const payload = this.setPayload();
    this.configService.deleteNotification(payload).subscribe(
      res => {
        this.notificationForm.reset();
        if (this.editMode) {
          this.cancelProcess.next(false);
        }
        this.notifierService.throwNotification({
          type: "success",
          message: "Notification has been Deleted!!"
        });
      },
      err => {}
    );
  }

  cancelNotification() {
    const payload = this.setPayload();
    this.configService.cancelNotification(payload).subscribe(
      res => {
        this.notificationForm.reset();
        if (this.editMode) {
          this.cancelProcess.next(false);
        }
        this.notifierService.throwNotification({
          type: "success",
          message: "Notification has been Cancelled!!"
        });
      },
      err => {}
    );
  }

  get getMessage() {
    return this.notificationForm.controls.message;
  }

  get getScheduledDate() {
    return this.notificationForm.controls.scheduledDate;
  }

  get getScheduledDateTo() {
    return this.notificationForm.controls.scheduledDateTo;
  }

  get getEmailTriggerTime() {
    return this.notificationForm.controls.emailTriggerTime;
  }

  get getUsers() {
    return this.notificationForm.controls.users;
  }

  get getCustom() {
    return this.notificationForm.controls.custom;
  }

  get getEmailSub() {
    return this.notificationForm.controls.emailSub;
  }

  get getEmailTriggerDate() {
    return this.notificationForm.controls.emailTriggerDate;
  }

  get emailTriggered() {
    return this.getEmailTriggerDate.value < new Date();
  }

  getTimeFromDate(date: Date, time?) {
    if (date) {
      return time
        ? this.datePipe.transform(date, "hh:mm a")
        : this.datePipe.transform(date, "MM/dd/yyyy");
    } else {
      return null;
    }
  }

  getTimeOnly(date: Date) {
    return this.datePipe.transform(date, "HH:mm");
  }

  sendNow() {
    if (this.notificationForm.invalid) {
      return;
    }
    let users = [];
    this.getUsers.value.forEach((element, index) => {
      if (element) {
        users = [...users, this.users[index]];
      }
    });
    const formValue = this.notificationForm.value;

    if (
      this.getTimeFromDate(formValue.scheduledDate) &&
      this.getTimeOnly(formValue.scheduledDate)
    ) {
      this.maintenanceDateFromMock =
        this.getTimeFromDate(formValue.scheduledDate) +
        " " +
        this.getTimeOnly(formValue.scheduledDate);
    } else {
      this.maintenanceDateFromMock = null;
    }

    if (
      this.getTimeFromDate(formValue.scheduledDateTo) &&
      this.getTimeOnly(formValue.scheduledDateTo)
    ) {
      this.maintenanceDateToMock =
        this.getTimeFromDate(formValue.scheduledDateTo) +
        " " +
        this.getTimeOnly(formValue.scheduledDateTo);
    } else {
      this.maintenanceDateToMock = null;
    }

    if (
      this.getTimeFromDate(formValue.emailTriggerDate) &&
      this.getTimeOnly(formValue.emailTriggerDate)
    ) {
      this.emailTriggerDateMock =
        this.getTimeFromDate(formValue.emailTriggerDate) +
        " " +
        this.getTimeOnly(formValue.emailTriggerDate);
    } else {
      this.emailTriggerDateMock = null;
    }

    const payload = {
      id: this.editMode ? this.editNotification.id : null,
      emailSubject: formValue.emailSub,
      maintenanceMessage: formValue.message,
      maintenanceFrom: this.maintenanceDateFromMock,
      maintenanceTo: this.maintenanceDateToMock,
      recipients: users.indexOf("ALL") > -1 ? "ALL" : users.join(","),
      customRecipients: formValue.custom,
      emailTriggerDate: this.emailTriggerDateMock
    };
    this.configService.sendNow(payload).subscribe(
      res => {
        this.notificationForm.reset();
        if (this.editMode) {
          this.cancelProcess.next(false);
        }
        this.notifierService.throwNotification({
          type: "success",
          message: "Notification send successfully!"
        });
        this.cancelProcess.next(false);        
      },
      err => {}
    );
  }

  cancel() {
    this.cancelProcess.next(false);
  }

  clearForm() {
    this.setForm();
  }

  setInitialArray(valueArray) {
    const array = [];
    this.users.forEach(el => {
      array.push(valueArray.includes(el.trimLeft().trimRight()));
    });
    this.initialArray = array;
  }

  setValueForUserArray() {
    const valueArray = (this.editNotification.recipients
      ? String(this.editNotification.recipients).split(",")
      : []
    ).map(el => {
      return el.trim();
    });
    this.setInitialArray(valueArray);
    valueArray.forEach((e: string) => {
      const index = this.users.indexOf(e.trim());
      if (index > -1) {
        (this.notificationForm.controls.users as FormArray).controls[
          index
        ].setValue(true);
      }
    });
  }
}
