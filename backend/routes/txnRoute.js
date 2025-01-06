import { addTxn, getAllTxn, signTransaction, executeTransaction } from "../controller/txnController.js";

import express from "express"

const router=express.Router();
router.post("/",getAllTxn);
router.post("/add-transaction",addTxn);
router.post("/sign-transaction",signTransaction);
router.post("/execute-transaction",executeTransaction);
export default router;