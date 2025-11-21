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
import { Profile } from '../Models/Utilisateur/Profile';
import { GenericState } from './type.generic';

type Filter = {
  page: number;
  size: number;
  search: string;
  profileName: string;
};
const initialState: GenericState<Profile, Filter> = {
  data: [
    {
      id: '1',
      label: 'Admnistrateur',
    },
    {
      id: '2',
      label: 'Moderateur',
    },
  ],
  totalPages: 2,
  totalElements: 2,
  message: '',
  isLoading: false,
  filter: {
    page: 0,
    size: 10,
    search: '',
    profileName: '',
  },
  numberOfElements: 0,
  selectedData: null,
  columns: [
    {
      label: 'Profile',
      value: 'label',
      active: true,
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class ProfileStore extends signalStore(
  { providedIn: 'root' }, // <-- This was missing
  withState(initialState),
  withMethods((store, utilisateirService = inject(UtilisateursService)) => ({
    setUsers: (response: Utilisateur[]) => {
      patchState(store, { data: response });
    },

    updateFilter: (filter: Partial<GenericState<Profile, Filter>['filter']>) => {
      patchState(store, {
        filter: {
          ...(store.filter?.() ?? { page: 0, size: 10, search: '', profileName: '' }),
          ...filter,
        },
      });
    },

    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          const { page, size, search, profileName } = store.filter();
          return utilisateirService.fetchAllUtilisateurs({ page, size, search, profileName }).pipe(
            tap((response: BackEndResponse<Profile>) => {
              patchState(store, {
                data: [],
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
                message: response.message,
                numberOfElements: response.data.numberOfElements,
                isLoading: false,
              });
            }),
            catchError((error) => {
              console.error('Error loading profils', error);
              patchState(store, { isLoading: false });
              return EMPTY;
            })
          );
        })
      )
    ),
  }))
) {
  constructor() {
    super();

    effect(() => {
      //   this.loadUsers();
    });
  }
}
