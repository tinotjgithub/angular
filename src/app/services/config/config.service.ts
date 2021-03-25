import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { throwError } from "rxjs";

export class AppConfig {
  readonly SERVER_API_URL: string;
  readonly ENROLLMENT_SERVER_URL: string;
  readonly AUDITOR_SERVER_URL: string;
  readonly ENROLLMENT_AUDITOR_SERVER_URL: string;
  readonly HEALTH_EDGEURL: string;
  readonly LOGIN_OPTION: string;
  readonly ENTITY_ID: string;
}

export let APP_CONFIG: AppConfig;
@Injectable()
export class AppConfigService {
  constructor() {}

  public load() {
    return new Promise((resolve, reject) => {
      let confName = environment.config + ".json";
      fetch("./../../../config/" + confName)
        .then(res => res.json())
        .then((envResponse: any) => {
          let t = new AppConfig();
          APP_CONFIG = Object.assign(t, envResponse);
          resolve(true);
        })
        .catch(err => {
          reject(true);
          return throwError("Server error");
        });
    });
  }

  public loadForTest() {
    return new Promise((resolve, reject) => {
      let t = new AppConfig();
      APP_CONFIG = Object.assign(t, {
        SERVER_API_URL: "http://localhost:8081",
        AUDITOR_SERVER_URL: "http://localhost:8083",
        ENROLLMENT_AUDITOR_SERVER_URL: "http://localhost:8087",
        HEALTH_EDGEURL: "http://localhost:9090",
        LOGIN_OPTION: "local",
        ENTITY_ID: "http://www.okta.com/exkqm6812s0I89ml50h7"
      });
      resolve(true);
    });
  }
}
