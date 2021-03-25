import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { EnrollmentAuditorService } from '../../services/enrollment-auditor.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.css"]
})
export class LandingPageComponent implements OnInit {
  public samplingForm: FormGroup;
  public today = new Date();
  public yesterday = new Date(new Date().setDate(this.today.getDate() - 1));
  claimCountLoading: boolean;
  claimCountDetails: any;
  public pieColor = [];
  public color = [
    "#003f5c",
    "#665191",
    "#a05195",
    "#d45087",
    "#ff6460",
    "#f95d6a",
    "#ff7c43",
    "#ffa600"
  ];
  public optionsStatus = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 15,
      bottom: 1
    },
    colors: this.color,
    pieSliceText: "value",
    tooltip: {
      text: "value",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      position: "none"
    },
    pieHole: 0.25
  };
  public typeStatus = "PieChart";
  public columnNamesStatus = ["requestType", "requestCount"];
  public assignedData = [];
  public backlogData = [];
  public auditPassedData = [];
  public auditFailedData = [];
  public reviewData = [];
  public view: string;
  public teamRebuttalReviewStatus = [];
  public teamDataAuditFailedStatus = [];
  public teamDataAssignedStatus = [];
  public teamDataAuditPasedStatus = [];
  public teamDataBacklogStatus = [];
  public myStatus: any[];
  public chartKeys = {
    "Assigned": 'teamDataAssignedStatus',
    "Backlog": 'teamDataBacklogStatus',
    "Rebuttal/Review": 'teamRebuttalReviewStatus',
    "Today's Audit Passed": 'teamDataAuditPasedStatus',
    "Today's Audit Failed": 'teamDataAuditFailedStatus'
  };
  public totalData = {
    "Assigned": 0,
    "Backlog": 0,
    "Rebuttal/Review": 0,
    "Today's Audit Passed": 0,
    "Today's Audit Failed": 0
  };
  public cardColor = {
    "Assigned": 'blue',
    "Backlog": 'grey',
    "Rebuttal/Review": 'purple',
    "Today's Audit Passed": 'green',
    "Today's Audit Failed": 'red'
  };
  totalConfiguredItems: any;

  constructor(
    private fb: FormBuilder,
    private auditorService: EnrollmentAuditorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.samplingForm = this.fb.group({
      from: [this.yesterday, [Validators.required]],
      to: [this.yesterday, [Validators.required]],
      criteriaType: ["", [Validators.required]]
    });
    this.totalConfiguredItems = [];
    this.auditorService.getTotalConfiguredItems().subscribe(res => {
      if (res) {
        this.totalConfiguredItems = res;
        this.setLegend();
      }
    });
    this.getStatusCount();
    this.view = "tile";
    this.samplingForm.valueChanges.subscribe(val => {
      if (this.samplingForm.valid) {
        this.getClaimCount();
      }
    });
  }

  setLegend() {
    this.pieColor = [];
    this.color.forEach(clr => {
      this.pieColor.push(clr);
    });
    this.optionsStatus.colors = this.pieColor;
  }

  getStatusCount() {
    this.myStatus = [];
    this.auditorService.getLandingPageCount().subscribe(res => {
      this.myStatus = res || [];
      this.processDataForGraph(this.myStatus);
    })
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

  getFormattedDate(date, suffix) {
    const year = new Date(date).getFullYear();
    const month = (1 + new Date(date).getMonth()).toString().padStart(2, "0");
    const day = new Date(date)
      .getDate()
      .toString()
      .padStart(2, "0");
    return year + "-" + month + "-" + day + " " + suffix;
  }

  changeView(view: string) {
    this.view = view;
  }

  processDataForGraph(response = []) {
    response.forEach(status => {
      const key = this.chartKeys[status.status];
      this[key] = (status.workCategoryList as any[]).map(e => [e.requestType, e.requestCount]);
      this.totalData[status.status] = (status.workCategoryList as any[]).map(e => e.requestCount).reduce((prev, current) => {
        return prev + current
      });
    });
  }

  setNoData() {
    this.teamRebuttalReviewStatus.push(["NO DATA", 1]);
    this.teamDataAuditFailedStatus.push(["NO DATA", 1]);
    this.teamDataAssignedStatus.push(["NO DATA", 1]);
    this.teamDataAuditPasedStatus.push(["NO DATA", 1]);
    this.teamDataBacklogStatus.push(["NO DATA", 1]);
  }

  navigateToDetail(status: string, requestType) {
    const statusRoute = status.replace(/\s/g, '').toLowerCase().replace('/', '').replace("today's", '');
    this.router.navigateByUrl(`/enrollment-auditor/${statusRoute}-queue?type=${requestType}`);
  }
  
}
