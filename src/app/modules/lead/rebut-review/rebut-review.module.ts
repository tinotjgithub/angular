import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RebutReviewComponent } from './rebut-review/rebut-review.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/guards/route.guard/can-deactivate.gaurd';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';

const routes: Routes = [
  {
    path: '',
    component: RebutReviewComponent,
    data: {
      breadcrumb: [{ label: "Audit Rebuttal/Review" }]
    },
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  declarations: [RebutReviewComponent],
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    ComponentsModule,
    ButtonModule,
    PickListModule,
    ConfirmDialogModule,
    CheckboxModule,
    DialogModule,
    TabViewModule,
    RadioButtonModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    ConfirmationService
  ]
})
export class RebutReviewModule { }
