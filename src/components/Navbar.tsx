import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { NAV_ITEMS } from '@/config/navigation.config';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const CustomToolbar = styled(Toolbar)(({ theme }) => ({
    height: 64,
    backgroundColor: '#fff',
    boxShadow: theme.shadows[2],
    color: "#000"
  }));

  return (

    
    <AppBar position="static">
      <CustomToolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Dify Pilot
        </Typography>
        <Tabs
          value={location.pathname}
          onChange={handleTabChange}
          textColor="inherit"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#1976d2"
            }
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Tab
              key={item.id}
              value={item.path}
              label={item.title}
              icon={<item.icon />}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </CustomToolbar>
    </AppBar>
  );
}; 