import { Dynamicutils } from './../utils/dynamicutils';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BackEndResponse, PageableResponse } from '../interfaces/PageableResponse';
import { API_PATHS } from '../environments/apis';
import { Utilisateur } from '../Models/Utilisateur/Utilisateurs';

@Injectable({
  providedIn: 'root',
})
export class UtilisateursService {
  uri = environment.services.users;
  constructor(private http: HttpClient, private Dynamicutils: Dynamicutils) {}

  fetchAllUtilisateurs(filter: any) {
    const params = this.Dynamicutils.DynamicParams(filter);
    return this.http.get<BackEndResponse<Utilisateur>>(`${this.uri}`, { params });
  }

  exportUtilisateurs(filter: any) {
    const params = this.Dynamicutils.DynamicParams(filter);

    return this.http.get(`${this.uri}${API_PATHS.Utilisateurs.export}`, {
      params,
      responseType: 'blob', // Type assertion required by Angular
    });
  }
}
