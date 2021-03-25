import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule, DatePipe } from "@angular/common";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { CalendarModule } from "primeng/calendar";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { DropdownModule } from "primeng/dropdown";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MessageService } from "primeng/api";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { MultiSelectModule } from "primeng/multiselect";
import { LoaderComponent } from "./loader.component";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
describe("LoaderComponent", () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      imports: [
        CommonModule,
        GoogleChartsModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        CalendarModule,
        ButtonModule,
        TooltipModule,
        DropdownModule,
        HttpClientTestingModule,
        ProgressSpinnerModule,
        MultiSelectModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
