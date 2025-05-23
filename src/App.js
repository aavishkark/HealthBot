
import './App.css';
import { MainRoutes } from './Components/MainRoutes';
import { Navbar } from './Components/Navbar';
import React from 'react';

function App() {
  return (
      <div className="App">
        <Navbar />
        <MainRoutes />
      </div>
  );
}

export default App;
