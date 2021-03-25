import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { TooltipModule } from "primeng/tooltip";
import { TableModule } from "primeng/table";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { ConfigureRouterolesComponent } from "./configure-routeroles.component";
import { MessageModule } from "primeng/message";
import { ConfirmationService } from 'primeng/api';

const routes: Routes = [
  {
    path: "",
    component: ConfigureRouterolesComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [ConfigureRouterolesComponent],
  providers: [ConfirmationService],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ConfirmDialogModule,
    CheckboxModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    CardModule,
    MessageModule
  ]
})
export class ConfigureRouteRolesModule {}
