import { Severity, Variant } from '../../shared/p-button/p-button.component';
import { Component } from '@angular/core';
import { SmallCardComponent } from '../../components/dashboard/small-card/small-card.component';
import { CardHolderComponent } from '../../components/dashboard/card-holder/card-holder.component';
import { ChartModule } from 'primeng/chart';
import { RepartitionDesBiensComponent } from '../../components/dashboard/repartition-des-biens/repartition-des-biens.component';
import { LineChartComponent } from '../../components/dashboard/line-chart/line-chart.component';
import { PieChartComponent } from '../../components/dashboard/pie-chart/pie-chart.component';
import { PolarChartComponent } from '../../components/dashboard/polar-chart/polar-chart.component';
import { RadarChartComponent } from '../../components/dashboard/radar-chart/radar-chart.component';
import { TotalCardWithChartComponent } from '../../components/dashboard/total-card-with-chart/total-card-with-chart.component';
import { PButtonComponent } from '../../shared/p-button/p-button.component';
import { CommonModule } from '@angular/common';
import { SummaryChartComponent } from '../../components/summary-chart/summary-chart..component';
import { BarsChartComponent } from '../../components/dashboard/bars-chart/bars-chart.component';
import { PileCharts } from "../../components/dashboard/pile-charts/pile-charts";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SmallCardComponent,
    CardHolderComponent,
    ChartModule,
    RepartitionDesBiensComponent,
    LineChartComponent,
    PieChartComponent,
    PolarChartComponent,
    RadarChartComponent,
    TotalCardWithChartComponent,
    PButtonComponent,
    SummaryChartComponent,
    BarsChartComponent,
    PileCharts
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  Severity = Severity;
  Variant = Variant;

  // addBar(value: number) {
  //   this.bars.push(value);
  // }
}
