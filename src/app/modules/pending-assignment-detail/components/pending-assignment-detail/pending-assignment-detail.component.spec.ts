import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PendingAssignmentDetailComponent } from "./pending-assignment-detail.component";
import { RouterTestingModule } from "@angular/router/testing";
import { CommonModule } from "@angular/common";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { FormsModule } from "@angular/forms";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { ConfirmationService } from 'primeng/api';

describe("PendingAssignmentDetailComponent", () => {
  let component: PendingAssignmentDetailComponent;
  let fixture: ComponentFixture<PendingAssignmentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PendingAssignmentDetailComponent],
      imports: [
        RouterTestingModule,
        CommonModule,
        TooltipModule,
        DialogModule,
        TableModule,
        FormsModule,
        ConfirmDialogModule,
      ],
      providers: [
        {provide: BaseHttpService, useClass: MockBaseHttpService},
        ConfirmationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingAssignmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
