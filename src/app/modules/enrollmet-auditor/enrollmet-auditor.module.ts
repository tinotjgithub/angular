import { AssignedComponent } from "./components/detail-page/assigned/assigned.component";
import { ButtonModule } from "primeng/button";
import { PickListModule } from "primeng/picklist";
import { TabViewModule } from "primeng/tabview";
import { StepsModule } from "primeng/steps";
import { AccordionModule } from "primeng/accordion";
import { CanDeactivateGuard } from "src/app/guards/route.guard/can-deactivate.gaurd";
import { GoogleChartsModule } from "angular-google-charts";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { CalendarModule } from "primeng/calendar";
import { MessageModule } from "primeng/message";
import { AuditorQueueComponent } from "./components/auditor-queue/auditor-queue.component";
import { DetailPageLeadModule } from "../enrollment-ops/enrollment-lead/detail-page-lead/detail-page-lead.module";
import { BacklogComponent } from "./components/detail-page/backlog/backlog.component";
import { ReviewRebuttalComponent } from "./components/detail-page/review-rebuttal/review-rebuttal.component";
import { AuditPassedComponent } from "./components/detail-page/audit-passed/audit-passed.component";
import { AuditFailedComponent } from "./components/detail-page/audit-failed/audit-failed.component";
import { RebuttalQueueComponent } from "./components/rebuttal-queue/rebuttal-queue.component";
import { EnrollmentAuditorDashboardComponent } from "./components/enrollment-auditor-dashboard/enrollment-auditor-dashboard.component";
import { EnrollmetAuditorDashboardModule } from "./components/enrollment-auditor-dashboard/enrollment-auditor-dashboard.module";

const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent,
    data: {
      breadcrumb: [{ label: "Home" }]
    }
  },
  {
    path: "audit-queue",
    component: AuditorQueueComponent,
    data: {
      breadcrumb: [{ label: "Audit Queue" }]
    },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: "assigned-queue",
    component: AssignedComponent,
    data: {
      breadcrumb: [
        { label: "Home", target: "home" },
        { label: "Assigned Queue" }
      ]
    }
  },
  {
    path: "backlog-queue",
    component: BacklogComponent,
    data: {
      breadcrumb: [
        { label: "Home", target: "home" },
        { label: "Backlog Queue" }
      ]
    }
  },
  {
    path: "rebuttalreview-queue",
    component: ReviewRebuttalComponent,
    data: {
      breadcrumb: [
        { label: "Home", target: "home" },
        { label: "Review/Rebuttal Queue" }
      ]
    }
  },
  {
    path: "auditpassed-queue",
    component: AuditPassedComponent,
    data: {
      breadcrumb: [
        { label: "Home", target: "home" },
        { label: "Audit Passed Queue" }
      ]
    }
  },
  {
    path: "auditfailed-queue",
    component: AuditFailedComponent,
    data: {
      breadcrumb: [
        { label: "Home", target: "home" },
        { label: "Audit Failed Queue" }
      ]
    }
  },
  {
    path: "rebut-queue",
    component: RebuttalQueueComponent,
    data: {
      breadcrumb: [
        { label: "Home", target: "home" },
        { label: "Review Rebuttal Queue" }
      ]
    },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: "auditor-dashboard",
    component: EnrollmentAuditorDashboardComponent,
    data: {
      breadcrumb: []
    },
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  declarations: [
    LandingPageComponent,
    AuditorQueueComponent,
    AssignedComponent,
    BacklogComponent,
    ReviewRebuttalComponent,
    AuditPassedComponent,
    AuditFailedComponent,
    RebuttalQueueComponent,
    EnrollmentAuditorDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    DialogModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule,
    ReactiveFormsModule,
    ComponentsModule,
    CalendarModule,
    GoogleChartsModule,
    MessageModule,
    AccordionModule,
    EnrollmetAuditorDashboardModule,
    StepsModule,
    ButtonModule,
    PickListModule,
    TabViewModule,
    DetailPageLeadModule
  ],
  providers: [ConfirmationService]
})
export class EnrollmetAuditorModule {}
