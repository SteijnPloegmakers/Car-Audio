import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NL from './pages/NL';
import EN from './pages/EN';
import Test from './pages/Test';
import TabBar from './components/TabBar';

function App() {
  return (
    <div className="content" id="bg">
      <Router>
        <Routes>
          <Route exact path="/nl" element={<NL />} />
          <Route exact path="/en" element={<EN />} />
          <Route exact path="/" element={<Test />} />
        </Routes>
        <TabBar></TabBar>
      </Router>
    </div>
  );
}

export default App;
