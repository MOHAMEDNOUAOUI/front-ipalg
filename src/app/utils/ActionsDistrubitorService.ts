import { Injectable } from '@angular/core';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ActionsFunctionsInterface } from './Actionsinterface';

@Injectable({
  providedIn: 'root',
})
export class ActionsDistributor {
  distributeAction(action: ActionFunctionType | string, handler: ActionsFunctionsInterface) {
    const actionMap: { [key: string]: () => void } = {
      MODIFY: () => handler.modifierAction(),
      DELETE: () => handler.supprimerAction(),
      VIEW: () => handler.consulterAction(),
      ADD: () => handler.ajouterAction(),
      EXPORT: () => handler.exporterAction(),
      IMPORT: () => handler.importerAction(),
    };

    const actionFunction = actionMap[action];
    if (actionFunction) {
      actionFunction();
    } else {
      console.warn(`No handler found for action: ${action}`);
    }
  }
}

export enum ActionFunctionType {
  MODIFY = 'MODIFY',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  ADD = 'ADD',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}
