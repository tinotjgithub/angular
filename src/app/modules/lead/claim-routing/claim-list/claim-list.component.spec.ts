import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ClaimListComponent } from "./claim-list.component";
import { RouterTestingModule } from "@angular/router/testing";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MessageService, ConfirmationService } from "primeng/api";
import { ClaimRoutingService } from "../claim-routing.service";
import { of } from "rxjs";
import { Router } from "@angular/router";
import { BaseHttpService } from "src/app/services/base-http.service";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
import { RouteClaimOverlayComponent } from "./../route-claim-overlay/route-claim-overlay.component";

describe("ClaimListComponent", () => {
  let component: ClaimListComponent;
  let fixture: ComponentFixture<ClaimListComponent>;
  let service: ClaimRoutingService;
  const router = {
    navigate: jasmine.createSpy("navigate")
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimListComponent, RouteClaimOverlayComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        NgbModule,
        DialogModule,
        TooltipModule,
        ConfirmDialogModule,
        DropdownModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        MessageService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        ConfirmationService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ClaimListComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(ClaimRoutingService);
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimListComponent);
    service = fixture.debugElement.injector.get(ClaimRoutingService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Claim List Loaded", async(() => {
    const userGroups = [
      {
        claimId: "2019101500000250",
        taskId: 7,
        receivedDate: "10/15/2019",
        age: 142,
        queueName: "Itemized Bill WB",
        routeFrom: "Devika Kumari",
        routeDate: "12/02/2019",
        routeReason: "Incorrect Assignment",
        comments: "Test24",
        endTimer: "10:10:10"
      }
    ];
    const spy = spyOn(service, "routedClaimListListener").and.returnValue(
      of(userGroups)
    );
    component.getRoutedClaims();
    expect(component.routedClaimList).toEqual(userGroups);
  }));

  it("ClaimRouting called", () => {
    component.onRowEditInit(true);
    expect(component.openEdit).toBeTruthy();
    expect(component.editData).toBeTruthy();
  });
});
