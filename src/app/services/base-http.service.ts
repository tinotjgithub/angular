import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APP_CONFIG } from './config/config.service';

/**
 * Name: BaseHttpService
 * params: HttpClient
 * params: basePath
 * desc: All the generic services are hooked on to this service.
 */
@Injectable()
export class BaseHttpService {

  private serverUrl = APP_CONFIG.SERVER_API_URL;
  constructor(
    private httpClient: HttpClient
  ) {}

  public get(segment?: string, parameters?: any): Observable<any> {
    return this.httpClient.get(
      `${this.serverUrl}${segment ? "/" + segment : ""}`,
      { params: parameters }
    );
  }

  public post(item, segment?: string, options?: object): Observable<any> {
    return this.httpClient.post(
      `${this.serverUrl}${segment ? "/" + segment : ""} `,
      item,
      options
    );
  }

  public delete(url: number): Observable<any> {
    return this.httpClient.delete(`${this.serverUrl}${url}`);
  }

  public getExcel(item, segment?: string): Observable<any> {
    return this.httpClient.post(
      `${this.serverUrl}${segment ? "/" + segment : ""} `,
      item,
      {
        observe: "response",
        responseType: "blob"
      }
    );
  }

  public getBlob(segment: string) {
    return this.httpClient.get(`${this.serverUrl}/${segment}`, {
      observe: "response",
      responseType: "blob"
    });
  }

  public callHealthEdge(segment?: string): Observable<any> {
    return this.httpClient.get(
      `${APP_CONFIG.HEALTH_EDGEURL}${segment ? "/" + segment : ""}`
    );
  }

  updateServerUrl(url) {
    this.serverUrl = url || APP_CONFIG.SERVER_API_URL;
  }
}
