import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RebutReviewListComponent } from "./rebut-review-list.component";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { CheckboxModule } from "primeng/checkbox";
import { RouterTestingModule } from "@angular/router/testing";
import { ReviewService } from "src/app/services/review/review.service";
import { of } from "rxjs";

import { NgModule, APP_INITIALIZER } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { AppConfigService } from 'src/app/services/config/config.service';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

describe("RebutReviewListComponent", () => {
  let component: RebutReviewListComponent;
  let fixture: ComponentFixture<RebutReviewListComponent>;
  let service: ReviewService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RebutReviewListComponent],
      imports: [
        CommonModule,
        RouterModule.forRoot([]),
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        { provide: BaseHttpService, useClass: MockBaseHttpService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebutReviewListComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(ReviewService);
    fixture.detectChanges();
  });

  it("should create", () => {
    spyOn(service, "getLeadReviewList").and.returnValue(of(""));
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it("should get options from data", () => {
    component.tableData = [];
    expect(component.getOptions({ field: "" })).toEqual([]);
    component.tableData = [
      {
        name: "Test"
      },
      {
        name: "Test-1"
      }
    ];
    expect(component.getOptions({ field: "name" })).toEqual(["Test", "Test-1"]);
  });

  it("should get list", () => {
    spyOn(service, "getLeadReviewList").and.returnValue(of([]));
    component.currentRole = "Claims Lead";
    component.getQueueList();
    spyOn(service, "getManagerReviewList").and.returnValue(of([]));
    component.currentRole = "Manager";
    component.getQueueList();
    expect(component.tableData).toEqual([]);
  });

  it("should get list - no res", () => {
    spyOn(service, "getLeadReviewList").and.returnValue(of(""));
    component.currentRole = "Claims Lead";
    component.getQueueList();
    spyOn(service, "getManagerReviewList").and.returnValue(of(""));
    component.currentRole = "Manager";
    component.getQueueList();
    expect(component.tableData).toEqual([]);
  });
});
