import express from "express";
import { Transaction, TransactionTypes } from "../entities/Transaction";
import { Client } from "../entities/Client";

const router = express.Router()


router.post('/api/client/:clientId/transaction', async (req, res) => {
    const { clientId } = req.params;

    const { type, amount } = req.body;

    const client = await Client.findOne({ where: { id: parseInt(clientId) } });
    // Supposed to work when the value parsed in to findOne is the primary key, which it is
    // const client = await Client.findOne(parseInt(clientId));

    if(!client){
        return res.json({
            msg: "client not found"
        })
    }
    
    // not async as we aren't saving it to the db
    const transaction = Transaction.create({
        amount,
        type,
        client
    });

    await transaction.save()

    // the one we parsed in from the req.body
    if (type === TransactionTypes.DEPOSIT ) {
        client.balance = client.balance + amount
    } else if (type === TransactionTypes.WITHDRAW){
        client.balance = client.balance - amount
    }

    await client.save();

    return res.json({
        msg: "transaction added"
    })
})

export { router as createTransactionRouter }
