import { Component, ViewChild } from '@angular/core';
import { ApexLegend, ChartComponent } from 'ng-apexcharts';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexStroke,
  ApexFill,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  stroke: ApexStroke;
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: 'app-polar-chart',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './polar-chart.component.html',
  styleUrl: './polar-chart.component.scss',
})
export class PolarChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [14, 23, 21, 17, 15],
      chart: {
        type: 'polarArea',
      },
      labels: ['Rose 1', 'Rose 2', 'Rose 3', 'Rose 4', 'Rose 5'],
      stroke: {
        colors: ['#fff'],
      },
      fill: {
        opacity: 0.8,
        colors: ['#033d6d', '#06adb9', '#aed8ef'],
      },
      legend: {
        position: 'right', // 👈 puts labels underneath
        horizontalAlign: 'center',
        fontSize: '14px',
        labels: {
          colors: '#333', // optional styling
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
}
