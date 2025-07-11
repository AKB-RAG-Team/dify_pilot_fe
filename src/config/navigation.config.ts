import { Link as LinkIcon, ImportContacts } from "@mui/icons-material";

export interface NavItem {
  id: string;
  title: string;
  path: string;
  icon: React.ElementType;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "connections",
    title: "nav.connections",
    path: "/",
    icon: LinkIcon,
  },
  {
    id: "import-doc",
    title: "nav.importDoc",
    path: "/import-doc",
    icon: ImportContacts,
  },
];
