import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { FieldsetModule } from "primeng/fieldset";
import { AccordionModule } from "primeng/accordion";
import { CardModule } from "primeng/card";
import { ChipsModule } from "primeng/chips";
import { ReactiveFormsModule } from "@angular/forms";
import { PickListModule } from "primeng/picklist";
import { CalendarModule } from "primeng/calendar";
import { InputTextModule } from "primeng/inputtext";
import { AutoSamplingComponent } from "./components/auto-sampling/auto-sampling.component";
import { ButtonModule } from "primeng/button";
const routes: Routes = [
  {
    path: "",
    component: AutoSamplingComponent,
    data: {
      breadcrumb: []
    }
  }
];

@NgModule({
  declarations: [AutoSamplingComponent],
  imports: [
    RouterModule.forChild(routes),
    FieldsetModule,
    CommonModule,
    CheckboxModule,
    FormsModule,
    AccordionModule,
    CardModule,
    ChipsModule,
    PickListModule,
    CalendarModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule
  ]
})
export class AutoSamplingModule {}
