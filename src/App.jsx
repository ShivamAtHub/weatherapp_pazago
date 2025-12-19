import { BrowserRouter, Routes, Route } from "react-router-dom";
import WeatherChat from "./components/WeatherChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WeatherChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
