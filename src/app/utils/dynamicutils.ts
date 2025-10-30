import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Dynamicutils {
  DynamicParams(object: any): HttpParams {
    let params = new HttpParams();
    Object.entries(object).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });

    return params;
  }
}
