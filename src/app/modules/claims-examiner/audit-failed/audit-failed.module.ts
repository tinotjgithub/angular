import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from "primeng/tooltip";
import { AutoCompleteModule } from "primeng/autocomplete";
import { AuditFailedComponent } from "./components/audit-failed/audit-failed.component";
import { RadioButtonModule } from "primeng/radiobutton";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { CanDeactivateGuard } from "src/app/guards/route.guard/can-deactivate.gaurd";
import { ConfirmationService } from "primeng/api";
import {TabViewModule} from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
const routes: Routes = [
  {
    path: "",
    component: AuditFailedComponent,
    data: {
      breadcrumb: []
    },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: "/audit-failed",
    component: AuditFailedComponent,
    data: {
      breadcrumb: []
    },
    canDeactivate: [CanDeactivateGuard]
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
    CommonModule,
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
    TabViewModule,
    AccordionModule
  ],
  providers: [ConfirmationService]
})
export class AuditFailedModule {}
