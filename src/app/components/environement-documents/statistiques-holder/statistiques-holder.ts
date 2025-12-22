import { Component } from '@angular/core';
import { StatistiquesItem } from "../statistiques-item/statistiques-item";

@Component({
  selector: 'app-statistiques-holder',
  imports: [StatistiquesItem],
  templateUrl: './statistiques-holder.html',
  styleUrl: './statistiques-holder.scss',
})
export class StatistiquesHolder {

}
