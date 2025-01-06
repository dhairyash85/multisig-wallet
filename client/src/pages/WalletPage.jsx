import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummy, walletABI } from "../constant";
import { ethers } from "ethers";
import { useWallet } from "../Context/WalletContext";
import Background from "../component/Background";
import { Plus } from "lucide-react";
import axiosInstance from "../Services/axios"
const WalletPage = () => {
  const { wallet } = useParams();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transaction, setTransaction] = useState({ to: "", value: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [amountToBeAdded, setAmountToBeAdded] = useState(0);
  const [balance, setBalance] = useState(0);
  const { walletAddress, signer, provider, connectWallet } = useWallet();
  const [walletContract, setWalletContract]=useState(null);
  useEffect(() => {
    // Hardcoded data for transactions
    if(!wallet){
      return
    }
    const loadTransaction=async()=>{
      const res=await axiosInstance.post("/", {multiSigWallet: wallet});
      setTransactions(res?.data?.transactions);
    }
    const fetchBalance=async()=>{
      if(!walletContract || !provider) return;
      const bal=await provider.getBalance(wallet);
      const req=await walletContract.getRequiredSignatures();
      setBalance(ethers.formatEther(bal));
    }
    fetchBalance()
    if (!isSubmitting && wallet) {
      loadTransaction()
    }
  }, [wallet, isSubmitting, walletContract]);
  useEffect(()=>{
    if(!wallet || !signer){
      connectWallet()
    }
    const contract=new ethers.Contract(wallet, walletABI, signer);
    setWalletContract(contract)
  }, [wallet, signer])
  const submitTransaction = async () => {
    if(!walletContract){
      return alert("Contract not initialized yet")
    }
    try {
      const requiredSignatures=await walletContract.getRequiredSignatures()
      const res=await axiosInstance.post("/add-transaction", {amount:transaction.value, from: wallet, to: transaction.to, signature:[], requiredSignatures:Number(requiredSignatures)})
      if(res.success){

        alert(`Transaction submitted successfully`);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      alert("Error submitting transaction");
    }
  };
  const signTransaction = async (transaction) => {
    try {
      const messageHash=ethers.solidityPackedKeccak256(['address', 'uint256', 'string'], 
        [transaction.to, ethers.parseEther(transaction.amount.toString()), ""]
      )
      const signature=await signer.signMessage(ethers.toBeArray(messageHash));
      const res=await axiosInstance.post("sign-transaction",{signature:{address:walletAddress, signature}, transactionId: transaction._id})
      alert("Transaction signed successfully");
    } catch (error) {
      console.log(error);
      alert("Error signing transaction");
    }
  };

  const addFunds = async () => {
    if (isNaN(amountToBeAdded) || amountToBeAdded <= 0) {
      return alert("Amount must be more than 0");
    }
    if (!walletContract) {
      return alert("Contract not initialized yet");
    }
    try {
      const tx = await walletContract.fundme({
        value: ethers.parseUnits(amountToBeAdded.toString(), "ether"),
      });  
      alert("Transaction sent, waiting for confirmation...");
      await tx.wait(); // Wait for transaction to be mined
  
      alert("Funds added");
    } catch (err) {
      console.log(err);
      alert("An error occurred while adding funds");
    }
  };
  

  const executeTransaction = async (transaction) => {
    try{
      if(!walletContract){
        return alert("Contract not initialized yet");
      }
      const signatures=transaction.signatures.map(sign=>sign.signature);
      const tx=await walletContract.executeTransaction(transaction.to, ethers.parseEther(transaction.amount.toString()), signatures) 
      await tx.wait();
      const res=await axiosInstance.post("/execute-transaction", {txHash:tx.data, transactionId: transaction._id})
      alert("Execute transaction");
    }catch(err){
      console.log(err);
      alert("Execution failed")
    }
  };
  return (
    <div>
      <Background>
        <>
          {/* {isOwner ? ( */}
          <div className="flex items-center flex-col mt-16 bg-white mx-8  ld:mx-40 xl:mx-80 rounded-3xl min-h-[450px] px-4 ">
            <div className="flex w-full h-10 justify-center sm:gap-8 md:gap-24 px-2 my-16">
              <button
                className="text-3xl rounded-xl bg-gray-800 text-white/80 text-bold hover:text-black px-4 hover:bg-white"
                onClick={() => {
                  setIsSubmitting(true);
                  setTransaction({ to: "", value: 0 });
                }}
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
                <p className="text-3xl text-bold">Balance: {balance}</p>
              </div>
            </div>

            {isSubmitting && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                  <div className=" flex justify-end ">
                    <button
                      className="  text-gray-500 hover:text-black"
                      onClick={() => setIsSubmitting(false)}
                    >
                      <Plus className=" rotate-45" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 items-center">
                    <h2>Submit Transaction</h2>
                    <input
                      type="text"
                      placeholder="To"
                      value={transaction.to}
                      className="border rounded-lg p-2 w-full mb-2"
                      onChange={(e) =>
                        setTransaction({ ...transaction, to: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Value (in ETH)"
                      value={transaction.value}
                      className="border rounded-lg p-2 w-full mb-2"
                      onChange={(e) =>
                        setTransaction({
                          ...transaction,
                          value: e.target.value,
                        })
                      }
                    />
                    <button
                      className="bg-black text-white px-4 py-2 rounded-md w-full "
                      onClick={submitTransaction}
                    >
                      Submit Transaction
                    </button>
                  </div>
                </div>
              </div>
            )}
            {isAdding && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                  <div className=" flex justify-end ">
                    <button
                      className="  text-gray-500 hover:text-black"
                      onClick={() => setIsAdding(false)}
                    >
                      <Plus className=" rotate-45" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 items-center">
                    <h2>Add Funds</h2>
                    <input
                      type="number"
                      placeholder="Value (in ETH)"
                      value={amountToBeAdded}
                      className="border rounded-lg p-2 w-full mb-2"
                      onChange={(e) => setAmountToBeAdded(e.target.value)}
                    />
                    <button
                      className="bg-black text-white px-4 py-2 rounded-md w-full "
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
                      <th className="px-3">Signatures</th>
                      <th className="px-3">Sign</th>
                      <th className="px-3">Execute</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-3">{transaction.to}</td>
                        <td className="px-3">{Number(transaction.amount)}</td>
                        <td className="px-3">{transaction.executed?"Executed":"Pending"}</td>
                        <td className="px-3">{transaction.signatures?.length}</td>
                        <td className="px-3">
                          <button
                            disabled={transaction.executed}
                            className="bg-gray-800 px-5 rounded-sm text-white hover:text-black hover:bg-white"
                            onClick={() => signTransaction(transaction)}
                          >
                            Sign
                          </button>
                        </td>
                        <td className="px-3">
                          <button
                            disabled={transaction.executed}
                            className="bg-gray-800 px-5 rounded-sm text-white hover:text-black hover:bg-white"
                            onClick={() => {
                              executeTransaction(transaction);
                            }}
                          >
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
      </Background>
    </div>
  );
};

export default WalletPage;
