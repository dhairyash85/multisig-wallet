import React, { useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { dummyData } from "../constant"; // Importing dummy data

const LandingPage = () => {
  const [userWallets, setUserWallets] = useState(dummyData.walletAddresses); // Using the dummy wallet addresses
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [owners, setOwners] = useState(dummyData.owners); // Using the dummy owners
  const [requiredSignatures, setRequiredSignatures] = useState(
    dummyData.requiredSignatures
  ); // Using the dummy number of required signatures

  const handleOwnerChange = (index, event) => {
    const newOwners = [...owners];
    newOwners[index] = event.target.value;
    setOwners(newOwners);
  };

  const addOwnerField = () => setOwners([...owners, ""]);

  const createWallet = async () => {
    if (!currentAddress) {
      alert("Connect your wallet first!");
      return;
    }
    // Create wallet logic...
    alert("Wallet creation logic executed");
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Requesting wallet access from the user
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        if (address) {
          setCurrentAddress(address);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="font-sans bg-gradient-to-b from-white to-sky-400 min-h-screen flex flex-col items-center justify-center p-5">
      {/* Header Section */}
      <h1 className="text-5xl font-bold text-blue-800 text-center mb-8">
        MultiSig Wallet Platform
      </h1>
      <p className="text-xl text-gray-800 text-center mb-6">
        Secure. Reliable. Advanced Technology.
      </p>

      {/* Wallet Connection Section */}
      <div className="flex flex-col items-center gap-4">
        {!currentAddress ? (
          <button
            className="bg-blue-800 text-white rounded-lg py-3 px-6 text-xl font-bold border-none cursor-pointer transition-all duration-300 ease-in-out"
            onClick={connectWallet}
          >
            Connect to Wallet
          </button>
        ) : (
          <div className="text-center">
            <button
              className="bg-sky-400 text-blue-800 rounded-lg py-3 px-6 text-xl font-bold border-none cursor-pointer mb-5 transition-transform duration-300 ease-in-out"
              onClick={() => setIsCreating(true)}
            >
              Create New Wallet
            </button>

            <div className="mt-5">
              {userWallets.length > 0 ? (
                userWallets.map((walletAddress) => (
                  <div key={walletAddress} className="my-2">
                    <Link
                      to={`/wallet/${walletAddress}`}
                      className="text-blue-400 no-underline"
                    >
                      Wallet: {walletAddress}
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No wallets found yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Section */}
      {isCreating && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 text-center shadow-xl">
            <h2 className="text-blue-800 mb-6">Create MultiSig Wallet</h2>
            {owners.map((owner, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Owner ${index + 1} Address`}
                value={owner}
                onChange={(e) => handleOwnerChange(index, e)}
                className="p-3 mb-3 border rounded-md border-gray-300 w-full"
              />
            ))}
            <button
              className="bg-blue-800 text-white rounded-lg py-3 mb-3 w-full border-none cursor-pointer"
              onClick={addOwnerField}
            >
              Add Owner
            </button>
            <input
              type="number"
              placeholder="Required Signatures"
              value={requiredSignatures}
              onChange={(e) => setRequiredSignatures(e.target.value)}
              className="p-3 border rounded-md border-gray-300 w-full mb-3"
            />
            <button
              className="bg-sky-400 text-blue-800 rounded-lg py-3 w-full border-none cursor-pointer"
              onClick={createWallet}
            >
              Create Wallet
            </button>
            <button
              className="bg-gray-300 text-gray-800 rounded-lg py-3 w-full border-none cursor-pointer mt-3"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
