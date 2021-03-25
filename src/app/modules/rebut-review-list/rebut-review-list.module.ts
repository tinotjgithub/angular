import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RebutReviewListComponent } from './rebut-review-list/rebut-review-list.component';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

const routes = [
  {
    path: '',
    component: RebutReviewListComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [RebutReviewListComponent],
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    CheckboxModule,
    RouterModule.forChild(routes)
  ]
})
export class RebutReviewListModule { }
