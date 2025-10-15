import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface ChartDetail {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-summary-chart.',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-chart.component.html',
  styleUrl: './summary-chart.component.scss',
})
export class SummaryChartComponent {
  bars = [
    { value: 1, color: '#033d6d' },
    { value: 2, color: '#06adb9' },
    { value: 3, color: '#aed8ef' },
    { value: 4, color: '#06adb9' },
    { value: 5, color: '#033d6d' },
    { value: 6, color: 'black' },
    { value: 6, color: 'red' },
    { value: 6, color: 'green' },
    { value: 6, color: 'yellow' },
  ];
}
