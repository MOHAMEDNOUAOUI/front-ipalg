import { Component, ViewChild } from '@angular/core';
import { ApexFill, ApexTooltip, ApexYAxis } from 'apexcharts';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexMarkers,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
  fill: ApexFill;
  colors: string[];
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  Highest: number = 0;
  Lowest: number = 0;
  Average: number = 0;

  constructor() {
    this.initiateLine();
  }

  ngOnInit() {
    const data = this.chartOptions.series![0].data as [number, number][];
    this.Highest = Math.max(...data.map((d) => d[1]));
    this.Lowest = Math.min(...data.map((d) => d[1]));
    this.Average = Math.round(
      data.reduce((sum, d) => sum + d[1], 0) / data.length
    );
  }

  initiateLine() {
    this.chartOptions = {
      series: [
        {
          name: 'text',
          data: [
            [new Date('2025-01-01').getTime(), 10],
            [new Date('2025-02-01').getTime(), 41],
            [new Date('2025-03-01').getTime(), 35],
            [new Date('2025-04-01').getTime(), 51],
            [new Date('2025-05-01').getTime(), 62],
            [new Date('2025-06-01').getTime(), 91],
            [new Date('2025-07-01').getTime(), 75],
            [new Date('2025-08-01').getTime(), 18],
            [new Date('2025-09-30').getTime(), 106],
          ],
        },
      ],
      chart: {
        type: 'line',
        height: '100%',
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: {
          enabled: true,
          speed: 1200,
          animateGradually: {
            enabled: true,
            delay: 150, // delay per point
          },
          dynamicAnimation: {
            enabled: true,
            speed: 1200,
          },
        },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      markers: {
        size: 4,
        colors: ['#ffffff'],
        strokeColors: '#06adb9',
        strokeWidth: 3,
        hover: { size: 8 },
      },
      xaxis: {
        categories: ['2', '2', '2', '2', '2'],
        labels: {
          formatter: (value: string, index: number) => {
            if (index === 0) return value;
            if (index === 4) return value; // last index
            return '';
          },
          style: { colors: '#666', fontSize: '12px' },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { show: false },
      grid: { show: false },
      colors: ['#06adb9'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          gradientToColors: ['#aed8ef'],
          opacityFrom: 0.8,
          opacityTo: 0.2,
          stops: [0, 100],
        },
      },
      tooltip: {
        enabled: false,
        theme: 'light',
        x: { format: 'dd MMM yyyy' },
      },
    };
  }
}
