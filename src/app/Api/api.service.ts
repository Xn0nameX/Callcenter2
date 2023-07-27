import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8081/reports';

  constructor(private http: HttpClient) {}
  getFilteredCalls(params: any): Observable<any> {
    const url = `${this.baseUrl}/filter`;
    return this.http.get<any>(url, { params });
  }

  countFilteredCalls(params: any): Observable<number> {
    const url = `${this.baseUrl}/count`;
    return this.http.get<number>(url, { params });
  }

  uploadReport(file: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, file);
  }

  getReportSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/summary`);
  }

  getClients(): Observable<any> {
    return this.http.get(`${this.baseUrl}/clients`);
  }

  getCallLogTypeResult(): Observable<any> {
    return this.http.get(`${this.baseUrl}/callLogTypeResult`);
  }

  getCallResults(): Observable<any> {
    return this.http.get(`${this.baseUrl}/callResults`);
  }

  getCallTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/callTypes`);
  }

  getEmployees(): Observable<any> {
    return this.http.get(`${this.baseUrl}/employees`);
  }

  getScenario(): Observable<any> {
    return this.http.get(`${this.baseUrl}/scenario`);
  }

  getTags(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tags`);
  }

  getSuccessfulCallsCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/successTypeResult`);
  }
}
