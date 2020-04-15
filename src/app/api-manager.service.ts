import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum API_MODE {
   OPEN = 'open',
   CLOSED = 'closed'
};
export enum API_METHOD {
  GET = 'get',
  UPDATE = 'update',
  CREATE = 'create'
};

@Injectable({
  providedIn: 'root'
})
export class ApiManagerService {
  private endPoint = "https://h0jg4s8gpa.execute-api.eu-central-1.amazonaws.com/v1";


  constructor(private http: HttpClient) { }

  get(mode: API_MODE, method: API_METHOD, restOfPath: string, params: HttpParams): Observable<Object>{
    let header = new HttpHeaders();
    header.append('Authorization', null);
    
    let resp = this.http.get(`${this.endPoint}/${mode}/${method}/${restOfPath}`, {
      params: params,
      headers: header
    })
    return resp;
  }

  post(mode: API_MODE, method: API_METHOD, restOfPath: string, params: HttpParams, body : any): Observable<Object>{
    let header = new HttpHeaders();
    
    let resp = this.http.post(`${this.endPoint}/${mode}/${method}/${restOfPath}`, JSON.stringify(body), {
        headers: header,
    });

    return resp;
  }
}
