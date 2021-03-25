import { TestBed } from "@angular/core/testing";
import { ConfigurationService } from "./configuration.service";
import { BaseHttpService } from "../base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("ConfigurationService", () => {
  let http: BaseHttpService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigurationService, BaseHttpService],
    })
  );

  beforeEach(() => {
    http = TestBed.get(BaseHttpService);
    spyOn<any>(http, "post").and.returnValue(true);
  });

  it("should be created", () => {
    const service: ConfigurationService = TestBed.get(ConfigurationService);
    expect(service).toBeTruthy();
  });

  it("should send the notification", () => {
    const service: ConfigurationService = TestBed.get(ConfigurationService);
    expect(service.sendNotification({})).toBeTruthy();
  });

  it("should send the data now", () => {
    const service: ConfigurationService = TestBed.get(ConfigurationService);
    expect(service.sendNow({})).toBeTruthy();
  });
});
