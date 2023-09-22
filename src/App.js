import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './Home';

function App() {

  return (
    <div>
      <img className='locked w-[100vw] h-[100vh] fixed top-0 left-0 z-50 opacity-[50%]' src={require('./assets/texture.png')} style={{mixBlendMode:'saturation'}} alt='decorative'/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
