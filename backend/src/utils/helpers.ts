// backend/src/utils/helpers.ts
import runQuery from "../DB/dal";

export async function isDbServerUp() {    
    try {
        await runQuery("select 1;");
        return true;
    } catch (error) {
        console.error("Error in isDbServerUp: ", error);  // Log the error

        return false;        
    }
}