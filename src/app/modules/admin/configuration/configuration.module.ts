import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './configuration/configuration.component';
import { Routes, RouterModule } from '@angular/router';
import { ManageWorkCategoryComponent } from './manage-work-category/manage-work-category.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: 'pend-reason',
    loadChildren: './../configure-routing/configure-pendreasons/configure-pendreasons.module#ConfigurePendReasonsModule',
    data: {
      breadcrumb: [{label: 'Pend Reason'}]
    }
  },
  {
    path: 'reassign-reason',
    // tslint:disable-next-line: max-line-length
    loadChildren: './../configure-routing/configure-reassignment-reasons/configure-reassignment-reasons.module#ConfigureReassignmentReasonsModule',
    data: {
      breadcrumb: [{label: 'Reassignment Reason'}]
    }
  },
  {
    path: 'route-reason',
    // tslint:disable-next-line: max-line-length
    loadChildren: './../configure-routing/configure-routereasons/configure-routereasons.module#ConfigureRouteReasonsModule',
    data: {
      breadcrumb: [{label: 'Route Reason'}]
    }
  },
  {
    path: 'route-role',
    // tslint:disable-next-line: max-line-length
    loadChildren: './../configure-routing/configure-routeroles/configure-routeroles.module#ConfigureRouteRolesModule',
    data: {
      breadcrumb: [{label: 'Route Options'}]
    }
  },
  {
    path: 'transaction-category',
    // tslint:disable-next-line: max-line-length
    loadChildren: './../configure-routing/configure-transaction-category/configure-transaction-category.module#ConfigureTransactionCategoryModule',
    data: {
      breadcrumb: [{label: 'Transaction Category'}]
    }
  },
  {
    path: 'send-back',
    // tslint:disable-next-line: max-line-length
    loadChildren: './../configure-routing/configure-sendback-reasons/configure-sendback-reasons.module#ConfigureSendbackReasonsModule',
    data: {
      breadcrumb: [{label: 'Send Back'}]
    }
  },
  {
    path: 'work-category',
    component: ManageWorkCategoryComponent,
    data: {
      breadcrumb: [{label: 'Manage Work Category'}]
    }
  }
];

@NgModule({
  declarations: [ConfigurationComponent, ManageWorkCategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CheckboxModule,
    FormsModule
  ]
})
export class ConfigurationModule { }
