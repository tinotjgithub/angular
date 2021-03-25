import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { Routes, RouterModule } from "@angular/router";
import { CalendarModule } from "primeng/calendar";
import { GoogleChartsModule } from "angular-google-charts";
import { TooltipModule } from "primeng/tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuditorAuditStatusComponent } from "./landing-page/auditor-audit-status/auditor-audit-status.component";
// tslint:disable-next-line: max-line-length
import { AuditorAuditStatusDetailsComponent } from "./landing-page/auditor-audit-status/auditor-audit-status-details/auditor-audit-status-details.component";
import { AuditorQualityScoreComponent } from "./landing-page/auditor-quality-score/auditor-quality-score.component";
// tslint:disable-next-line: max-line-length
import { ClaimsAuditedCategoryDetailsComponent } from "./landing-page/auditor-claims-audited-category/claims-audited-category-details/claims-audited-category-details.component";
// tslint:disable-next-line: max-line-length
import { AuditorClaimsAuditedCategoryComponent } from "./landing-page/auditor-claims-audited-category/auditor-claims-audited-category.component";
import { AuditorClaimsAuditedComponent } from "./landing-page/auditor-claims-audited/auditor-claims-audited.component";
// tslint:disable-next-line: max-line-length
import { AuditorClaimsAuditedDetailsComponent } from "./landing-page/auditor-claims-audited/auditor-claims-audited-details/auditor-claims-audited-details.component";
// tslint:disable-next-line: max-line-length
import { AuditorQualityScoreDetailsComponent } from "./landing-page/auditor-quality-score/auditor-quality-score-details/auditor-quality-score-details.component";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";
const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  providers: [MessageService],
  declarations: [
    LandingPageComponent,
    AuditorClaimsAuditedCategoryComponent,
    AuditorAuditStatusComponent,
    AuditorAuditStatusDetailsComponent,
    AuditorClaimsAuditedComponent,
    ClaimsAuditedCategoryDetailsComponent,
    AuditorQualityScoreDetailsComponent,
    AuditorQualityScoreComponent,
    AuditorClaimsAuditedDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CalendarModule,
    GoogleChartsModule,
    TooltipModule,
    FormsModule,
    TableModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    ReactiveFormsModule
  ],
  exports: [AuditorQualityScoreComponent]
})
export class LandingPageModule {}
