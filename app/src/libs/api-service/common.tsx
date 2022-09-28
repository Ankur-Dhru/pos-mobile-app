import apiService from "./index";
import {ACTIONS, METHOD, STATUS} from "../static";
import {isEmpty} from "../function";
import store from "../../redux-store/store";
import {setInitDataWithKeyValue} from "../../redux-store/reducer/init-data";

export const saveSettings = (settingKey: string, body: any) => {
  return new Promise((resolve) => {
    apiService({
      method: METHOD.PUT,
      action: ACTIONS.SETTING + settingKey,
      body
    }).then((response: any) => {
      if (response.status === STATUS.SUCCESS && !isEmpty(response?.data)) {
        store.dispatch(setInitDataWithKeyValue({key: settingKey, data: response.data}))
      }
      resolve(response);
    })
  })
}
