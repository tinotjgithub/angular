import { TestBed } from "@angular/core/testing";

import { NotifierService } from "./notifier.service";
import { Subject } from "rxjs";

describe("NotifierService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [NotifierService]
    })
  );

  it("should be created", () => {
    const service: NotifierService = TestBed.get(NotifierService);
    expect(service).toBeTruthy();
  });

  it("should dismiss notification", () => {
    const service: NotifierService = TestBed.get(NotifierService);
    let value;
    service.getNotifierListener().subscribe(val => (value = val));
    service.notifierDismiss();
    expect(value).toBeNull();
  });

  it("getNotifierListener", () => {
    const service: NotifierService = TestBed.get(NotifierService);

    service.notifierListener = new Subject<{ type: string; message: string }>();
    expect(service.getNotifierListener()).toEqual(
      service.notifierListener.asObservable()
    );
  });

  it("throwNotification", () => {
    const service: NotifierService = TestBed.get(NotifierService);
    service.notifierListener = new Subject<{ type: string; message: string }>();
    const spy = spyOn(service.notifierListener, "next");
    service.throwNotification({
      type: "success",
      message: "thrown"
    });
    expect(spy).toHaveBeenCalledWith({
      type: "success",
      message: "thrown"
    });
  });
});
