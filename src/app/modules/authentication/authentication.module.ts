import { NgModule } from "@angular/core";
import { LoginComponent } from "./components/login/login.component";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
const routes = [
  { path: "", component: LoginComponent }
];
@NgModule({
  declarations: [LoginComponent],
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class AuthenticationModule {}
