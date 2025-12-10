import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'react-hot-toast';
import Home from './pages/home/Home';
import Corbeille from './pages/corbeille/corbeille';
import './App.css';


function App() {
  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/corbeille" element={<Corbeille />} />
          </Routes>
          <Toaster position="top-center" />
        </div>
      </DndProvider>
    </Router>
  );
}

export default App;
