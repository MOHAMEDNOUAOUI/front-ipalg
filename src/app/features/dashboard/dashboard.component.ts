import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { AreaChart, LineSeries } from '../../components/charts/area-chart/area-chart';
import { ColumnChart } from '../../components/charts/column-chart/column-chart';
import { Gauge } from '../../components/charts/gauge/gauge';
import { Ribbon } from '../../components/charts/ribbon/ribbon';
import { Treemap } from '../../components/charts/treemap/treemap';
import { deltaPct, sparkline } from '../../utils/spark';
import {
  ACTIVITES,
  BIENS_PAR_STATUT,
  DEMO_ALERT_COUNT,
  ECH_MOIS,
  ECH_STACKS,
  ENCAISSE,
  KPIS,
  MOIS,
  OCCUPATION,
  OPERATIONS,
  PREVU,
  TODOS,
  VALEUR_PAR_VILLE,
} from './dashboard.data';

const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, NgIcon, AreaChart, ColumnChart, Gauge, Ribbon, Treemap],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  protected readonly today = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(
    new Date()
  );
  protected readonly kpis = KPIS.map((k) => {
    const delta = deltaPct(k.trend);
    return {
      ...k,
      line: sparkline(k.trend),
      delta,
      up: delta >= 0,
      good: delta > 0 === (k.better === 'up'),
    };
  });
  protected readonly alertCount = DEMO_ALERT_COUNT;
  protected readonly todos = TODOS;
  protected readonly activites = ACTIVITES;
  protected readonly operations = OPERATIONS;
  protected readonly opsMax = Math.max(...OPERATIONS.map((o) => o.n));
  protected readonly occupation = OCCUPATION;
  protected readonly statuts = BIENS_PAR_STATUT;
  protected readonly villes = VALEUR_PAR_VILLE;
  protected readonly echMois = ECH_MOIS;
  protected readonly echStacks = ECH_STACKS;
  protected readonly echTotal = sum(ECH_STACKS.flatMap((s) => s.values));

  protected readonly mois = MOIS;
  protected readonly loyers: LineSeries[] = [
    { name: 'Encaissés', color: 'var(--brand)', values: ENCAISSE, area: true },
    { name: 'Prévus', color: 'var(--ink-3)', values: PREVU, dashed: true },
  ];
  protected readonly totalEncaisse = sum(ENCAISSE).toFixed(1).replace('.', ',');
  protected readonly ecart = deltaPct([sum(PREVU.slice(0, ENCAISSE.length)), sum(ENCAISSE)]);
}
