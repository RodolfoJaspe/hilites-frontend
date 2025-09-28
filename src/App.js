import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from './components/Header';
import Home from './components/Home';
import './styles/App.css';

function App() {
  return (
    <div id="app" >
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route exact path="/" element={<Home />}/>
                </Routes>
            </div>       
        </Router>
    </div>
  );
}

export default App;
