import { CheckboxModule } from "primeng/checkbox";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { CanDeactivateGuard } from "src/app/guards/route.guard/can-deactivate.gaurd";
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
import { ConfirmationService } from "primeng/api";
import { TabViewModule } from "primeng/tabview";
import { AccordionModule } from "primeng/accordion";
import { EnrollmentRebutReviewComponent } from "./components/enrollment-rebut-review/enrollment-rebut-review.component";
import { RebutReviewDetailComponent } from "./components/rebut-review-detail/rebut-review-detail.component";
import { DetailTableComponent } from "./components/detail-table/detail-table.component";

const routes: Routes = [
  {
    path: "",
    component: EnrollmentRebutReviewComponent,
    data: {
      breadcrumb: [{ label: "Audit Rebuttal/Review" }]
    },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: "enrollment-rebut-review-detail",
    component: RebutReviewDetailComponent,
    data: {
      breadcrumb: [{ label: "Audit Rebuttal/Review Details" }]
    },
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  declarations: [
    EnrollmentRebutReviewComponent,
    RebutReviewDetailComponent,
    DetailTableComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    ComponentsModule,
    ButtonModule,
    PickListModule,
    ConfirmDialogModule,
    DialogModule,
    RadioButtonModule,
    TabViewModule,
    RouterModule.forChild(routes),
    AccordionModule,
    CheckboxModule
  ],
  providers: [ConfirmationService]
})
export class EnrollmentRebutReviewModule {}
