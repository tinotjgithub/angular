import { Component, OnInit } from "@angular/core";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import TodaysCount from "../models/TodaysCount";
import PieChartCount from "../models/PieChartCount";
import { AuditorService } from "./../../../../services/auditor/auditor.service";
import { actions } from "src/app/shared/constants.js";

@Component({
  selector: "app-active-user-snapshot",
  templateUrl: "./landing-page.component.html"
})
export class LandingPageComponent implements OnInit {
  total: number;
  public auditStatus: any;
  pendingCount = 0;
  daysCrossed = false;
  constructor(
    private userMangementService: UserManagementService,
    private auditorService: AuditorService
  ) {}
  todaysCount: TodaysCount;
  public reviewCount: number;
  piechartCount: PieChartCount;
  type = "PieChart";
  data = null;
  digits = [];
  columnNames = ["Status", "Count"];
  options = {
    tooltip: { text: "value", trigger: "focus", showColorCode: true },
    pieHole: 0.6,
    legend: "bottom",
    pieSliceText: "value",
    pieSliceTextStyle: { fontSize: 18 },
    slices: {
      0: { color: "#ff9226" },
      1: { color: "#ff5c5d" },
      2: { color: "#2c68a6" }
    },
    chartArea: {
      left: 20,
      right: 20,
      top: 50,
      bottom: 50
    }
  };
  width = 600;
  height = 460;
  public actionLinks = [];

  ngOnInit() {
    window.scrollTo(0, 0);
    this.userMangementService.getLeadsTodaysStatusCount().subscribe(resp => {
      this.todaysCount = resp;
    });

    this.userMangementService.getPendingCount().subscribe(res => {
      this.pendingCount = res ? res.userCount : 0;
      this.daysCrossed = res ? res.daysCrossed : false;
    });

    /* this.auditorService.getAuditReviewCount().subscribe(resp => {
      this.reviewCount = resp;
    }); */
    this.userMangementService.getLeadsPieChartCount().subscribe(resp => {
      this.piechartCount = resp;
      this.setGraphData(this.piechartCount);
    });
    // tslint:disable-next-line: no-string-literal
    actions["Claims Lead"].forEach(e => {
      if (e && e.links) {
        e.links.forEach(f => {
          this.actionLinks = [...this.actionLinks, ...f.items];
        });
      }
    });
    this.getAuditStatus();
  }

  setGraphData(pieChartData: PieChartCount) {
    this.data = [
      ["Assigned", pieChartData.assignedCount],
      ["Pended", pieChartData.pendedCount],
      ["To Do", pieChartData.toDoCount]
    ];
    this.total = Number(
      Number(pieChartData.assignedCount) +
        Number(pieChartData.pendedCount) +
        Number(pieChartData.toDoCount)
    );
    this.digits = ("" + this.total).split("");
  }

  getPercentage(val: number) {
    return val && this.total ? Math.round((val / this.total) * 100) : 0;
  }

  getAuditStatus() {
    this.auditorService.getAuditStatusLeadManager().subscribe(res => {
      this.auditStatus = res;
    });
  }
}
