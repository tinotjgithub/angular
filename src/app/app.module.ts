import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { ConfirmDialogModule } from "primeng/confirmdialog";

import { ToastModule } from "primeng/toast";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavigationBarComponent } from "./components/navigation-bar/navigation-bar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./services/auth/auth.interceptor";
import { BaseHttpService } from "./services/base-http.service";
import { DatePipe } from "@angular/common";
import { ToastComponent } from "./components/toast.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SidebarModule } from "primeng/sidebar";
import { PanelMenuModule } from "primeng/panelmenu";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ErrorInterceptorService } from "./services/error-interceptor.service";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { ComponentsModule } from "./shared/components/components.module";
import { MessageService } from "primeng/api";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { AppConfigService } from './services/config/config.service';
import { BnNgIdleService } from 'bn-ng-idle';

/**
* Exported function so that it works with AOT
* @param {AppConfigService} configService
* @returns {Function}
*/
export function loadConfigService(configService: AppConfigService): Function 

{
  return () => { return configService.load() }; 
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavigationBarComponent,
    ToastComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ProgressSpinnerModule,
    ToastModule,
    SidebarModule,
    PanelMenuModule,
    BreadcrumbModule,
    OverlayPanelModule,
    MessagesModule,
    MessageModule,
    ComponentsModule,
    TooltipModule,
    DialogModule,
    ConfirmDialogModule
  ],
  providers: [
    AppConfigService,
    { provide: APP_INITIALIZER, useFactory: loadConfigService , deps: [AppConfigService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    },
    BaseHttpService,
    DatePipe,
    MessageService,
    BnNgIdleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
