import { onloadBook } from "./load_book.js";
import { onloadLoans } from "./load_loans.js";
import { onloadUsers } from "./load_users.js";

// se encargara de llamar a los load
(async () => {
    try {
        console.log("Inicio de seeders");
        await onloadUsers()
        await onloadBook();
        await onloadLoans()
        console.log("se cargo correctamente");
        
    } catch (error) {
        console.error("Error al ejecutar los seeders", error);
    }finally{
        process.exit();
    }
})()