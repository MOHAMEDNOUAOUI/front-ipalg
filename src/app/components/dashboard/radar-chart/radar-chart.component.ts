import { Component, ViewChild } from '@angular/core';
import { ApexDropShadow } from 'apexcharts';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ChartComponent,
  ApexFill,
  ApexStroke,
  ApexMarkers,
  ApexPlotOptions,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  fill: ApexFill;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  markers: ApexMarkers;
  dropShadow: ApexDropShadow;
};

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './radar-chart.component.html',
  styleUrl: './radar-chart.component.scss',
})
export class RadarChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Series 1',
          data: [80, 50, 30, 40, 100, 20],
        },
      ],
      chart: {
        height: 270,
        type: 'radar',
        toolbar: { show: false },
      },
      markers: { size: 0 },
      title: {
        text: 'Circular Radar Chart',
      },
      xaxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June'],
      },
      stroke: {
        curve: 'smooth', // soften edges
        width: 3, // thicker line looks smoother
      },
      dropShadow: {
        enabled: true,
        blur: 4,
        color: '#06adb9',
        opacity: 0.3,
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: 'transparent',
            connectorColors: 'transparent',
            fill: {
              colors: ['rgba(6,173,185,0.05)', 'rgba(174,216,239,0.2)'],
            },
          },
        },
      },
      fill: {
        opacity: 0.5,
        colors: ['#06adb9'],
      },
    };
  }
}
