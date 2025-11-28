import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Alert } from "./shared/alert/alert";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Alert],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ipalg-app');
}
