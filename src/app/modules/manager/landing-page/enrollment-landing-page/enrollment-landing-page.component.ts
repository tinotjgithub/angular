import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { ActiveUsersManagerLanding } from "../models/ActiveUser";
import PieChartCount from "src/app/modules/lead/landing-page/models/PieChartCount";
import { GoogleChartComponent } from "angular-google-charts";
import { actions, ROLES } from "src/app/shared/constants.js";
import { ConfirmationService } from "primeng/api";
import { timeout, catchError } from "rxjs/operators";
import { NotifierService } from "src/app/services/notifier.service";
import { AuditorService } from "src/app/services/auditor/auditor.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { ActiveEnrollmentUsersManagerLanding } from "../models/ActiveEnrollmentUsers";
import { EmrollmentLeadLandingPageService } from "src/app/modules/enrollment-ops/enrollment-lead/enrollment-lead-landing-page/services/emrollment-lead-landing-page.service";
import { ManagerEnrollmentLandingPageService } from "../services/manager-enrollment-landing-page.service";
@Component({
  selector: "app-enrollment-landing-page",
  templateUrl: "./enrollment-landing-page.component.html",
  styleUrls: ["./enrollment-landing-page.component.css"]
})
export class EnrollmentLandingPageComponent implements OnInit {
  todaysCount: any;
  public viewChart = false;
  public toogleOptions: any[];
  @ViewChild("chart1", { static: false })
  chart1: GoogleChartComponent;
  @ViewChild("chart2", { static: false })
  chart2: GoogleChartComponent;
  // Donut Chart Variables
  piechartCount = {
    assignedCount: 0,
    pendedCount: 0,
    unAssignedCount: 0
  };
  managerType = "";
  switchValue = "";
  type = "PieChart";
  data = null;
  total: any;
  public pendingCount;
  columnNames = ["Status", "Count"];
  options = {
    tooltip: { text: "value", trigger: "focus", showColorCode: true },
    pieHole: 0.6,
    legend: "top",
    pieSliceText: "value",
    pieSliceTextStyle: { fontSize: 18 },
    slices: {
      0: { color: "#ff9226" },
      1: { color: "#ff5c5d" },
      2: { color: "#2c68a6" }
    },
    chartArea: {
      width: "100%",
      height: "100%",
      left: 50,
      right: 50,
      top: 50,
      bottom: 50
    }
  };
  public assignedData = [];
  public unAssignedData = [];
  public pendedData = [];
  // ---Donut
  activeUsers: ActiveUsersManagerLanding;
  activeEnrollmentUsers: ActiveEnrollmentUsersManagerLanding;
  message = "No Upcoming Maintenance Scheduled";
  public columnNamesStatus = [
    "",
    "Pended",
    { role: "annotation" },
    "Assigned",
    { role: "annotation" },
    "Unassigned",
    { role: "annotation" }
  ];
  public optionsStatusEnlarged: any = {
    width: "100%",
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 13,
        textPosition: "Horizontal"
      }
    },
    colors: ["#ff5c5d", "#ff9226", "#2c68a6"],
    hAxis: {
      title: "Queue Name",
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    vAxis: {
      title: "Claim Count",
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
    chartArea: {
      left: 60,
      right: 60,
      top: 40,
      bottom: 50
    },
    legend: {
      position: "top"
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    annotations: {
      textStyle: {
        fontSize: 14,
        textPosition: "Horizontal"
      },
      Vertical: true
    },
    series: {
      0: {
        // series 0
        annotations: {
          stem: {
            length: 7
          }
        }
      },
      1: {
        // series 1
        annotations: {
          stem: {
            length: 7
          }
        }
      },
      2: {
        // series 1
        annotations: {
          stem: {
            length: 10
          },
          alwaysOutside: true
        }
      }
    }
    // isStacked: true
  };

  public dataStatus = [];
  public totalAssigned = 0;
  public totalUnAssigned = 0;
  public totalPended = 0;

  public actionLinks = [];
  public syncNow: boolean;
  public synching: boolean;
  public auditStatus: any;
  public daysCrossed: any;

  @HostListener("window:resize", ["$event"])
  onWindowResize(event: any) {
    this.chart1.ngOnChanges();
    // this.chart2.ngOnChanges();
  }

  constructor(
    private userMangementService: UserManagementService,
    private taskManagementService: TaskmanagementService,
    private confirmService: ConfirmationService,
    private messageService: NotifierService,
    private auditorService: AuditorService,
    private leadService: EmrollmentLeadLandingPageService,
    private authService: AuthenticationService,
    private enrollmentService: ManagerEnrollmentLandingPageService
  ) {}

  ngOnInit() {
    this.getWorCategoryCount();
    this.userMangementService.getManagersTodaysStatusCount().subscribe(resp => {
      this.activeUsers = resp;
    });
    this.switchValue = this.authService.managerType;
    this.enrollmentService
      .enrollmentActiveUserSnapShotDetails()
      .subscribe(res => {
        this.activeEnrollmentUsers = res;
      });
    this.leadService.getEnrollmentLeadPendingCount().subscribe(res => {
      if (res) {
        this.pendingCount = res.userCount ? res.userCount : 0;
        this.daysCrossed = res ? res.daysCrossed : false;
      }
    });
    this.getAuditStatus();
    const menu = this.getLinksByType(this.switchValue);
    this.createQuickLinkMenu(menu);
    this.authService.updateManagerTypeListener().subscribe(data => {
      this.switchValue = data;
      const links = this.getLinksByType(this.switchValue);
      this.createQuickLinkMenu(links);
    });
  }

  getWorCategoryCount() {
    this.enrollmentService.getEnrollmentManagerStatus().subscribe(res => {
      if (res) {
        this.setData(res);
      } else {
        this.getStatusChartNoValue();
      }
    });
  }

  setData(response) {
    response.map(value => {
      if (value) {
        if (value.status === "Assigned") {
          this.assignedData = value.workCategoryList;
          this.totalAssigned = 0;
          value.workCategoryList.forEach(val => {
            this.totalAssigned = this.totalAssigned + val.requestCount;
          });
        } else if (value.status === "Pended") {
          this.pendedData = value.workCategoryList;
          this.totalPended = 0;
          value.workCategoryList.forEach(val => {
            this.totalPended = this.totalPended + val.requestCount;
          });
        } else if (value.status === "UnAssigned") {
          this.unAssignedData = value.workCategoryList;
          this.totalUnAssigned = 0;
          value.workCategoryList.forEach(val => {
            this.totalUnAssigned = this.totalUnAssigned + val.requestCount;
          });
        } else {
          console.log("No Data");
        }
      } else {
        this.getStatusChartNoValue();
      }
    });
    this.setPieChartData();
    this.setGraphData();
  }

  getLinksByType(switchValue) {
    let array = [];
    if (switchValue === "claims" || switchValue === "both") {
      array = actions[ROLES.manager].filter(item => {
        return item.header === "Claims Operations";
      });
    } else {
      array = actions[ROLES.manager].filter(item => {
        return item.header === "Enrollment Operations";
      });
    }
    return array;
  }

  createQuickLinkMenu(menu) {
    this.actionLinks = [];
    menu.forEach(e => {
      if (e && e.links) {
        const updatedSec = {
          header: e.header,
          items: []
        };
        const links: any[] = e.links;
        links.forEach(f => {
          if (f.items && f.items.length > 0) {
            updatedSec.items = [...updatedSec.items, ...f.items];
          } else {
            updatedSec.items = [...updatedSec.items, f];
          }
        });
        this.actionLinks = [...this.actionLinks, updatedSec];
      }
    });
  }

  setGraphData() {
    this.data = [
      ["Assigned", this.totalAssigned],
      ["Pended", this.totalPended],
      ["Unassigned", this.totalUnAssigned]
    ];
    this.total = Number(
      Number(this.totalAssigned) +
        Number(this.totalPended) +
        Number(this.totalUnAssigned)
    );
  }

  private setPieChartData() {
    this.piechartCount.assignedCount = this.totalAssigned
      ? this.totalAssigned
      : 0;
    this.piechartCount.pendedCount = this.totalPended ? this.totalPended : 0;
    this.piechartCount.unAssignedCount = this.totalUnAssigned
      ? this.totalUnAssigned
      : 0;
  }

  getStatusChartNoValue() {
    this.dataStatus = [];
    this.optionsStatusEnlarged.legend.position = "none";
    this.optionsStatusEnlarged.tooltip.trigger = "none";
    this.dataStatus.push(["NO DATA", 0, "0", 0, "0", 0, "0"]);
  }

  getPercentage(val: number) {
    return val && this.total ? Math.round((val / this.total) * 100) : 0;
  }
  confirm() {
    this.confirmService.confirm({
      message: "Do you want to synchronize now?",
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: () => {
        this.refresh();
      }
    });
  }

  refresh() {
    this.synching = true;
    this.enrollmentService
      .refreshEnrollmentWorkBasket()
      .pipe(
        timeout(60000),
        catchError(e => {
          this.messageService.throwNotification({
            type: "error",
            message: "Refresh timed out! Please try after sometime."
          });
          this.synching = false;
          return null;
        })
      )
      .subscribe((data: any) => {
        if (
          data.status.toUpperCase() === "SUCCESS" ||
          data.status.toUpperCase() === "SUCCESS!"
        ) {
          this.synching = false;
          location.reload();
          this.messageService.throwNotification({
            type: "success",
            message: data.message
          });
        } else if (
          data.status.toUpperCase() === "FAILURE" ||
          data.status.toUpperCase() === "FAILURE!"
        ) {
          this.synching = false;
          this.messageService.throwNotification({
            type: "error",
            message: data.message
          });
        }
      });
  }

  selectMenu(view) {
    this.viewChart = view === "chart" ? true : false;
  }

  getAuditStatus() {
    this.enrollmentService
      .getManagerEnrollmenttaskStatus()
      .subscribe(res => {
        this.auditStatus = res;
      });
  }
}
