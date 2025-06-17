import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { NAV_ITEMS } from "@/config/navigation.config";
import { useTranslation } from "react-i18next";

const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  height: 30,
  backgroundColor: "#fff",
  boxShadow: theme.shadows[1],
  color: "#000",
  borderRadius: 20,
  padding: "0 12px",
  display: "flex",
  justifyContent: "space-between",
  width: "80vw",
}));

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const { t, i18n } = useTranslation();
  const handleLanguageChange = (event: any) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 8,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1300,
      }}
    >
      <Paper elevation={1} sx={{ borderRadius: 5 }}>
        <CustomToolbar>
          <Typography variant="h6" sx={{ mr: 4 }}>
            Amazing Microservice
          </Typography>
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            size="small"
            sx={{ ml: "auto", color: "inherit" }}
          >
            <MenuItem value="vi">🇻🇳 Tiếng Việt</MenuItem>
            <MenuItem value="en">🇺🇸 English</MenuItem>
            <MenuItem value="ja">🇯🇵 日本語</MenuItem>
          </Select>
          <Tabs
            value={location.pathname}
            onChange={handleTabChange}
            textColor="inherit"
            TabIndicatorProps={{
              style: {
                backgroundColor: "#1976d2",
              },
            }}
          >
            {NAV_ITEMS.map((item) => (
              <Tab
                key={item.id}
                value={item.path}
                label={t(item.title)}
                icon={<item.icon />}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </CustomToolbar>
      </Paper>
    </Box>
  );
};
