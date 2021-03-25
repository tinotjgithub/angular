import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionsComponent } from './actions/actions.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ActionsComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [ActionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ActionsModule { }
