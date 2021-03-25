import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditFailedComponent } from './audit-failed/audit-failed.component';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmationService } from 'primeng/api';

const routes: Routes = [
  {
    path: '',
    component: AuditFailedComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [AuditFailedComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CalendarModule,
    DialogModule,
    TooltipModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    ConfirmDialogModule,
    CheckboxModule,
    AutoCompleteModule,
    RadioButtonModule,
    OverlayPanelModule,
  ],
  providers: [ConfirmationService]
})
export class AuditFailedModule { }
