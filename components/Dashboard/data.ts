import BorderColorIcon from "@mui/icons-material/BorderColor";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ChecklistIcon from "@mui/icons-material/Checklist";
export const menu = [
  {
    id: "1",
    icon: BorderColorIcon,
    title: "Create order",
    link: "/[id]/create/order",
  },
  {
    id: "2",
    icon: LocalShippingIcon,
    title: "Create deliver",
    link: "/[id]/create/deliver",
  },
  {
    id: "3",
    icon: FormatListNumberedIcon,
    title: "All user requests",
    link: "/requests",
  },
  {
    id: "4",
    icon: ChecklistIcon,
    title: "My requests",
    link: "/[id]/requests",
  },
];
