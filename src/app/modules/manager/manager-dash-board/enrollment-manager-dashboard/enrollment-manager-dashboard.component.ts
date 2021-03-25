import { Component, OnInit } from "@angular/core";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
@Component({
  selector: "app-enrollment-manager-dashboard",
  templateUrl: "./enrollment-manager-dashboard.component.html",
  styleUrls: ["./enrollment-manager-dashboard.component.css"]
})
export class EnrollmentManagerDashboardComponent implements OnInit {
  constructor(public datePipe: DatePipe) {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
