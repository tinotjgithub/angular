import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ManualClaimSelectionComponent } from "./manual-claim-selection.component";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TooltipModule } from "primeng/tooltip";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CheckboxModule } from "primeng/checkbox";
import { ReviewService } from "src/app/services/review/review.service";
import { BaseHttpService } from "src/app/services/base-http.service";
import { CalendarModule } from 'primeng/calendar';
import { AuditorService } from 'src/app/services/auditor/auditor.service';
import { of, throwError } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

describe("ManualClaimSelectionComponent", () => {
  let component: ManualClaimSelectionComponent;
  let fixture: ComponentFixture<ManualClaimSelectionComponent>;
  let service: AuditorService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManualClaimSelectionComponent],
      imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule,
        ComponentsModule,
        ButtonModule,
        DialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        CalendarModule,
        CheckboxModule,
        DropdownModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        AuditorService,
        BaseHttpService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualClaimSelectionComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(AuditorService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should create subscribe to value changes", () => {
    component.claimCount = 2;
    component.claimForm.patchValue({
      from: new Date()
    });
    expect(component.claimCount).toEqual(0);
  });

  it("should get claims", () => {
    spyOn(service, 'getClaimsForManualSelection').and.returnValue(of({
      auditUnAssignedClaimsDtoList: [],
      count: 2
    }));
    component.getClaims();
    expect(component.claimLoaded).toBeTruthy();
    expect(component.claimCount).toEqual(2);
  });

  it("should not get claims when form is invalid", () => {
    component.claimForm.reset();
    component.getClaims();
    expect(component.claimLoaded).toBeFalsy();
  });

  it("should get claims - No Response", () => {
    spyOn(service, 'getClaimsForManualSelection').and.returnValue(of(''));
    component.getClaims();
    expect(component.claimLoaded).toBeTruthy();
  });

  it("should get claims - Handle Error", () => {
    spyOn(service, 'getClaimsForManualSelection').and.returnValue(throwError({status: 400}));
    component.getClaims();
    expect(component.claimLoaded).toBeTruthy();
    expect(component.claimCount).toEqual(0);
  });

  it("should add to queue", () => {
    spyOn(service, 'addToTodaysQueue').and.returnValue(of(true));
    component.tableData = [
      {
        name: "Test",
      },
    ];
    component.claimCount = 1;
    component.selectedClaims = [];
    component.addToQueue();
    expect(component.addingToQueue).toBeFalsy();
    expect(component.claimCount).toEqual(1);
  });

  it("should add to queue - Handle Error", () => {
    spyOn(service, 'addToTodaysQueue').and.returnValue(throwError({status: 400}));
    component.addToQueue();
    expect(component.addingToQueue).toBeFalsy();
  });

  it("should get options from data", () => {
    component.tableData = [];
    expect(component.getOptions({field: ''})).toEqual([]);
    component.tableData = [
      {
        name: 'Test'
      },
      {
        name: 'Test-1'
      }
    ];
    expect(component.getOptions({field: 'name'})).toEqual(['Test', 'Test-1']);
  });
});
