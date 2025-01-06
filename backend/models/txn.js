import { model, Schema } from "mongoose";

const txnSchema=new Schema({
    amount: Number,
    from: String,
    to: String,
    signatures: {
        type: [{ address: String, signature: String }],
    },
    requiredSignatures: Number,
    txHash: String,
    executed: Boolean 
})

export default model("Transaction", txnSchema)