import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { DetailsComponent } from "./details/details.component";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { GoogleChartsModule } from 'angular-google-charts';

const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "queue",
    component: DetailsComponent,
    data: {
      breadcrumb: [{ label: "Queue Summary" }]
    }
  },
  {
    path: "work-category",
    loadChildren: "./work-category/work-category.module#WorkCategoryModule",
    data: {
      breadcrumb: [{ label: "Work Category", routerLink: '/specialist/work-category', updateParam: 'type' }]
    }
  }
];

@NgModule({
  declarations: [LandingPageComponent, DetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    DialogModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule,
    ReactiveFormsModule,
    ComponentsModule,
    GoogleChartsModule
  ],
  providers: [ConfirmationService]
})
export class SpecialistModule {}
