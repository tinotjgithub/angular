import { Routes, RouterModule } from "@angular/router";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { EnrollmentLandingPageComponent } from "./enrollment-landing-page/enrollment-landing-page.component";
import { ClaimsLandingPageComponent } from "./claims-landing-page/claims-landing-page.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TooltipModule } from "primeng/tooltip";
import { GoogleChartsModule } from "angular-google-charts";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";
const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent,
    data: {
      breadcrumb: []
    }
  }
];
@NgModule({
  declarations: [
    LandingPageComponent,
    EnrollmentLandingPageComponent,
    ClaimsLandingPageComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TooltipModule,
    GoogleChartsModule,
    DialogModule,
    DropdownModule,
    ComponentsModule,
    MessageModule,
    MessagesModule,
    FormsModule,
    TableModule,
    ReactiveFormsModule,
    ConfirmDialogModule
  ],
  exports: [],
  providers: [ConfirmationService, MessageService]
})
export class LandingPageModule {}
