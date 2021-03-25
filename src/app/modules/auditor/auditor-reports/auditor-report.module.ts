import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { CommonModule } from "@angular/common";
import { AuditBacklogReportComponent } from "./audit-backlog-report/audit-backlog-report.component";
import { AuditedClaimsReportModule } from "./../../../modules/audited-claims-report/audited-claims-report.module";
import { AuditRebuttalReportComponent } from "./audit-rebuttal-report/audit-rebuttal-report.component";
import { AuditReportComponent } from "./audit-report/audit-report.component";
import { AuthGuard } from "src/app/guards/auth.guard/auth.guard";
import { TableModule } from "primeng/table";
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {
    path: "audit-rebuttal-report",
    component: AuditRebuttalReportComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: [{ label: "Audit Rebuttal Report" }],
      expectedChildRoles: ["Claims Auditor"]
    }
  },
  {
    path: "audit-report",
    component: AuditReportComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: [{ label: "Audit Report" }],
      expectedChildRoles: ["Claims Auditor"]
    }
  },
  {
    path: "audit-backlog-report",
    component: AuditBacklogReportComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: [{ label: "Audit Backlog Report" }],
      expectedChildRoles: ["Claims Auditor"]
    }
  },
  {
    path: 'main',
    component: ReportComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [
    AuditBacklogReportComponent,
    AuditRebuttalReportComponent,
    AuditReportComponent,
    ReportComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule,
    TooltipModule,
    CommonModule,
    DialogModule,
    TableModule,
    CardModule,
    MultiSelectModule,
    ComponentsModule,
    AuditedClaimsReportModule
  ]
})
export class AuditorReportModule {}
