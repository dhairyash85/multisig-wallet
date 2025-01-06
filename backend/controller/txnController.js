import Transaction from "../models/txn.js";
export const addTxn = async (req, res) => {
  try {
    const { amount, from, to, requiredSignature } = req.body;
    const txn = new Transaction({
      amount,
      from,
      to,
      requiredSignatures: requiredSignature,
    });
    await txn.save();
    res.status(201).send("Transaction Created Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
export const getAllTxn = async (req, res) => {
  try {
    const { multiSigWallet } = req.body;
    const txn = await Transaction.find({ from: multiSigWallet });
    res.status(200).json({ transactions: txn });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const signTransaction = async (req, res) => {
  try {
    const { signature, transactionId } = req.body;
    const txn = await Transaction.findById(transactionId);
    if (!txn) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    let alreadySigned = false;
    txn.signatures.forEach((sign) => {
      if (sign.address == signature.address) alreadySigned = true;
    });
    if (alreadySigned)
      return res.status(200).json({ success: false, error: "Already Signed" });
    txn.signatures = [...txn.signatures, signature];
    await txn.save();
    return res.status(201).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const executeTransaction = async (req, res) => {
  try {
    const {txHash, transactionId}=req.body;
    const txn = await Transaction.findOne({_id:transactionId});
    console.log(txn)

    if (!txn) {
        return res.status(404).json({ error: "Transaction not found" });
    }
    txn.txHash=txHash;
    txn.executed=true;
    await txn.save();
    res.status(201).send("Transaction Executed")
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
