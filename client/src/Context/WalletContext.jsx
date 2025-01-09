import React, { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const providerInstance = new ethers.BrowserProvider(window.ethereum);
        const signerInstance = await providerInstance.getSigner();
        const walletAddress = await signerInstance.getAddress();
        setProvider(providerInstance);
        setSigner(signerInstance);
        setWalletAddress(walletAddress);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
          setSigner(null);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{ walletAddress, connectWallet, provider, signer }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
