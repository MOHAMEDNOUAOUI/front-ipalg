import { AppStore } from './../../store/app.store';
import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { sidePanel_Tabs } from '../../interfaces/sidepanel-tabs';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-second-side-panel',
  imports: [NgIcon, CommonModule, RouterModule],
  templateUrl: './second-side-panel.html',
  styleUrl: './second-side-panel.scss',
  viewProviders: [],
})
export class SecondSidePanel {
  currentYear = new Date().getFullYear();
  tabs: any[] = [];

  constructor(public router: Router, public AppStore: AppStore) {}

  ngOnInit() {
    this.tabs = this.AppStore.sidePanelTabs();
    this.starterPanel();
    console.log(this.AppStore.sidePanelState());
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.starterPanel();
      });
  }

  starterPanel() {
    const currentUrl = this.router.url;

    this.tabs.forEach((tab: any) => {
      let tabMatch = false;

      tab.links.forEach((link: any) => {
        if (!link.links) {
          link.active = currentUrl.includes(link.route);
          if (link.active) tabMatch = true;
        } else {
          let linkMatch = false;
          link.links.forEach((subLink: any) => {
            subLink.active = currentUrl.includes(subLink.route);
            if (subLink.active) linkMatch = true;
          });

          link.active = linkMatch || currentUrl.includes(link.route);
          if (link.active) tabMatch = true;
        }
      });

      tab.active = tabMatch;
    });
  }
  openTab(tab: any) {
    this.tabs.forEach((t: any) => {
      if (t.header === tab.header) {
        t.active = true;
      } else {
        t.active = false;
      }
    });
  }

  closeTabs() {
    this.tabs.forEach((t: any) => {
      t.active = false;
    });
  }

  openSubTab(parentTab: any, childTab: any) {
    parentTab.active = true;

    parentTab.links.forEach((sub: any) => {
      sub.active = sub.label === childTab.label ? !sub.active : false;
    });
  }

  openNestedSubTab(parentTab: any, childTab: any, subChild: any) {
    parentTab.active = true;
    childTab.active = true;

    childTab.links.forEach((sub: any) => {
      sub.active = sub.label === subChild.label;
    });
  }
}
