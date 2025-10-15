import { Component } from '@angular/core';
import { SmallCardComponent } from "../small-card/small-card.component";

@Component({
  selector: 'app-card-holder',
  standalone: true,
  imports: [SmallCardComponent],
  templateUrl: './card-holder.component.html',
  styleUrl: './card-holder.component.scss'
})
export class CardHolderComponent {

}
