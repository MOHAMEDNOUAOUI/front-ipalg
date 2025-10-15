import { Component, Input } from '@angular/core';

export type bar = {
  size: string;
  color: string;
};

@Component({
  selector: 'app-small-card',
  standalone: true,
  imports: [],
  templateUrl: './small-card.component.html',
  styleUrl: './small-card.component.scss',
})
export class SmallCardComponent {
  @Input() title?: string;
  // ['50%','72%','50%','100%','80%']
  bar: bar[] = [
    {
      size: '34%',
      color:
        'linear-gradient(to top, rgba(6, 173, 185, 0), rgba(6, 173, 185, 0.255))',
    },

    {
      size: '80%',
      color:
        'linear-gradient(to top, rgba(6, 173, 185, 0), rgba(6, 173, 185, 0.6))',
    },

    {
      size: '50%',
      color:
        'linear-gradient(to top, rgba(6, 173, 185, 0), rgba(6, 173, 185, 0.375))',
    },
    {
      size: '100%',
      color:
        'linear-gradient(to top, rgba(6, 173, 185, 0), rgba(6, 173, 185, 0.75))',
    },
    {
      size: '72%',
      color:
        'linear-gradient(to top, rgba(6, 173, 185, 0), rgba(6, 173, 185, 0.54))',
    },
  ];
}
