export interface sidePanel_Tabs {
  header: string;
  active: boolean;
  icon: string;
  links: tab[];
}

export interface tab {
  label: string;
  icon: string;
  route: string;
}

export interface navigation {
  label: string;
  route: string;
  active: boolean;
  text?: any;
}

export interface step {
  label: string;
  route: string;
}
