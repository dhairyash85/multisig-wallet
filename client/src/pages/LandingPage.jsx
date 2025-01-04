import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { abi as multisigAbi, factoryAbi } from "../constant";
import Nav from "../component/Nav";
import { Plus } from "lucide-react";

const LandingPage = () => {
  const [userWallets, setUserWallets] = useState([]);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [owners, setOwners] = useState([""]);
  const [requiredSignatures, setRequiredSignatures] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factoryContract = new ethers.Contract(
        "0x202D331055ed69b53d6B787b61E2Df244e2AF049",
        factoryAbi,
        signer
      );

      const initData = new ethers.Interface(multisigAbi).encodeFunctionData(
        "initialize",
        [owners, requiredSignatures]
      );

      const tx = await factoryContract.deployContract(initData, owners);
      const receipt = await tx.wait();

      alert("New wallet created");
      setIsLoading(false);
      setIsCreating(false);
    } catch (error) {
      console.error(error);
      alert("Error creating wallet");
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setCurrentAddress(address);

        const factoryContract = new ethers.Contract(
          "0x202D331055ed69b53d6B787b61E2Df244e2AF049",
          factoryAbi,
          signer
        );

        const walletCount = await factoryContract.countDeployed(address);

        if (walletCount > 0) {
          const deployedContracts = await factoryContract.getWallets(address);
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
    <div>
      <Nav />
      <div className="relative h-full min-h-[600px] bg-[#FF90F4] overflow-hidden rounded-[40px] mx-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF90F4] to-[#7FFFD4]">
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="text-center">
              <h1 className="text-5xl font-bold">MultiSig Wallet</h1>
              {!currentAddress ? (
                <button
                  className="bg-black text-white font-bold py-3 px-6 rounded-lg mt-4 hover:scale-105 transition-transform"
                  onClick={connectWallet}
                >
                  Connect to Wallet
                </button>
              ) : (
                <div className="mt-4">
                  <button
                    className="bg-gray-800 text-white text-2xl px-6 py-2 rounded-lg hover:bg-gray-700"
                    onClick={() => setIsCreating(true)}
                  >
                    Create Wallet
                  </button>

                </div>
              )}

              {/* Modal */}
              {isCreating && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                    <div className=" flex justify-end ">
                      <button
                        className="  text-gray-500 hover:text-black"
                        onClick={() => setIsCreating(false)}
                      >
                        <Plus className=" rotate-45" />
                      </button>

                    </div>

                    <h2 className="text-xl font-bold mb-4">
                      Create MultiSig Wallet
                    </h2>
                    {owners.map((owner, index) => (
                      <input
                        key={index}
                        type="text"
                        placeholder={`Owner ${index + 1} Address`}
                        value={owner}
                        onChange={(e) => handleOwnerChange(index, e)}
                        className="border rounded-lg p-2 w-full mb-2"
                      />
                    ))}
                    <button
                      className="bg-black text-white px-4 py-2 rounded-md mb-4 w-full "
                      onClick={addOwnerField}
                    >
                      Add Owner
                    </button>
                    <input
                      type="number"
                      placeholder="Required Signatures"
                      value={requiredSignatures}
                      onChange={(e) =>
                        setRequiredSignatures(Number(e.target.value))
                      }
                      className="border rounded-lg p-2 w-full mb-4"
                    />
                    <button
                      className="bg-black text-white px-4 py-2 rounded-md w-full "
                      onClick={createWallet}
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Create Wallet"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* wallet  */}
      <div>

        <div className="mt-16 mx-32">
          {userWallets.length > 0 ? (
            <div className=" flex gap-8 items-center text-center overflow-auto p-4">
              {userWallets.map((walletAddress) => (
                <div
                  key={walletAddress}
                  className="bg-black shadow-lg rounded-lg p-6 mb-4 transition-all duration-300 transform hover:scale-105   hover:shadow-xl"
                >
                  <Link
                    to={`/wallet/${walletAddress}`}
                    className="block text-center text-xl font-semibold text-gray-800 hover:text-blue-600"
                  >
                    <div className="mb-2">
                      <div className="text-sm text-white">Wallet Address</div>
                      <div className="text-lg break-words text-gray-200">
                        {walletAddress}
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-blue-500">
                      <span className="font-medium">View Wallet</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No wallets found.</p>
          )}
        </div>
      </div>


    </div>
  );
};

export default LandingPage;
