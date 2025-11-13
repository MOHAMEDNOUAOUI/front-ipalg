import { effect, inject, Injectable } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Utilisateur } from '../Models/Utilisateur/Utilisateurs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  finalize,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { UtilisateursService } from '../services/UtilisateursService';
import { BackEndResponse, PageableResponse } from '../interfaces/PageableResponse';
import { GenericState } from './type.generic';


type Filter = {
  page: number;
  size: number;
  search: string;
  label: string;
};
const initialState: GenericState<any,Filter> = {
  data: [
      {
      id: 1,
      label: 'Admnistrateur',
      description: 'test description',
      permissionsCount: 5,
      utilisateursCount: 2,
      createdBy: 'Admin',
      dateDeModification: new Date(),
    },
    {
      id: 2,
      label: 'Moderateur',
      description: 'test description',
      permissionsCount: 2,
      utilisateursCount: 10,
      createdBy: 'Admin',
      dateDeModification: new Date(),
    },
  ],
  totalPages: 0,
  totalElements: 0,
  message: '',
  isLoading: false,
  filter: {
    page: 0,
    size: 10,
    search: '',
    label: '',
  },
  numberOfElements: 0,
  selectedData: null,
};

@Injectable({ providedIn: 'root' })
export class CategorieStore extends signalStore(
  { providedIn: 'root' }, // <-- This was missing
  withState(initialState),
  //update the service to categorieservice 
  withMethods((store, utilisateirService = inject(UtilisateursService)) => ({
    setUsers: (response: Utilisateur[]) => {
      patchState(store, { data: response });
    },

    updateFilter: (filter: Partial<GenericState<Utilisateur,Filter>['filter']>) => {
      patchState(store, {
        filter: {
          ...(store.filter?.() ?? { page: 0, size: 10, search: '', label: '' }),
          ...filter,
        },
      });
    },

  
  }))
) {
  constructor() {
    super();

    effect(() => {
      
    });
  }
}
