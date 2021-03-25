import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTableComponent } from './report-table.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('ReportTableComponent', () => {
  let component: ReportTableComponent;
  let fixture: ComponentFixture<ReportTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTableComponent ],
      imports: [
        TableModule,
        RouterModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger download', () => {
    let val = false;
    component.exportExcel.subscribe(value => val = value);
    component.downloadExcel();
    expect(val).toBeTruthy();
  });

  it('on Row Select', () => {
    let value = null;
    component.rowData.subscribe(res => {
      value = res;
    });
    component.onRowSelect('test');
    expect(value).toEqual({event: 'test'});
  });
});
