import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-enrollment-audit-landing-page",
  templateUrl: "./enrollment-audit-landing-page.component.html",
  styleUrls: ["./enrollment-audit-landing-page.component.css"]
})
export class EnrollmentAuditLandingPageComponent implements OnInit {
  public samplingForm: FormGroup;
  public today = new Date();
  public yesterday = new Date(new Date().setDate(this.today.getDate() - 1));
  public claimCountDetails: any;
  claimCountLoading = false;
  addingToClaim = false;
  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initiateform();
  }

  private initiateform() {
    this.samplingForm = this.fb.group({
      from: [this.yesterday, [Validators.required]],
      to: [this.yesterday, [Validators.required]],
      criteriaType: []
    });
  }

  displayWorkCategory(workCategory) {
    return true;
  }

  addTolaimsQueue() {}
}
