import React, { useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

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
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(to bottom, #ffffff, #87ceeb)",
        minHeight: "100vh",
        color: "#333",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Header Section */}
      <h1
        style={{
          fontSize: "3.5rem",
          fontWeight: "bold",
          color: "#004aad",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        MultiSig Wallet Platform
      </h1>
      <p
        style={{
          fontSize: "1.3rem",
          color: "#333",
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        Secure. Reliable. Advanced Technology.
      </p>

      {/* Wallet Connection Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {!currentAddress ? (
          <button
            style={{
              backgroundColor: "#004aad",
              color: "#fff",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={connectWallet}
          >
            Connect to Wallet
          </button>
        ) : (
          <div style={{ textAlign: "center" }}>
            <button
              style={{
                backgroundColor: "#87ceeb",
                color: "#004aad",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                marginBottom: "20px",
                transition: "transform 0.3s ease",
              }}
              onClick={() => setIsCreating(true)}
            >
              Create New Wallet
            </button>

            <div style={{ marginTop: "20px" }}>
              {userWallets.length > 0 ? (
                userWallets.map((walletAddress) => (
                  <div key={walletAddress} style={{ margin: "10px 0" }}>
                    <Link
                      to={`/wallet/${walletAddress}`}
                      style={{ color: "#fdda44", textDecoration: "none" }}
                    >
                      Wallet: {walletAddress}
                    </Link>
                  </div>
                ))
              ) : (
                <p style={{ color: "#666" }}>No wallets found yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Section */}
      {isCreating && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              width: "400px",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h2 style={{ color: "#004aad", marginBottom: "20px" }}>
              Create MultiSig Wallet
            </h2>
            {owners.map((owner, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Owner ${index + 1} Address`}
                value={owner}
                onChange={(e) => handleOwnerChange(index, e)}
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
              />
            ))}
            <button
              style={{
                backgroundColor: "#004aad",
                color: "#fff",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={addOwnerField}
            >
              Add Owner
            </button>
            <input
              type="number"
              placeholder="Required Signatures"
              value={requiredSignatures}
              onChange={(e) => setRequiredSignatures(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "100%",
                marginBottom: "10px",
              }}
            />
            <button
              style={{
                backgroundColor: "#87ceeb",
                color: "#004aad",
                borderRadius: "8px",
                padding: "10px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={createWallet}
            >
              Create Wallet
            </button>
            <button
              style={{
                backgroundColor: "#ccc",
                color: "#333",
                borderRadius: "8px",
                padding: "10px",
                border: "none",
                cursor: "pointer",
                width: "100%",
                marginTop: "10px",
              }}
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
