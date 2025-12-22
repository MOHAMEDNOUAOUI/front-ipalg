import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-route-after-collapse',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './route-after-collapse.html',
  styleUrl: './route-after-collapse.scss',
})
export class RouteAfterCollapse {
  @Input() links: any[] = [];
}
