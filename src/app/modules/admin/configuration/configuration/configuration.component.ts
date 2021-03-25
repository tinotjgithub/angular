import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit {
  public adminType: string;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.adminType = this.authService.adminType;
  }

}
