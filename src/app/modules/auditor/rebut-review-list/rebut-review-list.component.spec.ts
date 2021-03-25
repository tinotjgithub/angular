import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebutReviewListComponent } from './rebut-review-list.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { RouterTestingModule } from '@angular/router/testing';
import { ReviewService } from 'src/app/services/review/review.service';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RebutReviewListComponent', () => {
  let component: RebutReviewListComponent;
  let fixture: ComponentFixture<RebutReviewListComponent>;
  let service: ReviewService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebutReviewListComponent ],
      imports: [
        CommonModule,
        TableModule,
        InputTextModule,
        DropdownModule,
        CheckboxModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebutReviewListComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(ReviewService);
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(service, "getRebuttalList").and.returnValue(of(''));
    component.ngOnInit();
    expect(component).toBeTruthy();
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
