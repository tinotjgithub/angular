import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ManageUsergroupComponent } from "./manage-usergroup/manage-usergroup.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { ConfirmationService, MessageService } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ComponentsModule } from "src/app/shared/components/components.module";

const routes: Routes = [
  {
    path: "",
    component: ManageUsergroupComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [ManageUsergroupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    CardModule,
    AutoCompleteModule,
    ComponentsModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class ManageUsergroupModule {}
