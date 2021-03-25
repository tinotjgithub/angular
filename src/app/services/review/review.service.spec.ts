import { TestBed } from '@angular/core/testing';

import { ReviewService } from './review.service';
import {  HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReviewService', () => {
  let http: HttpClient;
  let service: ReviewService;
  const windowSetInterval = window.setInterval;
  window.setInterval = function testSetInterval() {
    arguments[0]();
    const id = windowSetInterval.apply(this, arguments);
    return id;
  };
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    service = TestBed.get(ReviewService);
    http = TestBed.get(HttpClient);
    expect(service).toBeTruthy();
  });

  it("should get claim", () => {
    spyOn(http, "get").and.returnValue(of(true));
    let claim;
    service.$claimDetailsListener.subscribe(val => claim = val);
    service.getClaim();
    service.getLeadClaimById(1);
    service.getLeadReviewList();
    service.getManagerReviewList();
    service.getManagerClaimById(1);
    expect(claim).toBeTruthy();
  });

  it("should download file", () => {
    spyOn<any>(service, "getBlob").and.returnValue(of(true));
    expect(service.downloadFile(2)).toBeTruthy();
  });

  describe("Auditor Role", () => {
    beforeAll(() => {
      localStorage.setItem("roleId", "Claims Auditor");
    });

    it("should get claim", () => {
      spyOn(http, "get").and.returnValue(of(true));
      let claim;
      service.$claimDetailsListener.subscribe(val => claim = val);
      service.getClaim();
      expect(claim).toBeTruthy();
    });

    it("should download file", () => {
      spyOn<any>(service, "getBlob").and.returnValue(of(true));
      expect(service.downloadFile(2)).toBeTruthy();
    });

    afterAll(() => {
      localStorage.clear();
    });
  });

  /* it("should upload file and submit", () => {
    spyOn<any>(http, "post").and.returnValue(true);
    expect(service.uploadFileAndSubmit(null)).toBeTruthy();
  });
 */
  it("should able to complete review", () => {
    spyOn<any>(http, "post").and.returnValue(true);
    expect(service.reviewComplete({})).toBeTruthy();
  });

  it("should be able to get rebuutal details with/without id", () => {
    spyOn<any>(http, "get").and.returnValue(true);
    expect(service.getRebuttalById(2)).toBeTruthy();
    expect(service.getRebuttalList()).toBeTruthy();
  });

  it("should start timer", () => {
    service.startTimer(null);
    service.startTimer({endTimer: null});
    service.stopTimer();
    service.startTimer({endTimer: "00:20:45"});
    service.stopTimer();
    service.startTimer({endTimer: "00:63:63"});
    service.stopTimer();
    service.startTimer({endTimer: "00:00:24"});
    service.stopTimer();
    expect(service.endTimer).toEqual("00:00:00");
  });

  it("should upload and delete file", () => {
    spyOn<any>(http, "get").and.returnValue(true);
    spyOn<any>(http, "post").and.returnValue(true);
    expect(service.uploadFile(null)).toBeTruthy();
    expect(service.deleteFile(1, 'attachmentOne')).toBeTruthy();
  });

  it("should submit, pend and rebut", () => {
    spyOn<any>(http, "post").and.returnValue(true);
    expect(service.submitOrPend(null)).toBeTruthy();
    expect(service.rebut(null)).toBeTruthy();
    expect(service.saveClaim(null)).toBeTruthy();
    expect(service.acceptClaim(null)).toBeTruthy();
    expect(service.resubmitClaim(null)).toBeTruthy();
  });
});
