import { Component, ViewChild } from '@angular/core';
import { ApexFill } from 'apexcharts';
import { ChartComponent } from 'ng-apexcharts';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
};

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [44, 55, 13],
      chart: {
        type: 'pie',
        toolbar: { show: false },
        height: '100%',
      },
      labels: ['Team A', 'Team B', 'Team C'],
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
      fill: {
        colors: ['#033d6d', '#06adb9', '#aed8ef'],
      },
    };
  }
}
