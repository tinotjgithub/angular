import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { CommonModule } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { MultiSelectModule } from "primeng/multiselect";
import { TooltipModule } from "primeng/tooltip";
import { MessageService } from "primeng/api";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ButtonModule } from "primeng/button";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { PaginatorModule } from "primeng/paginator";
import { CheckboxModule } from "primeng/checkbox";
import { TemplateConfigurationComponent } from "./template-configuration.component";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { CreateTemplateConfigurationComponent } from "./create-template-configuration/create-template-configuration.component";
import { MappingFieldsComponent } from "./mapping-fields/mapping-fields.component";

const routes: Routes = [
  {
    path: "",
    component: TemplateConfigurationComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "template-configuration",
    component: TemplateConfigurationComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "CreateTemplate",
    component: CreateTemplateConfigurationComponent,
    data: {
      breadcrumb: [{ label: "Create Template" }]
    }
  },
  {
    path: "EditTemplate",
    component: CreateTemplateConfigurationComponent,
    data: {
      breadcrumb: [{ label: "Edit Template" }]
    }
  }
];

@NgModule({
  declarations: [
    TemplateConfigurationComponent,
    CreateTemplateConfigurationComponent,
    MappingFieldsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    ProgressSpinnerModule,
    ButtonModule,
    ConfirmDialogModule,
    ComponentsModule,
    PaginatorModule,
    ReactiveFormsModule,
    TableModule,
    CommonModule,
    CalendarModule,
    DialogModule,
    CheckboxModule,
    TooltipModule,
    MultiSelectModule
  ],
  providers: [MessageService, ConfirmationService],
  exports: [
    TemplateConfigurationComponent,
    CreateTemplateConfigurationComponent
  ]
})
export class TemplateConfigurationModule {}
