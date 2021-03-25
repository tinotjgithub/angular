import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { SsoLoginComponent } from "./sso-login/sso-login.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { MessageService, ConfirmationService } from "primeng/api";

const routes: Routes = [
  { path: "", component: SsoLoginComponent },
  { path: "login", component: SsoLoginComponent },
  {
    path: "logout",
    component: SsoLoginComponent,
  },
];

@NgModule({
  declarations: [SsoLoginComponent],
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class SsoModule {}
