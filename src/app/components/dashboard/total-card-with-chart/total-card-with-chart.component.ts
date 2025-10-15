import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

export type Bar = {
  label: string;
  value: number;
  height?: string;
  color: string;
  shades?: {
    light: string;
    dark: string;
  };
};

function shadeColor(color: string, percent: number): string {
  // Only handle hex colors
  if (!color.startsWith('#')) return color; // fallback for named colors

  let num = parseInt(color.slice(1), 16);
  let r = Math.min(255, Math.max(0, (num >> 16) + percent));
  let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
  let b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));

  return `rgb(${r},${g},${b})`;
}

@Component({
  selector: 'app-total-card-with-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './total-card-with-chart.component.html',
  styleUrl: './total-card-with-chart.component.scss',
})
export class TotalCardWithChartComponent {
  bars = signal<Bar[]>([]);
  barsTemplate = [
    {
      label: 'Acquisition',
      value: 7820,
      color: '#033d6d',
    },
    {
      label: 'Reacquisition',
      value: 3220,
      color: '#06adb9',
    },
    {
      label: 'Propositions',
      value: 820,
      color: '#aed8ef',
    },
  ].map((bar) => ({
    ...bar,
    shades: {
      light: shadeColor(bar.color, 40), // lighter shade
      dark: shadeColor(bar.color, -40), // darker shade
    },
  }));

  ngOnInit() {
    this.bars.set(this.barsTemplate);
    let maxvalue = Math.max(...this.bars().map((item: any) => item.value));
    //maxvalue == 100%
    this.bars.update((bars) =>
      bars.map((bar: any) => ({
        ...bar,
        height: (bar.value * 100) / maxvalue + '%',
      }))
    );
  }
}
