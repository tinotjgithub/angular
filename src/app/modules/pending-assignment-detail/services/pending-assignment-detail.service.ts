import { Injectable } from "@angular/core";
import { BaseHttpService } from "src/app/services/base-http.service";

@Injectable({
  providedIn: "root"
})
export class PendingAssignmentDetailService {
  constructor(private http: BaseHttpService) {}

  getPendingAssignmentDetails() {
    return this.http.get("api/pend/reassignment/user/detail");
  }
}
