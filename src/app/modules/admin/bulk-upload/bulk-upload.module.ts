import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TooltipModule } from "primeng/tooltip";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { ButtonModule } from "primeng/button";
import { PickListModule } from "primeng/picklist";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { RadioButtonModule } from "primeng/radiobutton";
import { TabViewModule } from "primeng/tabview";
import { AccordionModule } from "primeng/accordion";
import { BulkUploadComponent } from "./bulk-upload.component";

const routes: Routes = [
  {
    path: "",
    component: BulkUploadComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [BulkUploadComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    ButtonModule,
    TabViewModule,
    PickListModule,
    AccordionModule,
    TableModule,
    TooltipModule,
    RadioButtonModule
  ]
})
export class BulkUploadModule {}
