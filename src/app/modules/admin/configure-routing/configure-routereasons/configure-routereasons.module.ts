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
import { MessageModule } from "primeng/message";
import { ButtonModule } from "primeng/button";
import { ConfigureRoutereasonsComponent } from "./configure-routereasons.component";
import { ConfirmationService } from 'primeng/api';

const routes: Routes = [
  {
    path: "",
    component: ConfigureRoutereasonsComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [ConfigureRoutereasonsComponent],
  providers: [ConfirmationService],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MessageModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    CardModule
  ]
})
export class ConfigureRouteReasonsModule {}
