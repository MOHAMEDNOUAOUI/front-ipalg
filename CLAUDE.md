# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` (`ng serve`): dev server on http://localhost:4200
- `npm run build`: production build into `dist/ipalg/browser` (this is what the Dockerfile copies into nginx)
- `npm run watch`: development build in watch mode
- `npm test` (`ng test`): Karma + Jasmine. Run one spec with `ng test --include='src/app/path/to/file.spec.ts'`
- No lint script is configured. Prettier settings live in `package.json` (printWidth 100, single quotes, `angular` parser for `*.html`).

CI: the `Jenkinsfile` checks out `develop`, builds the image from `dockerfile` (`npm ci --legacy-peer-deps`, so use that flag if a plain install hits peer-dependency errors) and pushes it to Harbor with an incrementing `vN` tag.

## Stack

Angular 21 (standalone components, no NgModules, zone.js change detection), PrimeNG 21 with `@primeuix/themes`, `@ngrx/signals` for state, ApexCharts (`ng-apexcharts`) and Chart.js for charts, `@ng-icons` for icons. TypeScript is strict, with `strictTemplates` on. The UI language is French and so are most route and feature names (`environement`, `utilisateurs`, `parametres`, `centre-aide`). Keep the existing spelling when adding to those areas, because routes and file names depend on it.

## Architecture

- **Routing** (`src/app/app.routes.ts`): everything is a child of `LayoutComponent` (`src/app/layout`, the shell with the side navigation and top panel). Every feature page is lazy-loaded with `loadComponent`, and `PreloadAllModules` is enabled. `environement` and `parametres` are parent pages with nested child routes rendered in their own `router-outlet`.
- **Navigation menu is data, not routes**: the side-panel tabs and links are hard-coded in the initial state of `src/app/store/app.store.ts` (`sidePanel_Tabs`). Adding a page means adding a route in `app.routes.ts` and a link there. Many links still point to the placeholder route `'test'`. Icons referenced by name in that menu (for example `tablerUsers`) must also be registered in `provideIcons({...})` in `app.config.ts`, or they will not render.
- **State** (`src/app/store`): `@ngrx/signals` `signalStore`s wrapped in `@Injectable({ providedIn: 'root' })` classes.
  - `AppStore` holds UI state (navigation collapsed, theme, language), persisted in `localStorage`. Dark mode is applied by setting `data-theme="dark"` on `<html>`.
  - `AlertFrontStore` drives the toast-like alerts in `shared/alert`.
  - Data-backed stores (`users.store.ts`, `profile.store.ts`, `categories.store.ts`) share the generic list shape in `type.generic.ts`: `GenericState<T, Filter>` plus the `BaseStore` interface (`data`, `filter`, `selectedRows`, `columns`, `updateFilter`, `loadData`, etc.). `UsersStore` is the reference implementation. A constructor `effect` reloads data through an `rxMethod` whenever `filter()` changes, so changing page, size or search triggers a fetch automatically. Follow this pattern for new list pages.
- **Generic table stack**: list pages (`features/utilisateurs`, `environement/components/*`) render `components/generic-table` (and `shared/reusable-table`), which takes a `BaseStore` and its `columns`. Row selection, pagination (`shared/pagination`, `components/generic-table-footer`) and the bulk-actions bar (`components/generic-table-rows-execution`, shown when 2 or more rows are selected) all read from the store.
- **Actions**: `utils/ActionsDistrubitorService.ts` maps an `ActionFunctionType` (MODIFY, DELETE, VIEW, ADD, EXPORT, IMPORT) to the matching method of a component implementing `ActionsFunctionsInterface` (`utils/Actionsinterface.ts`). Table and menu actions go through it.
- **HTTP**: services live in `src/app/services`. They build query params from the store filter with `Dynamicutils.DynamicParams` (`utils/dynamicutils.ts`). Backend list responses are typed with `BackEndResponse<T>` and `PageableResponse` (`interfaces/PageableResponse.ts`). Endpoint path fragments are in `environments/apis.ts`. Base URLs come from `environments/environment.ts` (`URI = http://localhost:8082`).
- **Interceptor** (`config/ipalg.interceptor.ts`): `Iplaginterceptor` adds an `X-User-Permissions` header to every request. Its value is currently a hard-coded placeholder list, not real auth.
- **Styling**: global entry is `src/styles.scss`, with shared partials in `src/styles/` (`_variables.scss`, `_typography.scss`). Dashboard charts are in `components/dashboard/*-chart`.

## Gotchas

- `environments/environment.prod.ts` exists, but `angular.json` has no `fileReplacements`, so builds always use `environment.ts`, including the production build and the Docker image. Check this before assuming a build targets a different backend.
- Several store state objects and the `Action` import in `ActionsDistrubitorService.ts` are loose (`any[]`, unused imports). Don't treat them as conventions to copy.
