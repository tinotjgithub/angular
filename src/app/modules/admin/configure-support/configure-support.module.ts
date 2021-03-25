import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConfigureSupportComponent } from "./configure-support/configure-support.component";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from "primeng/tooltip";
import { ConfirmationService } from "primeng/api";

const routes: Routes = [
  {
    path: "",
    component: ConfigureSupportComponent,
    data: {
      breadcrumb: [{ label: "Support" }]
    }
  }
];

@NgModule({
  declarations: [ConfigureSupportComponent],
  imports: [
    CommonModule,
    CalendarModule,
    TooltipModule,
    RouterModule.forChild(routes),
    FormsModule,
    ConfirmDialogModule,
    ReactiveFormsModule
  ],
  providers: [ConfirmationService]
})
export class ConfigureSupportModule {}
