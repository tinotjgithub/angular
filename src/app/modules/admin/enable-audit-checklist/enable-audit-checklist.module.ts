import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnableAuditChecklistComponent } from "./components/enable-audit-checklist/enable-audit-checklist.component";
import { Routes, RouterModule } from "@angular/router";
import { InputSwitchModule } from "primeng/inputswitch";
import { CheckboxModule } from "primeng/checkbox";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NotificationModule } from "../notification/notification.module";
import { NotifierService } from "src/app/services/notifier.service";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
const routes: Routes = [
  {
    path: "",
    component: EnableAuditChecklistComponent,
    data: {
      breadcrumb: [{ label: "Configure Audit Checkllist" }]
    }
  }
];

@NgModule({
  declarations: [EnableAuditChecklistComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputSwitchModule,
    CheckboxModule,
    NotificationModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService]
})
export class EnableAuditChecklistModule {}
