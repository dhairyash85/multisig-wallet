import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import WalletPage from "./pages/WalletPage";
import { WalletProvider } from "./Context/WalletContext";
function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/wallet/:wallet" element={<WalletPage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
// 0x4CeE984030271415DbaD4c468e6EBe906882fF40
