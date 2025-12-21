import { computed, effect, inject, Injectable } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
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
import { BaseFilter, BaseStore, GenericState } from './type.generic';

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
type Filter = BaseFilter & {
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
    label: '',
    username: '',
  },
  numberOfElements: 0,
  selectedData: null,
  selectedRows: [],
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
          type: 'string',
        },
        {
          value: 'email',
          type: 'string',
        },
      ],
    },
    {
      label: "Nom d'utilisateur",
      value: [
        {
          value: 'userProfile',
          item: 'name',
          type: 'string',
        },
        {
          value: 'email',
          type: 'string',
        },
      ],
      item: 'name',
      active: true,
    },
    {
      label: 'Prenom',
      value: 'firstName',
      type: 'string',
      active: true,
      // item: 'label',
    },
    {
      label: 'Nom',
      value: 'lastName',
      type: 'string',
      active: true,
      // item: 'label',
    },
    {
      label: 'Permissions',
      value: 'permissionsCount',
      type: 'string',
      active: false,
    },
    {
      label: 'Status',
      value: 'status',
      type: 'status',
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
      type: 'string',
      active: false,
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class UsersStore
  extends signalStore(
    withState(initialState),
    withComputed((store) => ({
      data: computed(() => store.data()),
      selectedRowsData: computed(() => store.selectedRows()),
      totalElements: computed(() => store.totalElements()),
      totalPages: computed(() => store.totalPages()),
      isLoading: computed(() => store.isLoading()),
      filter: computed(() => store.filter()),
      selectedData: computed(() => store.selectedData()),
      columns: computed(() => store.columns()),
      message: computed(() => store.message()),
      numberOfElements: computed(() => store.numberOfElements()),
    })),
    withMethods((store, utilisateirService = inject(UtilisateursService)) => ({
      setUsers: (response: Utilisateur[]) => {
        patchState(store, { data: response });
      },

      updateFilter: (filter: Partial<GenericState<Utilisateur, Filter>['filter']>) => {
        patchState(store, {
          filter: {
            ...(store.filter?.() ?? { page: 0, size: 10, search: '', username: '', label: '' }),
            ...filter,
          },
        });
      },
      setSelectedData: (data: Utilisateur | null) => {
        patchState(store, { selectedData: data });
      },

      updateSearch: (search: string) => {
        patchState(store, {
          filter: {
            ...(store.filter?.() ?? { page: 0, size: 10, search: '', label: '', profileName: '' }),
            search: search,
          },
        });
      },
      updateSelectedRow: (data: Utilisateur) => {
        let selectedRows = store.selectedRows();
        const exists = selectedRows.some((row: Utilisateur) => row.id === data.id);

        const updatedRows = exists
          ? selectedRows.filter((row) => row.id !== data.id)
          : [...selectedRows, data];
        patchState(store, { selectedRows: updatedRows });
      },

      loadData: rxMethod<void>(
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
  )
  implements BaseStore<Utilisateur, Filter>
{
  constructor() {
    super();

    effect(
      () => {
        const filter = this.filter();
        this.loadData();
      },
      { allowSignalWrites: true }
    );
  }
}
