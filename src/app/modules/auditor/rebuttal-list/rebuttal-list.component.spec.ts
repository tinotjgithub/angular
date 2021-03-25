import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebuttalListComponent } from './rebuttal-list.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { AuditorService } from 'src/app/services/auditor/auditor.service';
import { of } from 'rxjs';

describe('RebuttalListComponent', () => {
  let component: RebuttalListComponent;
  let fixture: ComponentFixture<RebuttalListComponent>;
  let service: AuditorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebuttalListComponent ],
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
    fixture = TestBed.createComponent(RebuttalListComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(AuditorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(service, 'getRebuttalList').and.returnValue(of([]));
    expect(component).toBeTruthy();
    component.ngOnInit();
  });

  it('should set columns', () => {
    spyOn(service, 'getRebuttalList').and.returnValue(of([]));
    component.claimsType = 'lead';
    component.setCols();
    component.claimsType = 'manager';
    component.setCols();
    component.claimsType = 'examiner';
    component.setCols();
    expect(component.claimsType).toEqual('examiner');
  });

  it("should get options from data", () => {
    spyOn(service, 'getRebuttalList').and.returnValue(of([]));
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
