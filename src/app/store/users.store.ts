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

// type UserState = {
//   data: Utilisateur[];
//   totalPages: number;
//   totalElements: number;
//   message: string;
//   isLoading: boolean;
//   filter: {
//     page: number;
//     size: number;
//     search: string;
//     username: string;
//   };
//   numberOfElements: number;
//   selectedUtilisateur: Utilisateur | null;
// };
type Filter = {
  page: number;
  size: number;
  search: string;
  username: string;
};
const initialState: GenericState<Utilisateur, Filter> = {
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
  selectedData: null,
  columns: [
    // {
    //   label: 'Something Else',
    //   value: [
    //     {
    //       value: 'status',
    //     },
    //     {
    //       value: 'createdBy',
    //     },
    //   ],
    // },
    {
      label: 'Utilisateur',
      active: true,
      value: [
        {
          value: 'username',
          bold: true,
        },
        {
          value: 'email',
        },
      ],
    },
    {
      label: "Nom d'utilisateur",
      value: [
        {
          value: 'userProfile',
          item: 'name',
        },
        {
          value: 'email',
        },
      ],
      item: 'name',
      active: true,
    },
    {
      label: 'Prenom',
      value: 'firstName',
      active: true,
      // item: 'label',
    },
    {
      label: 'Nom',
      value: 'lastName',
      active: true,
      // item: 'label',
    },
    {
      label: 'Permissions',
      value: 'permissionsCount',
      active: false,
    },
    {
      label: 'Status',
      value: 'status',
      active: true,
    },

    {
      label: 'Date de Creation',
      value: 'dateCreation',
      type: 'DATE',
      active: true,
    },
    {
      label: 'Dernière modification',
      value: 'dateUpdate',
      type: 'DATE',
      active: true,
    },
    {
      label: 'latest login',
      value: 'lastLogin',
      type: 'DATE',
      active: true,
    },

    {
      label: 'Créé par',
      value: 'createdBy',
      active: false,
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class UsersStore extends signalStore(
  { providedIn: 'root' }, // <-- This was missing
  withState(initialState),
  withMethods((store, utilisateirService = inject(UtilisateursService)) => ({
    setUsers: (response: Utilisateur[]) => {
      patchState(store, { data: response });
    },

    updateFilter: (filter: Partial<GenericState<Utilisateur, Filter>['filter']>) => {
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
          const filter = store.filter();
          return utilisateirService.fetchAllUtilisateurs(filter).pipe(
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
