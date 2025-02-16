
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Packages } from '../interfaces/packages.interface';
import { Package } from '../interfaces/package.interface';
import { rest_client_protheus } from '../../../../core/rest_client/rest_client_protheus';

const API = rest_client_protheus.api_rest + '/api/v1/package';

// 1. Operadores de Comparação
// eq: Igual a
// Exemplo: name eq 'John'
// ne: Diferente de
// Exemplo: age ne 30
// gt: Maior que
// Exemplo: age gt 25
// ge: Maior ou igual a
// Exemplo: age ge 18
// lt: Menor que
// Exemplo: price lt 100
// le: Menor ou igual a
// Exemplo: price le 50

@Injectable({
  providedIn: 'root'
})
export class PackagesService {

  constructor(
    private httpClient: HttpClient
  ) { }

  get(page: number, pageSize: number, filter?: string, fields?: string, sort?: string): Observable<Packages> {
    const parameters = new HttpParams()
      .append('page', page ? page.toString() : '')
      .append('pageSize', pageSize ? pageSize.toString() : '')
      .append('filter', filter ? filter : '')
      .append('FIELDS', fields ? fields : '')
      .append('SORT', sort ? sort : 'code')
      // console.log(parameters);
    return this.httpClient.get<Packages>(API, { params: parameters });
  }

  post(body: Package): Observable<any> {
    return this.httpClient.post<any>(API, body);
  }

  put(id: string, body: Package): Observable<Package> {
    console.log(body);
    console.log(id);
    return this.httpClient.put<Package>(`${API}/${id}`, body);
  }

  putInTracker(body: Array<any>): Observable<any> {
    console.log(body);
    // return this.httpClient.put<Package>(`${API}/${id}`, {"filial": "01",
    //   "name": "TESTE08XX",
    //   "status": "003",
    //   "id": "ALOCADOXX"});
    return this.httpClient.put<Package>(`${API}/trackers`, { "packages": body});
  }


  delete(id: string): Observable<Package> {
    return this.httpClient.delete<Package>(`${API}/${id}`);
  }

  getById(id: string): Observable<Package> {
    return this.httpClient.get<Package>(`${API}/${id}`);
  }
}
