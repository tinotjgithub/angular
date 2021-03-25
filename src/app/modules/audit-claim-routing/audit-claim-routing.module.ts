import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { CanDeactivateGuard } from "src/app/guards/route.guard/can-deactivate.gaurd";
import { AuditRoutedInDetailComponent } from "./components/audit-routed-in-detail/audit-routed-in-detail.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { AuditRouteOutComponent } from "./components/audit-route-out/audit-route-out.component";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { TableModule } from "primeng/table";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { CheckboxModule } from "primeng/checkbox";
import { AutoCompleteModule } from "primeng/autocomplete";
import { RadioButtonModule } from "primeng/radiobutton";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { TabViewModule } from "primeng/tabview";
import { ConfirmationService } from "primeng/api";

const routes: Routes = [
  {
    path: "",
    component: AuditRouteOutComponent,
    data: {
      breadcrumb: []
    },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: "list",
    component: AuditRoutedInDetailComponent,
    data: {
      breadcrumb: [
        { label: "Routed In" },
      ]
    },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: "audit-route-out",
    component: AuditRouteOutComponent,
    data: {
      breadcrumb: []
    },
    canDeactivate: [CanDeactivateGuard]
  }
];
@NgModule({
  declarations: [AuditRoutedInDetailComponent, AuditRouteOutComponent],
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
    TabViewModule
  ],
  providers: [ConfirmationService]
})
export class AuditClaimRoutingModule {}
