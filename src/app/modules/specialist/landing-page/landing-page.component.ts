import { Component, OnInit, HostListener } from "@angular/core";
import { NotifierService } from "src/app/services/notifier.service";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { Router } from "@angular/router";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { HeaderService } from "src/app/services/header/header.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { resolve, reject } from "q";

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html"
})
export class LandingPageComponent implements OnInit {
  view = "list";
  total: number;
  dataPended: any[][];
  quickLinkSnapshot: any;
  type = "PieChart";
  data: any = {};
  columnNames = ["Work Category", "Count"];
  options = {
    colors: ["#e19b0e", "#058ba3", "#b84066"],
    pieSliceTextStyle: { fontSize: 12 },
    pieHole: 0.38,
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 1,
      right: 1,
      top: 25,
      bottom: 1
    },
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
    }
  };
  public width = "80%";
  public height = 200;
  requestSnapshot: any;
  workCategory: WorkCategory[];
  activeWorkCategories: any[];

  constructor(
    private enrollmentService: EnrollmentManagementService,
    private router: Router
  ) {}

  ngOnInit() {
    const promise = new Promise((resolve, reject) => {
      this.workCategory = [];
      this.enrollmentService.getWorkCategory().subscribe(
        resp => {
          this.workCategory = resp;
          resolve(resp);
        },
        err => {
          reject([]);
        }
      );
    });
    promise.then(resp => {
      this.setActiveWorkCategories(this.workCategory);
      this.enrollmentService
        .getEnrollmentSpecilaitMainLandingPageData()
        .subscribe(res => {
          this.requestSnapshot = res;
          this.total =
            Number(res.pended.total) +
            Number(res.assigned.total) +
            Number(res.completed.total) +
            Number(res.routedOut.total) +
            Number(res.auditFail.total);
          this.setChartData(res);
        });
      this.enrollmentService
        .getEnrollmentSpecialistMainLandingPageQuickLinkData()
        .subscribe(res => {
          this.quickLinkSnapshot = res;
        });
    });
  }

  setActiveWorkCategories(workCategories: WorkCategory[] = []) {
    this.activeWorkCategories = workCategories
      .filter(item => {
        return item.workCategoryConfigActive === true;
      })
      .map(item => {
        return item.name.toString().toLowerCase();
      });
  }

  displayWorkCategory(workCategory) {
    return (
      this.activeWorkCategories &&
      this.activeWorkCategories.includes(workCategory.toString().toLowerCase())
    );
  }

  navigateToDetailPage(evt, status) {
    const row = evt[0].row;
    const type = this.data[
      status === "routed-out"
        ? "routedOut"
        : status === "audit-failed"
        ? "auditFail"
        : status
    ][row][0];
    this.router.navigate(["/specialist/work-category/" + status + "-details"], {
      queryParams: { type }
    });
  }

  setChartData(res) {
    for (let type in res) {
      this.data[type] = [
        ["Workbasket", res[type]["workbasketCount"] || 0],
        ["Reconciliation", res[type]["reconciliationCount"] || 0],
        ["Fallout", res[type]["fallOutCount"] || 0]
      ];
    }
  }

  setView(val) {
    this.view = val;
  }

  getPercentage(val: number) {
    return val && this.total ? Math.round((val / this.total) * 100) : 0;
  }
}

class WorkCategory {
  id: number;
  name: string;
  workCategoryConfigActive: boolean;
}
