export interface MenuItem {
  id: string;
  route: string;
  icon: string;
  name: string;
  subItems?: SubMenuItem[];
}

export interface SubMenuItem {
  label: string;
  route: string;
}
