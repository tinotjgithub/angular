import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ScoreCardComponent } from "./score-card.component";
import { AuditScoreComponent } from "./audit-score/audit-score.component";
import { FinancialScoreComponent } from "./financial-score/financial-score.component";
import { ProceduralScoreComponent } from "./procedural-score/procedural-score.component";
import { ProductivityByScheduleComponent } from "./productivity-by-schedule/productivity-by-schedule.component";
import { StatusDateComponent } from "./status-date/status-date.component";
import { AuditFailedVsRebuttalAcceptedComponent } from "./audit-failed-vs-rebuttal-accepted/audit-failed-vs-rebuttal-accepted.component";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { DatePipe } from "@angular/common";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";

describe("ScoreCardComponent", () => {
  let component: ScoreCardComponent;
  let fixture: ComponentFixture<ScoreCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScoreCardComponent,
        AuditScoreComponent,
        FinancialScoreComponent,
        AuditFailedVsRebuttalAcceptedComponent,
        ProceduralScoreComponent,
        ProductivityByScheduleComponent,
        StatusDateComponent
      ],
      imports: [
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DialogModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
