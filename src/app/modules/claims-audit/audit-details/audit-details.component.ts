import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleChartComponent } from 'angular-google-charts';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { InventoryStatus } from '../../auditor/model/auditor.model';
import { AuditorService } from 'src/app/services/auditor/auditor.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';

@Component({
  selector: "app-audit-details",
  templateUrl: "./audit-details.component.html"
})
export class AuditDetailsComponent implements OnInit {
  public claimSourceData: any = [["NO DATA", 0, "", "0"]];
  public claimTypeData: any = [["NO DATA", 0, "", "0"]];
  public claimStatusData: any = [["NO DATA", 0, "", "0"]];
  @ViewChild("chart1", { static: false })
  chart1: GoogleChartComponent;
  @ViewChild("chart2", { static: false })
  chart2: GoogleChartComponent;
  @ViewChild("chart3", { static: false })
  chart3: GoogleChartComponent;

  public claimSourceColumnNames = [
    "Type",
    "Count",
    { role: "style" },
    { role: "annotation" }
  ];
  public claimTypeColumnNames = [
    "Type",
    "Count",
    { role: "style" },
    { role: "annotation" }
  ];
  public claimStatusColumnNames = [
    "Type",
    "Count",
    { role: "style" },
    { role: "annotation" }
  ];
  public auditorColumnNames = ["Name", "Count", { role: "annotation" }];
  public today = new Date();
  public yesterday = new Date(new Date().setDate(this.today.getDate() - 1));
  public queueSummary: any;
  public auditStatus: any;
  public inventoryStatus: InventoryStatus;
  public samplingForm: FormGroup;
  public claimCountDetails: any;
  public currentRole: string;
  public auditorHeight = 195;

  public optionsAgeEnlarged = {
    bar: { width: "65%" },
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    // colors: ["#c5b200", "#4cc14f", "#ff5c5d", "#2c68a6", "#686868"],
    hAxis: {
      title: "Count",
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      title: "",
      format: "0",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    legend: {
      position: "none"
    },
    chartArea: {
      left: 60
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
  };
  public inventoryLoading: boolean;
  public auditorCountData = [["NO-DATA", 0, "0"]];

  public optionsAuditor = {
    bar: { width: "65%" },
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    colors: ["#2c68a6"],
    hAxis: {
      title: "Count",
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      title: "Auditor Name",
      format: "0",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: "black",
        fontSize: 11,
        textPosition: "Horizontal"
      }
    },
    legend: {
      position: "none"
    },
    chartArea: {
      left: 90,
      top: 15,
      bottom: 50
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
  };
  claimCountLoading: boolean;
  addingToClaim: boolean;

  constructor(
    private fb: FormBuilder,
    private auditorService: AuditorService,
    private notifierService: NotifierService,
    private secureLocalStorage: CryptoService
  ) { }

  ngOnInit() {
    this.initiateform();
    this.currentRole = this.secureLocalStorage.getItem('roleId');
    this.getQueueSummary();
    this.getAuditStatus();
    this.getClaimsInventoryStatus();
    // this.getAuditorCounts();
  }

  private initiateform() {
    this.samplingForm = this.fb.group({
      from: [this.yesterday, [Validators.required]],
      to: [this.yesterday, [Validators.required]],
      criteriaType: ["", [Validators.required]]
    });
    this.samplingForm.valueChanges.subscribe(val => {
      if (this.samplingForm.valid) {
        this.getClaimCount();
      }
    });
  }

  getQueueSummary() {
    this.auditorService
      .getQueueSummaryLeadManager(this.currentRole)
      .subscribe(res => {
        this.queueSummary = res;
      });
  }

  getAuditStatus() {
    this.auditorService.getAuditStatusLeadManager().subscribe(res => {
      this.auditStatus = res;
    });
  }

  getClaimsInventoryStatus() {
    this.inventoryLoading = true;
    this.auditorService
      .getProcessedClaimsInventoryStatusLeadManager()
      .subscribe(
        res => {
          this.inventoryLoading = false;
          this.inventoryStatus = res;
          this.processGraph();
        },
        err => {
          this.inventoryLoading = false;
          this.graphNoData();
        }
      );
  }
  processGraph() {
    if (this.inventoryStatus) {
      const { claimSource, claimType, claimDecision } = this.inventoryStatus;
      this.claimSourceData = claimSource
        ? [
            [
              "Paper",
              claimSource.Paper || 0,
              "#f25eb0",
              claimSource.Paper || 0
            ],
            ["EDI", claimSource.EDI || 0, "#2b5381", claimSource.EDI || 0]
          ]
        : [["NO DATA", 0, "", "0"]];
      this.claimTypeData = claimType
        ? [
            [
              "PROF",
              claimType.Professional || 0,
              "#ff9226",
              claimType.Professional || 0
            ],
            [
              "INST (IP)",
              claimType["Institutional-IP"] || 0,
              "#017ecf",
              claimType["Institutional-IP"] || 0
            ],
            [
              "INST (OP)",
              claimType["Institutional-OP"] || 0,
              "#cc3f6c",
              claimType["Institutional-OP"] || 0
            ],
            ["Others", claimType.Others || 0, "#565454", claimType.Others || 0]
          ]
        : [["NO DATA", 0, "", "0"]];
      this.claimStatusData = claimDecision
        ? [
            [
              "Paid",
              claimDecision.Paid || 0,
              "#92b514",
              claimDecision.Paid || 0
            ],
            [
              "Deny",
              claimDecision.Deny || 0,
              "#ff3624",
              claimDecision.Deny || 0
            ]
          ]
        : [["NO DATA", 0, "", "0"]];
    } else {
      this.graphNoData();
    }
  }

  getClaimCount() {
    if (this.samplingForm.invalid) {
      return;
    }
    const formValue = this.samplingForm.value;
    const payload = {
      criteriaType: formValue.criteriaType,
      processedFromDate: this.getFormattedDate(formValue.from, "00:00:00"),
      processedToDate: this.getFormattedDate(formValue.to, "23:59:59")
    };
    this.claimCountLoading = true;
    this.auditorService.getClaimCountDetails(payload).subscribe(
      res => {
        this.claimCountDetails = res;
        this.claimCountLoading = false;
      },
      err => {
        this.claimCountDetails = null;
        this.claimCountLoading = false;
      }
    );
  }

  addTolaimsQueue() {
    if (this.samplingForm.invalid || !this.claimCountDetails) {
      return;
    }
    const formValue = this.samplingForm.value;
    const payload = {
      criteriaType: formValue.criteriaType,
      processedFromDate: this.getFormattedDate(formValue.from, "00:00:00"),
      processedToDate: this.getFormattedDate(formValue.to, "23:59:59"),
      sampleCountDto: this.claimCountDetails
    };
    this.addingToClaim = true;
    this.auditorService.addClaimCountDetails(payload).subscribe(
      res => {
        this.notifierService.throwNotification({
          type: "success",
          message: "Addition to queue is successful"
        });
        this.initiateform();
        this.getQueueSummary();
        this.claimCountDetails = null;
        this.addingToClaim = false;
      },
      err => {
        this.addingToClaim = false;
      }
    );
  }

  private graphNoData() {
    this.claimSourceData = [["NO DATA", 0, "", "0"]];
    this.claimTypeData = [["NO DATA", 0, "", "0"]];
    this.claimStatusData = [["NO DATA", 0, "", "0"]];
  }

  getFormattedDate(date, suffix) {
    const year = new Date(date).getFullYear();
    const month = (1 + new Date(date).getMonth()).toString().padStart(2, "0");
    const day = new Date(date)
      .getDate()
      .toString()
      .padStart(2, "0");
    return year + "-" + month + "-" + day + " " + suffix;
  }

  // getAuditorCounts() {
  //   this.auditorService.getAuditorCounts().subscribe(res => {
  //     this.auditorCountData = res
  //       ? this.processAuditorGraph(res)
  //       : [["NO DATA", 0, "0"]];
  //   });
  // }

  private processAuditorGraph(res) {
    const auditors = [];
    const keys = Object.keys(res);
    this.auditorHeight = keys.length > 4 ? keys.length * 45 : 195;
    keys.forEach(e => {
      auditors.push([e, res[e], String(res[e])]);
    });
    return auditors;
  }
}
