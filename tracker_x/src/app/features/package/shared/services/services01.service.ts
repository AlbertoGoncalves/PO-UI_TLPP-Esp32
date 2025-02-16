import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { PoLookupFilter, PoLookupFilteredItemsParams } from '@po-ui/ng-components';
import { rest_client_protheus } from '../../../../core/rest_client/rest_client_protheus';

const API = rest_client_protheus.api_rest + '/api/v1/tracker';

@Injectable()
export class Services01Service implements PoLookupFilter {
  constructor(private httpClient: HttpClient) {}

  getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
    const { filterParams, advancedFilters, ...restFilteredItemsParams } = filteredParams;

    // Tratamento de filtro para rest protheus filtro pelo codigo
    if (restFilteredItemsParams.filter != '') {
      restFilteredItemsParams.filter = `status eq '002' and code eq '${restFilteredItemsParams.filter}'` ;
      // console.log(restFilteredItemsParams)

    }else{
      restFilteredItemsParams.filter = `status eq '002'` ;
    }

    const params = { ...restFilteredItemsParams, ...filterParams, ...advancedFilters };
    // console.log("getFilteredItemsX")
    // console.log(params)
    return this.httpClient.get(API, { params: params });
  }


  getObjectByValue(id: string): Observable<any[]> {
    console.log("getObjectByValue");
    return this.httpClient.get(`${API}/${id}`).pipe(
      map((response: any) => {
        console.log("getObjectByValue");
        if ('code' in response) {
          return response;
        }
        return {code: ''};
      }),
      catchError((error) => {
        console.error('Erro na chamada GET:', error);
        return throwError(() => new Error('Erro ao buscar objetos pelo valor.'));
      })
    );
  }
}
