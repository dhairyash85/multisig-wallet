import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {dummy } from "../constant";
import { ethers } from "ethers";
import axios from "axios";
import { useWallet } from "../Context/WalletContext";

const WalletPage = () => {
  const { wallet } = useParams();
  const navigate=useNavigate()
  const [transactions, setTransactions] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transaction, setTransaction] = useState({ to: "", value: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [amountToBeAdded, setAmountToBeAdded] = useState(0);
  const [balance, setBalance] = useState(0);
  const {  walletAddress,signer }=useWallet()
  useEffect(() => {
    const loadTransactions = async () => {
      const res = await axios.post('/', { multisigWallet: wallet })
      console.log(res)
      setTransactions(res?.data?.data)
    }
    if (isSubmitting == false) {
      loadTransactions().catch((err) => {
        console.log(err);
      });
    }
  }, [wallet, isSubmitting]);

  const submitTransaction = async () => {
    try {
      const requiredSignature = dummy[wallet]
      console.log(requiredSignature)
      console.log(Number(requiredSignature))
      const res = await axios.post('/add-transaction', { amount: transaction.value, from: wallet, to: transaction.to, signature: [], requiredSignatures: Number(requiredSignature) })
      console.log(res)
      alert(`Transaction submitted successfully`);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      alert("Error submitting transaction");
    }
  };
  const signTransaction = async (transaction) => {
    if(!signer){
      alert("Please connect your wallet")
      navigate("/")
    }
    try {
      const messageHash = ethers.solidityPackedKeccak256(
        ['address', 'uint256', 'string'],
        [transaction.to, ethers.parseEther(transaction.amount.toString()), ""]
      );
      const signature = await signer.signMessage(ethers.toBeArray(messageHash));
      console.log(signature);
      const res = await axios.post('/sign-transaction', { transactionId: transaction._id, signature: { address: walletAddress, signature: signature } })
      console.log(res)
      if (res.data.success) {
        alert(`Signed successfully \n${signature}`)
      }
      else {
        alert(res.data.error)
      }
    } catch (error) {
      console.error(error);
      alert('Error signing transaction');
    }
  };
  const addFunds = async () => {
    console.log("Add funds")
  };
  const executeTransaction = async (transaction) => {
    console.log("Execute transaction")
  }

  return (
    <div>

      <div className=" h-full min-h-[600px] bg-[#FF90F4]  overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF90F4] to-[#7FFFD4]">
          <div className="absolute inset-0 grid ">
            <div className=" ">
              <>
                {/* {isOwner ? ( */}
                  <div className="flex items-center flex-col mt-16 bg-white mx-8  ld:mx-40 xl:mx-80 rounded-3xl min-h-[450px]">
                    <div className="flex w-full h-10 justify-center sm:gap-8 md:gap-24 px-2 my-16">
                      <button
                        className="text-3xl rounded-xl bg-gray-800 text-white/80 text-bold hover:text-black px-4 hover:bg-white"
                        onClick={() => { setIsSubmitting(true); setTransaction({ to: "", value: 0 }) }}
                      >
                        Add Transaction
                      </button>
                      <button
                        className="text-3xl rounded-xl bg-gray-800 text-white text-bold hover:text-black px-4 hover:bg-white"
                        onClick={() => setIsAdding(true)}
                      >
                        Add Funds
                      </button>
                      <div className="flex justify-end pl-5">
                        <p className="text-3xl text-bold">
                          Balance: {balance}
                        </p>
                      </div>
                    </div>

                    {isSubmitting && (
                      <div className="z-10 absolute w-screen h-screen bg-black opacity-80 flex items-center justify-center">
                        <div className="z-50 bg-slate-600 w-4/12 h-36 relative rounded-lg border border-white flex flex-col">
                          <button
                            className="bg-gray-800 px-5 rounded-sm text-white hover:text-black hover:bg-white absolute top-4 right-4"
                            onClick={() => setIsSubmitting(false)}
                          >
                            Close
                          </button>
                          <div className="flex flex-col gap-2 items-center">
                            <h2>Submit Transaction</h2>
                            <input
                              type="text"
                              placeholder="To"
                              value={transaction.to}
                              onChange={(e) =>
                                setTransaction({ ...transaction, to: e.target.value })
                              }
                            />
                            <input
                              type="number"
                              placeholder="Value (in ETH)"
                              value={transaction.value}
                              onChange={(e) =>
                                setTransaction({ ...transaction, value: e.target.value })
                              }
                            />
                            <button
                              className="bg-gray-400 text-white rounded-lg hover:text-black hover:bg-white px-5"
                              onClick={submitTransaction}
                            >
                              Submit Transaction
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {isAdding && (
                      <div className="z-10 absolute w-screen h-screen bg-black opacity-80 flex items-center justify-center">
                        <div className="z-50 bg-slate-600 w-4/12 h-36 relative rounded-lg border border-white flex flex-col">
                          <button
                            className="bg-gray-800 px-5 rounded-sm text-white hover:text-black hover:bg-white absolute top-4 right-4"
                            onClick={() => setIsAdding(false)}
                          >
                            Close
                          </button>
                          <div className="flex flex-col gap-2 items-center">
                            <h2>Add Funds</h2>
                            <input
                              type="number"
                              placeholder="Value (in ETH)"
                              value={amountToBeAdded}
                              onChange={(e) => setAmountToBeAdded(e.target.value)}
                            />
                            <button
                              className="bg-gray-400 text-white rounded-lg hover:text-black hover:bg-white px-5"
                              onClick={addFunds}
                            >
                              Add Funds
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {transactions ? (
                      <>
                        <table>
                          <thead>
                            <tr>
                              <th className="px-3">To</th>
                              <th className="px-3">Amount</th>
                              <th className="px-3">Executed</th>
                              <th className="px-3">Sign</th>
                              <th className="px-3">Execute</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((transaction, index) => (
                              <tr key={index}>

                                <td className="px-3">{transaction.to}</td>
                                <td className="px-3">
                                  {Number(transaction.amount)}
                                </td>
                                <td className="px-3">
                                  {transaction.status}
                                </td>
                                <td className="px-3">
                                  <button disabled={transaction.executed} className="bg-gray-800 px-5 rounded-sm text-white hover:text-black hover:bg-white" onClick={() => signTransaction(transaction)}>
                                    Sign
                                  </button>
                                </td>
                                <td className="px-3" >
                                  <button disabled={transaction.executed} className="bg-gray-800 px-5 rounded-sm text-white hover:text-black hover:bg-white" onClick={() => { executeTransaction(transaction) }}>
                                    Execute
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    ) : (
                      <>
                        <h1 className=" text-center">You have no transactions</h1>
                      </>
                    )}
                  </div>
                {/* ) : (
                  <>
                    <h1 className=" text-center">You are not the owner of this wallet</h1>
                  </>
                )} */}
              </>
            </div>
          </div>

        </div>
      </div>

    </div>


  );
};

export default WalletPage;
