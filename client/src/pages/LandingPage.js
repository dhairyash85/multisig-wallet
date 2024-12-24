import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { abi as multisigAbi, factoryAbi } from "../constant";
import {ethers} from "ethers"
const LandingPage = () => {
  const [userWallets, setUserWallets] = useState([]);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [owners, setOwners] = useState([""]);
  const [requiredSignatures, setRequiredSignatures] = useState(1);
  const handleOwnerChange = (index, event) => {
    const newOwners = [...owners];
    newOwners[index] = event.target.value;
    setOwners(newOwners);
  };

  const addOwnerField = () => {
    setOwners([...owners, ""]);
  };

  const createWallet = async () => {
    if (!currentAddress) {
      alert("Connect your wallet first!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factoryContract = new ethers.Contract(
        "0x202D331055ed69b53d6B787b61E2Df244e2AF049",
        factoryAbi,
        signer
      );
      console.log(factoryContract);
      const initData = new ethers.Interface(multisigAbi).encodeFunctionData(
        "initialize",
        [owners, requiredSignatures]
      );
      console.log(initData, owners);
      const tx = await factoryContract.deployContract(initData, owners);
      console.log(tx);
      const receipt = await tx.wait();
      console.log(receipt);
      alert("New wallet created");
    } catch (error) {
      console.error(error);
      alert("Error creating wallet");
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        if (address) {
          setCurrentAddress(address);
        }

        const factoryContract = new ethers.Contract(
          "0x202D331055ed69b53d6B787b61E2Df244e2AF049",
          factoryAbi,
          signer
        );

        const walletCount = await factoryContract.countDeployed(address);

        if (walletCount > 0 && address) {
          const deployedContracts = await factoryContract.getWallets(address);
          console.log(deployedContracts);
          setUserWallets(deployedContracts);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="text-center">
      <div className="text-5xl">MultiSig Wallet</div>
      <div className="flex justify-center items-center gap-3 py-3">
        {!currentAddress ? (
          <button
            className="bg-blue-500 text-white rounded p-2"
            onClick={connectWallet}
          >
            Connect to Wallet
          </button>
        ) : (
          <div>
            <button
              className="bg-gray-500 text-white text-3xl rounded-xl px-3 hover:text-black hover:bg-white"
              onClick={() => setIsCreating(true)}
            >
              Create Wallet
            </button>
            {isCreating && (
              <div className="z-10 absolute w-screen h-screen bg-black opacity-80 flex items-center justify-center -left-0 overflow-clip -top-0">
                <div className="z-50 bg-slate-600 w-4/12 F relative rounded-lg border border-white flex flex-col">
                  <button
                    className="bg-gray-800 px-5 rounded-sm text-white hover:text-black hover:bg-white absolute top-4 right-4"
                    onClick={() => setIsCreating(false)}
                  >
                    Close
                  </button>
                  <div className="flex flex-col gap-2 justify-center mt-4 mx-5 mb-4">
                    <h2>Create MultiSig Wallet</h2>
                    {owners.map((owner, index) => (
                      <input
                        key={index}
                        type="text"
                        placeholder={`Owner ${index + 1} Address`}
                        value={owner}
                        onChange={(e) => handleOwnerChange(index, e)}
                      />
                    ))}
                    <button
                      className="bg-gray-500 text-white rounded lg hover:text-black hover:bg-white"
                      onClick={addOwnerField}
                    >
                      Add Owner
                    </button>
                    <input
                      type="number"
                      placeholder="Required Signatures"
                      value={requiredSignatures}
                      onChange={(e) => setRequiredSignatures(e.target.value)}
                    />
                    <button
                      className="bg-gray-500 text-white rounded lg hover:text-black hover:bg-white"
                      onClick={createWallet}
                    >
                      Create Wallet
                    </button>
                  </div>
                </div>
              </div>
            )}
            {userWallets && userWallets.length > 0 ? (
              <div>
                {userWallets.map((walletAddress) => (
                  <div key={walletAddress}>
                    <Link to={`/wallet/${walletAddress}`}>
                      Wallet: {walletAddress}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div>No wallets found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
