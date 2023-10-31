
import {appLog,  errorAlert} from "../function";
import {closeDB, getDBConnection} from "./index";



export const deleteTable = (tablename:any,condition?:any) => {
    return new Promise<any>(async (resolve)=> {
        const db:any = await getDBConnection();
        try {
            await db.transaction(function (txn:any) {

                let where = ' 1 = 1 ';

                if (Boolean(condition)) {
                    where += ` and ${condition} `;
                }
                const query = `DELETE FROM ${tablename} where ${where}`;

                appLog('query', query)

                try {
                    db.executeSql(query);
                } catch (e) {
                    appLog('ERROR', query)
                    appLog('DELETE  e', e)
                }

            });

        } catch (e) {
            appLog('e', e)
        }
        setTimeout(()=>{
            //closeDB(db);
            resolve('Delete Data');
        },100)
    });
}
