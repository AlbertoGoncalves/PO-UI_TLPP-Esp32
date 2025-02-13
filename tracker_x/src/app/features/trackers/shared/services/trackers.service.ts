import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tracker } from '../interfaces/tracker.interface';
import { Trackers } from '../interfaces/trackers.interface';
import { rest_client_protheus } from '../../../../core/rest_client/rest_client_protheus';

const API = rest_client_protheus.api_rest + '/api/v1/tracker';


@Injectable({
  providedIn: 'root'
})
export class TrackersService {

  constructor(
    private httpClient: HttpClient
  ) { }

  get(page: number, pageSize: number, filter?: string, fields?: string, sort?: string): Observable<Trackers> {
    const parameters = new HttpParams()
      .append('page', page ? page.toString() : '')
      .append('pageSize', pageSize ? pageSize.toString() : '')
      .append('FILTER', filter ? filter : '')
      .append('FIELDS', fields ? fields : '')
      .append('SORT', sort ? sort : 'code')

    return this.httpClient.get<Trackers>(API, { params: parameters });
  }

  post(body: Tracker): Observable<any> {
    return this.httpClient.post<any>(API, body);
  }

  put(id: string, body: Tracker): Observable<Tracker> {
    console.log(body);
    console.log(id);
    // return this.httpClient.put<Tracker>(`${API}/${id}`, {"filial": "01",
    //   "name": "TESTE08XX",
    //   "status": "003",
    //   "id": "ALOCADOXX"});
    return this.httpClient.put<Tracker>(`${API}/${id}`, body);
  }

  delete(id: string): Observable<Tracker> {
    return this.httpClient.delete<Tracker>(`${API}/${id}`);
  }

  getById(id: string): Observable<Tracker> {
    return this.httpClient.get<Tracker>(`${API}/${id}`);
  }
}
