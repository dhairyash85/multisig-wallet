import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { abi as multisigAbi } from "../constant";
import { ethers } from "ethers";
import axios from "axios";

const WalletPage = () => {
  const { wallet } = useParams();
  const [transactions, setTransactions] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transaction, setTransaction] = useState({ to: "", value: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [amountToBeAdded, setAmountToBeAdded] = useState(0);
  const [signature, setSignature] = useState(['']);
  const [isExecuting, setIsExecuting]=useState(false);
  const [balance, setBalance]=useState(0);
  const [TransactionToBeExecuted, setTransactionToBeExecuted]=useState()
  useEffect(() => {
    const loadTransactions = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log('checking owner')
      const multisigContract = new ethers.Contract(wallet, multisigAbi, signer);
      const checkOwner = await multisigContract.isOwner(address);
      setIsOwner(checkOwner);
      if(checkOwner){
        const res=await axios.post('/', {multisigWallet:wallet})
        console.log(res)
        setTransactions(res?.data?.data)
      }
      const bal=await provider.getBalance(wallet)
      console.log(bal)
      setBalance(ethers.formatEther(bal))
      console.log(ethers.formatEther(bal))
    }
    //   const transaction = await multisigContract.getAllTransactions();

    //   let tr = [];
    //   for (let i = 0; i < transaction[0].length; i++) {
    //     tr[i] = {
    //       transactionId: transaction[0][i],
    //       to: transaction[1][i],
    //       value: transaction[2][i],
    //       executed: transaction[4][i],
    //     };
    //   }
    //   console.log(tr);
    //   setTransactions(tr);
    // };
    if (isSubmitting == false) {
      loadTransactions().catch((err) => {
        console.log(err);
      });
    }
  }, [wallet, isSubmitting]);

  const submitTransaction = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const multisigContract = new ethers.Contract(wallet, multisigAbi, signer);
      const requiredSignature=await multisigContract.getRequiredSignatures();
      // const valueInWei = ethers.parseEther(transaction.value.toString());
      // const messageHash = ethers.solidityPackedKeccak256(
      //   ['address', 'uint256', 'string'],
      //   [transaction.to, valueInWei, ""]
      // );
      // const signature = await signer.signMessage(ethers.toBeArray(messageHash));
      // console.log(signature);
      console.log(Number(requiredSignature))
      const res=await axios.post('/add-transaction', {amount:transaction.value, from:wallet, to:transaction.to, signature:[], requiredSignatures:Number(requiredSignature)})
      console.log(res)
      alert(`Transaction submitted successfully`);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      alert("Error submitting transaction");
    }
  };
  const signTransaction = async (transaction) => {

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address=await signer.getAddress()
      const messageHash = ethers.solidityPackedKeccak256(
        ['address', 'uint256', 'string'],
        [transaction.to, ethers.parseEther(transaction.amount.toString()), ""]
      );
      const signature = await signer.signMessage(ethers.toBeArray(messageHash));
      console.log(signature);
      const res=await axios.post('/sign-transaction', {transactionId:transaction._id, signature:{address:address, signature:signature}})
      console.log(res)
      if(res.data.success){

        alert(`Signed successfully \n${signature}`)
      }
      else{
        alert(res.data.error)
      }
    } catch (error) {
      console.error(error);
      alert('Error signing transaction');
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
      console.log(tx);
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
  const addSignatureField=()=>{
    setSignature([...signature, ''])
  }

  const executeTransaction=async(transaction)=>{

      try{
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const multisigContract = new ethers.Contract(wallet, multisigAbi, signer);
        const signatures=transaction.signatures.map(sign=>sign.signature)
        const tx=await multisigContract.executeTransaction(transaction.to, ethers.parseEther(transaction.amount.toString()), signatures)
        const hash=await tx.wait()
        if(tx){
          console.log(tx)
          console.log(hash)
          axios.post('/execute-transaction', {txHash:tx.data, transactionId:transaction._id})
        }
        
        console.log("End")
      }catch(err){
        console.log(err)
        alert("Could not execute transaction")
      }
    
  }

  return (
    <>
      {isOwner ? (
        <div className="flex items-center flex-col">
          <div className="flex w-full h-10 justify-evenly my-8">
            <button
              className="text-3xl rounded-xl bg-gray-800 text-white text-bold hover:text-black px-4 hover:bg-white"
              onClick={() => {setIsSubmitting(true); setTransaction({to:"", value:0})}}
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
                        <button disabled={transaction.executed} className="bg-gray-800 px-5 rounded-sm text-white hover:text-black hover:bg-white" onClick={()=>signTransaction(transaction)}>
                          Sign
                        </button>
                      </td>
                      <td className="px-3" >
                        <button disabled={transaction.executed} className="bg-gray-800 px-5 rounded-sm text-white hover:text-black hover:bg-white" onClick={()=>{executeTransaction(transaction)}}>
                          Execute
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isExecuting && (
              <div className="z-10 absolute w-screen h-screen bg-black opacity-80 flex items-center justify-center -left-0 overflow-clip -top-0">
                <div className="z-50 bg-slate-600 w-4/12 F relative rounded-lg border border-white flex flex-col">
                  <button
                    className="bg-gray-800 px-5 rounded-sm text-white hover:text-black hover:bg-white absolute top-4 right-4"
                    onClick={() => setIsExecuting(false)}
                  >
                    Close
                  </button>
                  <div className="flex flex-col gap-2 justify-center mt-4 mx-5 mb-4">
                    <h2>Create MultiSig Wallet</h2>
                    {signature.map((owner, index) => (
                      <input
                        key={index}
                        type="text"
                        placeholder={`Signature ${index + 1}`}
                        value={owner}
                        onChange={(e) => handleSignatureChange(index, e)}
                      />
                    ))}
                    <button
                      className="bg-gray-500 text-white rounded lg hover:text-black hover:bg-white"
                      onClick={addSignatureField}
                    >
                      Add Signature
                    </button>
                    <button
                      className="bg-gray-500 text-white rounded lg hover:text-black hover:bg-white"
                      onClick={executeTransaction(transaction)}
                    >
                      Execute Transaction
                    </button>
                  </div>
                </div>
              </div>
            )}
            </>
          ) : (
            <>
              <h1>You have no transactions</h1>
            </>
          )}
        </div>
      ) : (
        <>
          <h1>You are not the owner of this wallet</h1>
        </>
      )}
    </>
  );
};

export default WalletPage;
