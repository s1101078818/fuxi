import { Route, Routes } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import Home from "./views/Home";
import Chat from "./views/Chat";
import Login from "./views/Login";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<div>404</div>} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default App;
