
import {appLog,  errorAlert} from "../function";
import {getDBConnection} from "./index";



export const deleteTable = (tablename:any,condition?:any) => {
    return new Promise<any>(async (resolve)=> {
        const db = await getDBConnection();
        try {
            await db.transaction(function (txn) {

                let where = ' 1 = 1 ';

                if (Boolean(condition)) {
                    where += ` and ${condition} `;
                }
                const query = `DELETE
                               FROM ${tablename}
                               where ${where}`;

                appLog('query', query)

                try {
                    db.executeSql(query);
                } catch (e) {
                    appLog('ERROR', query)
                    appLog('DELETE  e', e)
                }
                appLog('16')
            });

        } catch (e) {
            appLog('e', e)
        }
        db.close().then();
        resolve('Delete Data');
    });
}
