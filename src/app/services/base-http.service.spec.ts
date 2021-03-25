import { TestBed } from "@angular/core/testing";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClient } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("BaseHttpService", () => {
  let http: HttpClient;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BaseHttpService]
    })
  );

  beforeEach(() => {
    http = TestBed.get(HttpClient);
    spyOn<any>(http, "get").and.returnValue(true);
    spyOn<any>(http, "post").and.returnValue(true);
    spyOn<any>(http, "delete").and.returnValue(true);
  });

  it("should be created", () => {
    const service: BaseHttpService = TestBed.get(BaseHttpService);
    service.updateServerUrl("");
    expect(service).toBeTruthy();
  });

  it("should get data with segement", () => {
    const service: BaseHttpService = TestBed.get(BaseHttpService);
    expect(service.get("test")).toBeTruthy();
    expect(service.post({}, "test")).toBeTruthy();
    expect(service.delete(1)).toBeTruthy();
    expect(service.getExcel({}, "test")).toBeTruthy();
    expect(service.getBlob("test")).toBeTruthy();
    expect(service.callHealthEdge("test")).toBeTruthy();
  });

  it("should get data without segement", () => {
    const service: BaseHttpService = TestBed.get(BaseHttpService);
    expect(service.get()).toBeTruthy();
    expect(service.post({})).toBeTruthy();
    expect(service.getExcel({})).toBeTruthy();
    expect(service.callHealthEdge()).toBeTruthy();
  });
});
