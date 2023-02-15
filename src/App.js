import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import TabBar from './components/TabBar';
import SideBar from './components/SideBar';

function App() {
  return (
    <Router>
      <div className="content">
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/en" element={<About/>} />
        </Routes>
        <TabBar></TabBar>
      </div>
    </Router>
  );
}

export default App;
