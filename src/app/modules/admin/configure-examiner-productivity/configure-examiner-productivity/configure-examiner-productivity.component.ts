import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { NotifierService } from "src/app/services/notifier.service";
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { EnrollmentManagementService } from 'src/app/services/enrollment-management/enrollment-management.service';

@Component({
  selector: "app-configure-examiner-productivity",
  templateUrl: "./configure-examiner-productivity.component.html",
  styleUrls: ["./configure-examiner-productivity.component.css"]
})
export class ConfigureExaminerProductivityComponent implements OnInit {
  formGroup: FormGroup;
  public isEnrollment: boolean;
  constructor(
    private fromBuilder: FormBuilder,
    private userManagementService: UserManagementService,
    private notifierService: NotifierService,
    private activatedRoute: ActivatedRoute,
    private enrollmentService: EnrollmentManagementService
  ) {
    this.formGroup = this.fromBuilder.group({
      routedOutStatus: ["", [Validators.required]]
    });
  }

  ngOnInit() {
    this.isEnrollment = this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.enrollment;
    this.initializeForm();
  }

  private initializeForm() {
    (this.isEnrollment ? this.enrollmentService : this.userManagementService)
      .getExaminerProductivitiyConfig()
      .subscribe(res => {
        if (
          res.routedOutStatus &&
          res.routedOutStatus !== null &&
          res.routedOutStatus !== undefined
        ) {
          this.getFormControl("routedOutStatus").setValue(res.routedOutStatus);
        }
      });
  }

  getFormControl(controlName) {
    return this.formGroup.get(controlName);
  }
  submit() {
    const  routedOutStatus = this.getFormControl("routedOutStatus").value;
    const payload = {  routedOutStatus };
    (this.isEnrollment ? this.enrollmentService : this.userManagementService)
      .ExaminerProductivitiyConfig(payload)
      .subscribe(res => {
        this.initializeForm();
        this.notifierService.throwNotification({
          type: "success",
          message: "Examiner Productivity Configured Successfully."
        });
      }, err => {
        this.getFormControl("routedOutStatus").setValue(!routedOutStatus);
      });
  }
}
