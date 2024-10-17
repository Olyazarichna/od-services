"use client";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  Typography,
  Divider,
  CssBaseline,
  AppBar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { menu } from "./data";
import LoginIcon from "@mui/icons-material/Login";
import { useRouter } from "next/navigation";
import { DRAWERWIDTH, DRAWERWIDTHMOB } from "../../utils/constants";
import RequestLists from "../RequestsList/RequstsList";
import useWidth from "../../hooks/useWidth";
interface IDashboard {
  showAllRequests: boolean;
}
export default function Dashboard({ showAllRequests }: IDashboard) {
  const router = useRouter();
  const { isMobile } = useWidth();
  const handleNavigation = (link: string) => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!storedUser.id) {
      router.push("/login");
    } else {
      const dynamicLink = link.replace("[id]", storedUser.id);
      router.push(dynamicLink);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/signup");
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${isMobile ? DRAWERWIDTHMOB : DRAWERWIDTH}px)`,
          ml: `${isMobile ? DRAWERWIDTHMOB : DRAWERWIDTH}px`,
          backgroundColor: "#fff",
          zIndex: 1200,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            color="secondary"
            sx={{ position: "relative", zIndex: 100 }}
          >
            Requests list
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: isMobile ? DRAWERWIDTHMOB : DRAWERWIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? DRAWERWIDTHMOB : DRAWERWIDTH,
            boxSizing: "border-box",
            backgroundColor: "#efebe9",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {menu.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item.link)}>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                {!isMobile && <ListItemText primary={item.title} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["Log out"].map((text, index) => (
            <ListItem key={text + index} disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                {!isMobile && <ListItemText primary={text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <RequestLists showAllRequests={showAllRequests} />
      </Box>
    </Box>
  );
}
