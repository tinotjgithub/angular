import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationMenuComponent } from './configuration-menu/configuration-menu.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationMenuComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [ConfigurationMenuComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ConfigurationModule { }
