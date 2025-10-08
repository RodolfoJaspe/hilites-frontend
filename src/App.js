import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from './components/Header';
import Home from './components/Home';
import { AuthProvider } from './context/AuthContext';
import { HighlightsCacheProvider } from './context/HighlightsCacheContext';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <HighlightsCacheProvider>
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
      </HighlightsCacheProvider>
    </AuthProvider>
  );
}

export default App;
