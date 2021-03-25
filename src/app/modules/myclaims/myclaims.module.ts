import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyClaimsComponent } from './my-claims.component';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
const routes: Routes = [
  {
    path: '',
    component: MyClaimsComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [MyClaimsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    DropdownModule,
    ConfirmDialogModule,
    TooltipModule,
    FormsModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class MyclaimsModule { }
