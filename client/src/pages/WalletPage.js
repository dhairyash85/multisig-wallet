/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { abi as multisigAbi } from "../constant";
import { ethers } from "ethers";
import axios from "axios";

const WalletPage = () => {
  const { wallet } = useParams();
  const [transactions, setTransactions] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transaction, setTransaction] = useState({ to: "", value: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [amountToBeAdded, setAmountToBeAdded] = useState(0);
  const [signature, setSignature] = useState([""]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadTransactions = async () => {
      const res = await axios.post("/", { multisigWallet: wallet });
      console.log(res);
      setTransactions(res?.data?.data);
    };

    if (isSubmitting == false) {
      loadTransactions().catch((err) => {
        console.log(err);
      });
    }
  }, [wallet, isSubmitting]);
  const signTransaction = async (transaction) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "string"],
        [transaction.to, ethers.parseEther(transaction.amount.toString()), ""]
      );
      const signature = await signer.signMessage(ethers.toBeArray(messageHash));
      console.log(signature);
      const res = await axios.post("/sign-transaction", {
        transactionId: transaction._id,
        signature: { address: address, signature: signature },
      });
      console.log(res);
      if (res.data.success) {
        alert(`Signed successfully \n${signature}`);
      } else {
        alert(res.data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error signing transaction");
    }
  };
  const submitTransaction = async () => {
    try {
      const res = await axios.post("/add-transaction", {
        amount: transaction.value,
        from: wallet,
        to: transaction.to,
        signature: [],
        requiredSignatures: 1,
      });
      alert(`Transaction submitted successfully`);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      alert("Error submitting transaction");
    }
  };

  const addFunds = async () => {
    try {
      if (amountToBeAdded == 0) {
        alert("Add more than 0");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const multisigContract = new ethers.Contract(wallet, multisigAbi, signer);
      const tx = await multisigContract.fundme({
        value: ethers.parseEther(amountToBeAdded.toString()),
      });
      await tx.wait();
      alert("Funds added");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignatureChange = (index, event) => {
    const newSignatures = [...signature];
    newSignatures[index] = event.target.value;
    setSignature(newSignatures);
  };

  const addSignatureField = () => {
    setSignature([...signature, ""]);
  };

  const executeTransaction = async (transaction) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const multisigContract = new ethers.Contract(wallet, multisigAbi, signer);
      const signatures = transaction.signatures.map((sign) => sign.signature);
      const tx = await multisigContract.executeTransaction(
        transaction.to,
        ethers.parseEther(transaction.amount.toString()),
        signatures
      );
      const hash = await tx.wait();
      axios.post("/execute-transaction", {
        txHash: tx.data,
        transactionId: transaction._id,
      });
    } catch (err) {
      alert("Could not execute transaction");
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen">
      <div className="w-full max-w-5xl flex justify-between mb-6">
        <div className="space-x-4">
          <button
            className="bg-blue-800 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-500 transition duration-300"
            onClick={() => setIsSubmitting(true)}
          >
            Add Transaction
          </button>
          <button
            className="bg-green-800 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-500 transition duration-300"
            onClick={() => setIsAdding(true)}
          >
            Add Funds
          </button>
        </div>
        <div className="text-xl font-semibold text-blue-800">
          <p>Balance: {balance} ETH</p>
        </div>
      </div>

      {/* Transaction Submit Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-10">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96 relative">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
              onClick={() => setIsSubmitting(false)}
            >
              X
            </button>
            <h2 className="text-2xl font-semibold text-center mb-4">
              Submit Transaction
            </h2>
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="To"
              value={transaction.to}
              onChange={(e) =>
                setTransaction({ ...transaction, to: e.target.value })
              }
            />
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              placeholder="Value (in ETH)"
              value={transaction.value}
              onChange={(e) =>
                setTransaction({ ...transaction, value: e.target.value })
              }
            />
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-500 transition duration-300"
              onClick={submitTransaction}
            >
              Submit Transaction
            </button>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-10">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96 relative">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
              onClick={() => setIsAdding(false)}
            >
              X
            </button>
            <h2 className="text-2xl font-semibold text-center mb-4">
              Add Funds
            </h2>
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              placeholder="Amount (ETH)"
              value={amountToBeAdded}
              onChange={(e) => setAmountToBeAdded(e.target.value)}
            />
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg w-full hover:bg-green-500 transition duration-300"
              onClick={addFunds}
            >
              Add Funds
            </button>
          </div>
        </div>
      )}

      {/* Transaction Table */}
      {transactions ? (
        <div className="w-full mt-6 overflow-x-auto rounded-lg bg-white shadow-md">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="px-6 py-4 text-left border-b">To</th>
                <th className="px-6 py-4 text-left border-b">Amount</th>
                <th className="px-6 py-4 text-left border-b">Executed</th>
                <th className="px-6 py-4 text-left border-b">Sign</th>
                <th className="px-6 py-4 text-left border-b">Execute</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{transaction.to}</td>
                  <td className="px-6 py-4 border-b">
                    {Number(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 border-b">{transaction.status}</td>
                  <td className="px-6 py-4 border-b">
                    <button
                      disabled={transaction.executed}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-300"
                      onClick={() => signTransaction(transaction)}
                    >
                      Sign
                    </button>
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      disabled={transaction.executed}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300"
                      onClick={() => executeTransaction(transaction)}
                    >
                      Execute
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h2 className="text-xl font-semibold mt-6">
          No Transactions Available
        </h2>
      )}
    </div>
  );
};

export default WalletPage;
