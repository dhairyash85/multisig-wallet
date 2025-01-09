import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { dummy } from "../constant";
import { Plus } from "lucide-react";
import { useWallet } from "../Context/WalletContext";
import Background from "../component/Background";
import Button from "../component/Button";

const LandingPage = () => {
  const { walletAddress, connectWallet } = useWallet();
  const [userWallets, setUserWallets] = useState([]);

  const [isCreating, setIsCreating] = useState(false);
  const [owners, setOwners] = useState([""]);
  const [requiredSignatures, setRequiredSignatures] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleOwnerChange = (index, event) => {
    const newOwners = [...owners];
    newOwners[index] = event.target.value;
    setOwners(newOwners);
  };
  useEffect(() => {
    if (walletAddress) {
      setUserWallets(Object.keys(dummy));
    }
  }, [walletAddress]);
  const addOwnerField = () => {
    setOwners([...owners, ""]);
  };

  const createWallet = async () => {
    if (!walletAddress) {
      alert("Connect your wallet first!");
      return;
    }
    setUserWallets((prev) => [...prev, walletAddress]);
  };

  return (
    <div>
      <Background className={"relative mt-16"}>
        <h1 className="text-5xl font-bold">MultiSig Wallet</h1>
        {!walletAddress ? (
          <Button onClick={connectWallet}>Connect to Wallet</Button>
        ) : (
          <div className="mt-4">
            <Button
              className={" hover:bg-gray-700 "}
              onClick={() => setIsCreating(true)}
            >
              Create Wallet
            </Button>
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

              <h2 className="text-xl font-bold mb-4">Create MultiSig Wallet</h2>
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
              <Button onClick={addOwnerField} className={"w-full "}>
                Add Owner
              </Button>

              <input
                type="number"
                placeholder="Required Signatures"
                value={requiredSignatures}
                onChange={(e) => setRequiredSignatures(Number(e.target.value))}
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
      </Background>

      {/* wallet  */}
      <div>
        <div className="mt-16 mx-32">
          {userWallets.length > 0 ? (
            <div className=" grid grid-cols-4 gap-6 items-center text-center overflow-auto p-4">
              {userWallets.map((walletAddress) => (
                <div
                  key={walletAddress}
                  className=" bg-black/85 border-2 border-black shadow-xl rounded-lg p-6 mb-4 transition-all duration-300 transform hover:scale-105    hover:shadow-xl"
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
