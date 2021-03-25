import { Routes, RouterModule } from "@angular/router";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GoogleChartsModule } from "angular-google-charts";
import { TooltipModule } from "primeng/tooltip";
import { ComponentsModule } from "./../../../shared/components/components.module";

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
  declarations: [LandingPageComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TooltipModule,
    ComponentsModule,
    GoogleChartsModule
  ]
})
export class LandingPageModule {}
