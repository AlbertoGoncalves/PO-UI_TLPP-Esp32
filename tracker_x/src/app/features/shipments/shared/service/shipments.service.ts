import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { rest_client_protheus } from '../../../../core/rest_client/rest_client_protheus';
import { Shipments } from '../interfaces/shipments.interface';
import { Shipment } from '../interfaces/shipment.interface';

const API = rest_client_protheus.api_rest + '/api/v1/shipment';


@Injectable({
  providedIn: 'root'
})
export class ShipmentsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  get(page: number, pageSize: number, filter?: string, fields?: string, sort?: string): Observable<Shipments> {
    const parameters = new HttpParams()
      .append('page', page ? page.toString() : '')
      .append('pageSize', pageSize ? pageSize.toString() : '')
      .append('filter', filter ? filter : '')
      .append('FIELDS', fields ? fields : '')
      .append('SORT', sort ? sort : 'code')
      // console.log(parameters);
    return this.httpClient.get<Shipments>(API, { params: parameters });
  }

  post(body: Shipment): Observable<any> {
    return this.httpClient.post<any>(API, body);
  }

  put(id: string, body: Shipment): Observable<Shipment> {
    // console.log(body);
    // console.log(id);
    // return this.httpClient.put<Shipment>(`${API}/${id}`, {"filial": "01",
    //   "name": "TESTE08XX",
    //   "status": "003",
    //   "id": "ALOCADOXX"});
    return this.httpClient.put<Shipment>(`${API}/${id}`, body);
  }

  delete(id: string): Observable<Shipment> {
    return this.httpClient.delete<Shipment>(`${API}/${id}`);
  }

  getById(id: string): Observable<Shipment> {
    return this.httpClient.get<Shipment>(`${API}/${id}`);
  }
}
