import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PoLookupFilter, PoLookupFilteredItemsParams } from '@po-ui/ng-components';

@Injectable()
export class PackageTesteService implements PoLookupFilter {
  private url = 'https://po-sample-api.onrender.com/v1/heroes';

  constructor(private httpClient: HttpClient) {}

  getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
    console.log("getFilteredItems")
    const { filterParams, advancedFilters, ...restFilteredItemsParams } = filteredParams;
    const params = { ...restFilteredItemsParams, ...filterParams, ...advancedFilters };
    console.log(params)
    console.log(advancedFilters)
    console.log(filterParams)
    console.log(restFilteredItemsParams)
    return this.httpClient.get(this.url, { params });
  }

  getObjectByValue(value: string): Observable<any> {
    console.log("getObjectByValue")
    return this.httpClient.get(`${this.url}/${value}`);
  }
}
