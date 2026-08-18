import "./App.css";
import HomePage from "./pages/Homepage";
import Admin from "./pages/Admin";
import { BrowserRouter } from "react-router";
import { Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
