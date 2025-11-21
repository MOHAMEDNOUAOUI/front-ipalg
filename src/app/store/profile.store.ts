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
import { Profile } from '../Models/Utilisateur/Profile';
import { BaseFilter, BaseStore, GenericState } from './type.generic';

type Filter = BaseFilter & {
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
    label: '',
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
export class ProfileStore
  extends signalStore(
    withState(initialState),
    withComputed((store) => ({
      data: computed(() => store.data()),
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

      setSelectedData: (data: Profile | null) => {
        patchState(store, { selectedData: data });
      },

      updateFilter: (filter: Partial<GenericState<Profile, Filter>['filter']>) => {
        patchState(store, {
          filter: {
            ...(store.filter?.() ?? { page: 0, size: 10, search: '', label: '', profileName: '' }),
            ...filter,
          },
        });
      },

      updateSearch: (search: string) => {
        patchState(store, {
          filter: {
            ...(store.filter?.() ?? { page: 0, size: 10, search: '', label: '', profileName: '' }),
            search: search,
          },
        });
      },

      loadData: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() => {
            const filter = store.filter();
            return utilisateirService.fetchAllUtilisateurs(filter).pipe(
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
  )
  implements BaseStore<Profile, Filter>
{
  constructor() {
    super();

    effect(
      () => {
        const filter = this.filter();
        //   this.loadUsers();
      },
      { allowSignalWrites: true }
    );
  }
}
