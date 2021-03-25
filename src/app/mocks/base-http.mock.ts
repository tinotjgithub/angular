import { Observable, of } from "rxjs";
export class MockBaseHttpService {
  constructor() {}

  public get(segment?: string, parameters?: any): Observable<any> {
    return of();
  }

  public post(item, segment?: string, options?: object): Observable<any> {
    return of();
  }

  public delete(url: number): Observable<any> {
    return of();
  }

  public getExcel(item, segment?: string): Observable<any> {
    return of({body: 'success'});
  }

  public getBlob(segment: string) {
    return of({body: 'success'});
  }

  public callHealthEdge(segment?: string): Observable<any> {
    return of();
  }

  public updateServerUrl(url) {
    console.log(url);
  }
}
