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
@Component({
  selector: "app-claims-landing-page",
  templateUrl: "./claims-landing-page.component.html",
  styleUrls: ["./claims-landing-page.component.css"]
})
export class ClaimsLandingPageComponent implements OnInit {
  todaysCount: any;
  @ViewChild("chart1", { static: false })
  chart1: GoogleChartComponent;
  @ViewChild("chart2", { static: false })
  chart2: GoogleChartComponent;
  public isDataPresent = false;
  enlargedDisplay = false;
  // Donut Chart Variables
  piechartCount: PieChartCount = {
    assignedCount: 0,
    pendedCount: 0,
    toDoCount: 0
  };
  managerType = "";
  type = "PieChart";
  data = null;
  total: any;
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

  // ---Donut
  activeUsers: ActiveUsersManagerLanding;
  message = "No Upcoming Maintenance Scheduled";
  public columnNamesStatus = [
    "",
    "Pended",
    { role: "annotation" },
    "Assigned",
    { role: "annotation" },
    "To Do",
    { role: "annotation" }
  ];
  public optionsStatusEnlarged: any = {
    width: "100%",
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    colors: ["#ff5c5d", "#ff9226", "#2c68a6"],
    hAxis: {
      format: "0",
      title: "",
      textStyle: {
        color: "black",
        fontSize: 12,
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
        fontSize: 12,
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

  public actionLinks = [];
  public syncNow: boolean;
  public synching: boolean;
  public auditStatus: any;
  pendingCount = 0;
  daysCrossed = false;

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
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.userMangementService.getManagersTodaysStatusCount().subscribe(resp => {
      this.activeUsers = resp;
    });

    // Get Soon to be terminated users Count
    this.userMangementService.getPendingCount().subscribe(res => {
      this.pendingCount = res ? res.userCount : 0;
      this.daysCrossed = res ? res.daysCrossed : false;
    });

    this.getStatusChartData();
    this.getAuditStatus();
    // tslint:disable-next-line: no-string-literal
    this.managerType = this.authService.managerType;
    const menu = this.getLinksByType(this.managerType);
    this.createQuickLinkMenu(menu);
    this.authService.updateManagerTypeListener().subscribe(data => {
      this.managerType = data;
      const links = this.getLinksByType(this.managerType);
      this.createQuickLinkMenu(links);
    });
  }

  getLinksByType(managerType) {
    let array = [];
    if (managerType === "claims") {
      array = actions[ROLES.manager].filter(item => {
        return item.header === "Claims Operations";
      });
    } else if (managerType === "both") {
      array = actions[ROLES.manager];
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
    /* this.total = (
      "" +
      Number(
        Number(pieChartData.assignedCount) +
          Number(pieChartData.pendedCount) +
          Number(pieChartData.toDoCount)
      )
    ).split(""); */
  }

  getStatusChartData() {
    this.isDataPresent = true;
    this.dataStatus = [];
    this.taskManagementService.getManagerClaimsStatus().subscribe(res => {
      if (res && res.length > 0) {
        const response: any[] = res;
        this.optionsStatusEnlarged.legend.position = "top";
        this.optionsStatusEnlarged.tooltip.trigger = "focus";
        this.dataStatus = response
          .filter(val => val && val.managerStatusDto)
          .map(val => {
            this.setPieChartData(val);
            return [
              val.managerStatusDto.queueName,
              val.managerStatusDto.Pended || 0,
              val.managerStatusDto.Pended || 0,
              val.managerStatusDto.Assigned || 0,
              val.managerStatusDto.Assigned || 0,
              val.managerStatusDto["To-Do"] || 0,
              val.managerStatusDto["To-Do"] || 0
            ];
          });
        const statusLength = this.dataStatus.length;
        const newWeightEnlarged = statusLength > 7 ? statusLength * 90 : 800;
        const newGeneratedWeightEnlarged =
          newWeightEnlarged > 800 ? newWeightEnlarged : 800;
        this.optionsStatusEnlarged.width = newGeneratedWeightEnlarged;
        this.setGraphData(this.piechartCount);
      } else {
        this.getStatusChartNoValue();
      }
    });
  }

  private setPieChartData(val: any) {
    this.piechartCount.assignedCount +=
      val.managerStatusDto.Assigned === undefined ||
      val.managerStatusDto.Assigned === null ||
      isNaN(val.managerStatusDto.Assigned)
        ? 0
        : val.managerStatusDto.Assigned;
    this.piechartCount.pendedCount +=
      val.managerStatusDto.Pended === undefined ||
      val.managerStatusDto.Pended === null ||
      isNaN(val.managerStatusDto.Pended)
        ? 0
        : val.managerStatusDto.Pended;
    this.piechartCount.toDoCount +=
      val.managerStatusDto["To-Do"] === undefined ||
      val.managerStatusDto["To-Do"] === null ||
      isNaN(val.managerStatusDto["To-Do"])
        ? 0
        : val.managerStatusDto["To-Do"];
  }

  getStatusChartNoValue() {
    this.isDataPresent = false;
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
    this.taskManagementService
      .refreshClaimWorkBasket()
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

  getAuditStatus() {
    this.auditorService.getAuditStatusLeadManager().subscribe(res => {
      this.auditStatus = res;
    });
  }
}
