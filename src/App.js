import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NL from './pages/NL';
import EN from './pages/EN';
import TabBar from './components/TabBar';
import SideBar from './components/SideBar';

function App() {
  return (
    <Router>
      <div className="content">
        <Routes>
          <Route exact path="/" element={<NL/>} />
          <Route exact path="/en" element={<EN/>} />
        </Routes>
        <TabBar></TabBar>
      </div>
    </Router>
  );
}

export default App;
