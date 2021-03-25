import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { ClaimsExaminerQualityComponent } from "./claims-examiner-quality/claims-examiner-quality.component";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { PromtUserListComponent } from "./promt-user-list/promt-user-list.component";
import { AuthGuard } from "src/app/guards/auth.guard/auth.guard";
import { StatusReportComponent } from "./status-report/status-report.component";
import { TableModule } from "primeng/table";
import { ReportTableComponent } from "./report-table/report-table.component";
import { TooltipModule } from "primeng/tooltip";
import { ButtonModule } from "primeng/button";
import { AuditedClaimsReportModule } from "./../../modules/audited-claims-report/audited-claims-report.module";

const routes: Routes = [
  {
    path: "quality-report",
    component: ClaimsExaminerQualityComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: [{ label: "Audit" }],
      expectedChildRoles: ["Manager", "Claims Lead"]
    }
  },
  {
    path: "user-list",
    component: PromtUserListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: [{ label: "User Report" }],
      expectedChildRoles: ["Administrator", "Manager", "Claims Lead"]
    }
  },
  {
    path: "status-pended",
    component: StatusReportComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: [{ label: "Pended Claims" }],
      expectedChildRoles: ["Claims Lead"],
      reportType: "Pended"
    }
  },
  {
    path: "status-routed-in",
    component: StatusReportComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: [{ label: "Routed-In Claims" }],
      expectedChildRoles: ["Claims Lead"],
      reportType: "Routed-In"
    }
  }
];

@NgModule({
  declarations: [
    ClaimsExaminerQualityComponent,
    PromtUserListComponent,
    StatusReportComponent,
    ReportTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GoogleChartsModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ComponentsModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    AuditedClaimsReportModule,
    ReactiveFormsModule,
    TooltipModule,
    TableModule
  ],
  exports: [
    PromtUserListComponent,
    StatusReportComponent,
    ClaimsExaminerQualityComponent,
    ReportTableComponent
  ]
})
export class ReportsModule {}
