import React, { useState } from 'react';
import { ethers } from 'ethers';
import { abi as multisigAbi, factoryAbi } from './constant';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import WalletPage from './pages/WalletPage';
function App() {
  return (
   
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<LandingPage/>}/>
              <Route path='/wallet/:wallet' element={<WalletPage/>}/>
            </Routes>          
          </BrowserRouter>
  )
}

export default App;
// 0x4CeE984030271415DbaD4c468e6EBe906882fF40