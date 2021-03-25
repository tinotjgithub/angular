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
import { AuditedClaimsReportComponent } from "./audited-claims-report/audited-claims-report.component";
import { AuthGuard } from "src/app/guards/auth.guard/auth.guard";
import { TableModule } from "primeng/table";

const routes: Routes = [
  {
    path: "audited-claims-report",
    component: AuditedClaimsReportComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: [{ label: "Audited Claims Report" }],
      expectedRoles: ["Claims Auditor", "Claims Lead", "Manager"]
    }
  }
];

@NgModule({
  declarations: [AuditedClaimsReportComponent],
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
    ComponentsModule
  ],
  exports: [AuditedClaimsReportComponent]
})
export class AuditedClaimsReportModule {}
