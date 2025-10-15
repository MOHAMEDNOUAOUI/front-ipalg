// import { Injectable } from '@angular/core';
// import { patchState, signalStore, withMethods, withState, rxMethod } from '@ngrx/signals';
// import { Utilisateur } from '../Models/Utilisateur/Utilisateurs';
// import { pipe, tap } from 'rxjs';

// export interface UsersState {
//   users: Utilisateur[];
// }

// @Injectable({ providedIn: 'root' })
// export class UsersStore extends signalStore(
//   { providedIn: 'root' }, // <-- This was missing
//   withState<UsersState>({ users: [] }),
//   withMethods((store) => ({
//     setUsers: (users: Utilisateur[]) => {
//       patchState(store, { users });
//     },

//     loadUsers: rxMethod<Utilisateur[]>(
//       pipe(
//         tap((users: Utilisateur[]) => {
//           patchState(store, { users });
//         })
//       )
//     ),
//   }))
// ) {}
