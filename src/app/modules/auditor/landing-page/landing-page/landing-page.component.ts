import { Component, OnInit, HostListener } from "@angular/core";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { InventoryStatus } from "../../model/auditor.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "src/app/services/notifier.service";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { Router } from "@angular/router";
import { actions } from "src/app/shared/constants.js";

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html"
})
export class LandingPageComponent implements OnInit {
  public claimSourceData: any = [["NO DATA", 0, "", "0"]];
  public claimTypeData: any = [["NO DATA", 0, "", "0"]];
  public claimStatusData: any = [["NO DATA", 0, "", "0"]];
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
  public today = new Date();
  public yesterday = new Date(new Date().setDate(this.today.getDate() - 1));

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
    colors: ["#c5b200", "#4cc14f", "#ff5c5d", "#2c68a6", "#686868"],
    hAxis: {
      format: "0",
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

  public queueSummary: any;
  public auditStatus: any;
  public inventoryStatus: InventoryStatus;
  public samplingForm: FormGroup;
  public claimCountDetails: any;
  public rebuttalStatus: any;
  public actionLinks: any[] = [];
  claimCountLoading: boolean;

  constructor(
    private auditorService: AuditorService,
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private router: Router,
    private taskMgtService: TaskmanagementService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.initiateform();
    this.getQueueSummary();
    this.getAuditStatus();
    this.getRebuttalStatus();
    this.getClaimCount();
    // this.getClaimsInventoryStatus();
    actions["Claims Auditor"].forEach(e => {
      console.log(e);
      if (e && e.links) {
        e.links.forEach(f => {
          this.actionLinks = [...this.actionLinks, ...f.items];
        });
      }
    });
  }

  @HostListener("window:resize", ["$event"])
  // onWindowResize(event: any) {
  // this.chart1.ngOnChanges();
  // this.chart2.ngOnChanges();
  // this.chart3.ngOnChanges();
  // this.chart4.ngOnChanges();
  // this.chart1.wrapper.draw(this.chart1.getChartElement());
  // this.chart2.wrapper.draw(this.chart2.getChartElement());
  // this.chart3.wrapper.draw(this.chart3.getChartElement());
  // }
  private initiateform() {
    this.samplingForm = this.fb.group({
      from: [this.yesterday, [Validators.required]],
      to: [this.yesterday, [Validators.required]]
    });
  }

  getQueueSummary() {
    this.auditorService.getQueueSummary().subscribe(res => {
      this.queueSummary = res;
    });
  }

  getAuditStatus() {
    this.auditorService.getAuditStatus().subscribe(res => {
      this.auditStatus = res;
    });
  }

  getRebuttalStatus() {
    this.auditorService.getRebuttalCounts().subscribe(res => {
      this.rebuttalStatus = res;
    });
  }

  getClaimsInventoryStatus() {
    this.auditorService.getProcessedClaimsInventoryStatus().subscribe(
      res => {
        this.inventoryStatus = res;
        this.processGraph();
      },
      err => {
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
              "#c5b200",
              claimSource.Paper || 0
            ],
            ["EDI", claimSource.EDI || 0, "#4cc14f", claimSource.EDI || 0]
          ]
        : [["NO DATA", 0, "", "0"]];
      this.claimTypeData = claimType
        ? [
            [
              "PROF",
              claimType.Professional || 0,
              "#c5b200",
              claimType.Professional || 0
            ],
            [
              "INST (IP)",
              claimType["Institutional-IP"] || 0,
              "#4cc14f",
              claimType["Institutional-IP"] || 0
            ],
            [
              "INST (OP)",
              claimType["Institutional-OP"] || 0,
              "#4cc14f",
              claimType["Institutional-OP"] || 0
            ],
            ["Others", claimType.Others || 0, "#2c68a6", claimType.Others || 0]
          ]
        : [["NO DATA", 0, "", "0"]];
      this.claimStatusData = claimDecision
        ? [
            [
              "Paid",
              claimDecision.Paid || 0,
              "#c5b200",
              claimDecision.Paid || 0
            ],
            [
              "Deny",
              claimDecision.Deny || 0,
              "#4cc14f",
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
      criteriaType: "MANUAL",
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
      criteriaType: "MANUAL",
      processedFromDate: this.getFormattedDate(formValue.from, "00:00:00"),
      processedToDate: this.getFormattedDate(formValue.to, "23:59:59"),
      sampleCountDto: this.claimCountDetails
    };
    this.auditorService.addClaimCountDetails(payload).subscribe(res => {
      this.notifierService.throwNotification({
        type: "success",
        message: "Addition to queue is successful"
      });
      this.initiateform();
      this.getQueueSummary();
      this.claimCountDetails = null;
    });
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

  navigateToSummaryQueue(type: string) {
    if (type === "backlog" && this.queueSummary.backlog > 0) {
      this.router.navigateByUrl("/auditor/queue-summary?type=backlog");
      return;
    } else if (type === "rebuttal" && this.queueSummary.rebuttalQueue > 0) {
      this.router.navigateByUrl("/auditor/queue-rebuttal");
      return;
    }
    return;
  }
}
