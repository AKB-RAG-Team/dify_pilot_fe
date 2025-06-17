import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Connections } from "@/pages/Connections";
import { ImportDoc } from "./pages/ImportDoc";
import { Navbar } from "@/components/Navbar";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router
          future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
              <Routes>
                <Route path="/" element={<Connections />} />
                <Route path="/import-doc" element={<ImportDoc />} />
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
