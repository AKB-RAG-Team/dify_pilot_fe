import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Connections } from '@/pages/Connections';
import { Navbar } from '@/components/Navbar';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Routes>
                <Route path="/" element={<Connections />} />
                <Route path="/settings" element={<div>Cài đặt</div>} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 