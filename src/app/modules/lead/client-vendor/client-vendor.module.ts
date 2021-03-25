import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details/details.component';
import { TableModule } from 'primeng/table';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const route: Routes = [
  {
    path: '',
    component: DetailsComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule,
    TableModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ClientVendorModule { }
