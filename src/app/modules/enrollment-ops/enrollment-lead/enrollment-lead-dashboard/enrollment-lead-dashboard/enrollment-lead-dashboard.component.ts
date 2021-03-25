import { Component, OnInit } from "@angular/core";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { AuditorService } from "src/app/services/auditor/auditor.service";

@Component({
  selector: "app-enrollment-lead-dashboard",
  templateUrl: "./enrollment-lead-dashboard.component.html"
})
export class EnrollmentLeadDashboardComponent implements OnInit {
  public auditorColumnNames = ["", "Claims Count", { role: "annotation" }];
  public auditorHeight = 195;
  public auditorHeightEnlarged = 300;
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
    colors: ["#ff9226"],
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
      position: "top",
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    chartArea: {
      left: 250,
      right: 55,
      top: 30,
      bottom: 10
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
  };

  public optionsStatusEnlarged = {
    height: 400,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        textPosition: "Horizontal"
      }
    },
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
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    colors: ["#ff9226"],
    chartArea: {
      left: 250,
      right: 55,
      top: 25,
      bottom: 10
    },
    legend: {
      position: "top",
      textStyle: {
        color: "black",
        fontSize: 14,
        textPosition: "Horizontal"
      }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    annotations: {
      textStyle: {
        fontSize: 14
      }
    }
    // isStacked: true
  };
  public auditorCountData = [["NO-DATA", 0, "0"]];
  public expand: boolean;
  loaded: boolean;
  constructor(
    private taskMgtService: TaskmanagementService,
    private auditorService: AuditorService
  ) {}

  ngOnInit() {
    // this.taskMgtService.refreshMatView();
  }

  changeTab($event) {
    // this.taskMgtService.refreshMatView();
  }
}
