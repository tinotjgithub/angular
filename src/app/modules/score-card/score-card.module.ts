import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScoreCardComponent } from "./score-card.component";
import { AuditScoreComponent } from "./audit-score/audit-score.component";
import { FinancialScoreComponent } from "./financial-score/financial-score.component";
import { ProceduralScoreComponent } from "./procedural-score/procedural-score.component";
import { AuditFailedVsRebuttalAcceptedComponent } from "./audit-failed-vs-rebuttal-accepted/audit-failed-vs-rebuttal-accepted.component";
import { ProductivityByScheduleComponent } from "./productivity-by-schedule/productivity-by-schedule.component";
import { StatusDateComponent } from "./status-date/status-date.component";
import { RouterModule, Routes } from "@angular/router";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { TooltipModule } from "primeng/tooltip";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";

const routes: Routes = [
  {
    path: "",
    component: ScoreCardComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  providers: [MessageService],
  declarations: [
    ScoreCardComponent,
    AuditScoreComponent,
    FinancialScoreComponent,
    ProceduralScoreComponent,
    ProductivityByScheduleComponent,
    StatusDateComponent,
    AuditFailedVsRebuttalAcceptedComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GoogleChartsModule,
    FormsModule,
    TooltipModule,
    ReactiveFormsModule,
    CalendarModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    DropdownModule
  ]
})
export class ScoreCardModule {}
