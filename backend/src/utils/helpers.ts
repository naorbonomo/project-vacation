// backend/src/utils/helpers.ts
import runQuery from "../DB/dal";

export async function isDbServerUp() {    
    try {
        await runQuery("select 1;");
        return true;
    } catch (error) {
        return false;        
    }
}