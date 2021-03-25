import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnrollmentLeadLandingPageComponent } from "./components/enrollment-lead-landing-page/enrollment-lead-landing-page.component";
import { Routes, RouterModule } from "@angular/router";
import { TooltipModule } from "primeng/tooltip";
import { GoogleChartsModule } from "angular-google-charts";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";
// tslint:disable-next-line: max-line-length
import { EnrollmentLeadMyTeamStatusDetailComponent } from "./components/enrollment-lead-my-team-status-detail/enrollment-lead-my-team-status-detail.component";
import { TableModule } from "primeng/table";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
// tslint:disable-next-line: max-line-length
import { EnrollmetLeadRoutedInDetailComponent } from "./components/enrollmet-lead-routed-in-detail/enrollmet-lead-routed-in-detail.component";

const routes: Routes = [
  {
    path: "",
    component: EnrollmentLeadLandingPageComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "my-team-status",
    component: EnrollmentLeadMyTeamStatusDetailComponent,
    data: {
      breadcrumb: [{ label: "My Team Status" }]
    }
  },
  {
    path: "routed-in-details",
    component: EnrollmetLeadRoutedInDetailComponent,
    data: {
      breadcrumb: [{ label: "Routed In Queue" }]
    }
  }
];

@NgModule({
  declarations: [
    EnrollmentLeadLandingPageComponent,
    EnrollmentLeadMyTeamStatusDetailComponent,
    EnrollmetLeadRoutedInDetailComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TooltipModule,
    GoogleChartsModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class EnrollmentLeadLandingPageModule {}
