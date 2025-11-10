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

type UserState = {
  data: Utilisateur[];
  totalPages: number;
  totalElements: number;
  message: string;
  isLoading: boolean;
  filter: {
    page: number;
    size: number;
    search: string;
    username: string;
  };
  numberOfElements: number;
  selectedUtilisateur: Utilisateur | null;
};
const initialState: UserState = {
  data: [],
  totalPages: 0,
  totalElements: 0,
  message: '',
  isLoading: false,
  filter: {
    page: 0,
    size: 10,
    search: '',
    username: '',
  },
  numberOfElements: 0,
  selectedUtilisateur: null,
};

@Injectable({ providedIn: 'root' })
export class UsersStore extends signalStore(
  { providedIn: 'root' }, // <-- This was missing
  withState(initialState),
  withMethods((store, utilisateirService = inject(UtilisateursService)) => ({
    setUsers: (response: Utilisateur[]) => {
      patchState(store, { data: response });
    },

    updateFilter: (filter: Partial<UserState['filter']>) => {
      patchState(store, {
        filter: {
          ...(store.filter?.() ?? { page: 0, size: 10, search: '', username: '' }),
          ...filter,
        },
      });
    },

    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          const { page, size, search, username } = store.filter();
          return utilisateirService.fetchAllUtilisateurs({ page, size, search, username }).pipe(
            tap((response: BackEndResponse<Utilisateur>) => {
              patchState(store, {
                data: response.data.content,
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
                message: response.message,
                numberOfElements: response.data.numberOfElements,
                isLoading: false,
              });
            }),
            catchError((error) => {
              console.error('Error loading utilisateurs', error);
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
      this.loadUsers();
    });
  }
}
