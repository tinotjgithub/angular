import { Injectable } from "@angular/core";
import { Subject } from "rxjs";import { environment } from "src/environments/environment";
import { BaseHttpService } from "./../../../../../services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from 'src/app/services/config/config.service';

@Injectable({
  providedIn: "root"
})
export class EnrollmentAuditService extends BaseHttpService {
  requestTypeResponse: any;
  requestTypeFetch = new Subject<any>();
  transactionStrategyResponse: any;
  transactionStrategyFetch = new Subject<any>();

  constructor(
    private http: HttpClient,
    public baseHTTPService: BaseHttpService
  ) {
    super(http);
    this.updateServerUrl(APP_CONFIG.AUDITOR_SERVER_URL);
  }

  getTransactionStrategyListner() {
    return this.transactionStrategyFetch.asObservable();
  }

  getRequestTypeListner() {
    return this.requestTypeFetch.asObservable();
  }

  getRequestType() {
    this.baseHTTPService.get("api/enrollment-audit/request-type").subscribe(
      (data: any) => {
        this.requestTypeResponse = data;
        this.requestTypeFetch.next(this.requestTypeResponse);
      },
      error => {
        this.requestTypeResponse = [];
        return;
      }
    );
  }

  getTransactionStrategy() {
    this.baseHTTPService
      .get("api/enrollment-audit/transaction-category")
      .subscribe(
        (data: any) => {
          this.transactionStrategyResponse = data;
          this.transactionStrategyFetch.next(this.transactionStrategyResponse);
        },
        error => {
          this.transactionStrategyResponse = [];
          return;
        }
      );
  }
}
