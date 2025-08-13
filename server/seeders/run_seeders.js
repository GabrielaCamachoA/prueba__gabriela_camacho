import { loadClients } from "./load_client.js";
import { loadInvoice } from "./load_invoice.js";
import { loadPlatform } from "./load_platform.js";
import { loadStatus } from "./load_status_transaction.js";
import { loadType } from "./load_type_transaction.js";
import { loadTransaction } from "./load_transaction.js";

// be responsible for calling the loaders
(async () => {
    try {
        console.log("Start of seeders");
        await loadClients()
        await loadInvoice()
        await loadType()
        await loadPlatform()
        await loadStatus()
        await loadTransaction()
        console.log("It was charged correctly.");
        
    } catch (error) {
        console.error("Error running seeders", error);
    }finally{
        process.exit();
    }
})()