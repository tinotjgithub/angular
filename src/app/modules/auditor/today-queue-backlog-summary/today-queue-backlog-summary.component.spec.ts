import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayQueueBacklogSummaryComponent } from './today-queue-backlog-summary.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { AuditorService } from 'src/app/services/auditor/auditor.service';
import { of } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

describe('TodayQueueBacklogSummaryComponent', () => {
  let component: TodayQueueBacklogSummaryComponent;
  let fixture: ComponentFixture<TodayQueueBacklogSummaryComponent>;
  let service: AuditorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodayQueueBacklogSummaryComponent ],
      imports: [
        CommonModule,
        TableModule,
        HttpClientTestingModule,
        RouterTestingModule,
        DialogModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodayQueueBacklogSummaryComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(AuditorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(service, "getQueueDetails").and.returnValue(of(''));
    component.ngOnInit();
    component.toggleDelete(true);
    expect(component).toBeTruthy();
  });

  it("should set columns for backlog", () => {
    spyOn(service, "getQueueDetails").and.returnValue(of(true));
    component.claimsType = "backlog";
    component.setCols();
    expect(component.cols.length).toEqual(17);
  });

  it("should get options from data", () => {
    spyOn(service, "getQueueDetails").and.returnValue(of(true));
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

  it("should delete claims", () => {
    spyOn(service, "deleteQueueDetails").and.returnValue(of([]));
    spyOn(service, "getQueueDetails").and.returnValue(of(true));
    component.selectedClaims = [{
      taskId: 1
    }];
    component.deleteClaimFromQueue();
    expect(component.selectedClaims).toEqual([]);
  });
});
