import { Component, OnInit, ViewChild } from "@angular/core";
import { GoogleChartComponent } from "angular-google-charts";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { NotifierService } from "src/app/services/notifier.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";

@Component({
  selector: "app-enrollment-audit",
  templateUrl: "./enrollment-audit.component.html",
  styleUrls: ["./enrollment-audit.component.css"]
})
export class EnrollmentAuditComponent implements OnInit {
  public auditorColumnNames = ["Name", "Count", { role: "annotation" }];
  public today = new Date();
  public yesterday = new Date(new Date().setDate(this.today.getDate() - 1));
  public queueSummary: any;
  public auditStatus: any;
  public samplingForm: FormGroup;
  public claimCountDetails: any;
  public currentRole: string;
  public auditorHeight = 195;
  public inventoryLoading: boolean;
  public auditorCountData = [["NO-DATA", 0, "0"]];
  claimCountLoading: boolean;
  addingToClaim: boolean;
  
  constructor(
    private fb: FormBuilder,
    private auditorService: AuditorService,
    private notifierService: NotifierService,
    private secureLocalStorage: CryptoService
  ) {}

  ngOnInit() {
    this.initiateform();
  }

  private initiateform() {
    this.samplingForm = this.fb.group({
      from: [this.yesterday, [Validators.required]],
      to: [this.yesterday, [Validators.required]],
      criteriaType: ["", [Validators.required]]
    });
    this.samplingForm.valueChanges.subscribe(val => {
      if (this.samplingForm.valid) {
      }
    });
  }
}
