import { DataSource } from "typeorm"
import express from "express"
import { Client } from "./entities/Client";
import { Banker } from "./entities/Banker";
import { Transaction } from "./entities/Transaction";
import { createClientRouter } from "./routes/create_client";
import { createBankerRouter } from "./routes/create_banker";
import { createTransactionRouter } from "./routes/create_transaction";

const app = express()

const main = async () => {
    const connection = new DataSource({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "root",
        password: "rootpassword",
        database: "typeorm",
        logging: false,
        entities: [Client, Banker, Transaction],
        synchronize: true
    });

    try {
        await connection.initialize();
        console.log("Data Source has been initialized!");

        app.use(express.json())  // Add middleware

        app.use(createClientRouter)
        app.use(createBankerRouter)
        app.use(createTransactionRouter)

        app.listen(8080, () => {
            console.log("Now running on port 8080");
        });
    } catch (err) {
        console.error("Error during Data Source initialization", err);
        process.exit(1);
    }
};

main()