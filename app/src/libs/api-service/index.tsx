import {appLog, errorAlert, log} from "../function";
import {ACTIONS, device, METHOD, STATUS} from "../static";
import store from "../../redux-store/store";
import {hideLoader, setAlert, showLoader} from "../../redux-store/reducer/component";


interface configData {
  method: METHOD,
  action?: ACTIONS|string,
  queryString?: object,
  body?: object,
  hideLoader?:boolean,
  hidealert?:boolean,
  token?: string,
  workspace?: string,
  other?:any
}

let controller: any = undefined;

const apiService = async (config: configData) => {

  controller = new AbortController();
  const signal = controller.signal;

  let headers: any = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };


  if (Boolean(config.workspace)) {
    // headers["x-workspace"] = config.workspace;
  }

  if (Boolean(config.token || device.token)) {
    headers["Authorization"] = 'Bearer ' + (config.token || device.token);
  }

  const requestOptions: any = {
    method: config.method,
    redirect: 'follow',
    headers: new Headers(headers),
    timeout: 5000,
    signal
  };


  let apiPath: any = "http://localhost:8081/";



  if(config.other){
    if(Boolean(config.workspace)) {
      apiPath = `https://${config.workspace}${config.other.url}`;
    }
    else{
      apiPath = `${config.other.url}`;
    }

  }

  if (config.action) {
    apiPath += config.action;
  }
  if (config.queryString) {
    apiPath += jsonToQueryString(config.queryString);
  }

  if (config.body) {
    requestOptions.body = JSON.stringify(config.body);
  }

  if (!config.hideLoader) {
    store.dispatch(showLoader())
  }

  appLog('apiPath',apiPath)

    return await fetch(apiPath, requestOptions)
      .then(response => response.json())
      .then((response: any) => {

        store.dispatch(hideLoader())
        if (response?.message && (response?.status === STATUS.ERROR) && !config?.hidealert) {
          if((config.action?.includes('server/')) && (response?.message?.includes('ENOTFOUND'))){
            errorAlert('Internet connection not available')
          }
          else {
            errorAlert(response?.message)
          }
        }

        return response;
      })
      .catch(error => {

        store.dispatch(hideLoader())
        //appLog("API_CATCH_ERROR", error,navigator.onLine);

        /*if(!navigator.onLine){
          AppToaster({message: 'Internet connection not available', intent: "danger"});
        }*/

        return {
          status: STATUS.ERROR,
          message: error.message
        }
      });



}

export default apiService;

export const jsonToQueryString = (json: any) => {
  if (!json) {
    return undefined;
  }
  return '?' + Object.keys(json).map((key) => {
    return `${key}=${json[key]}`
  }).join('&');
};

export const abortFetching = () => {
  appLog("CALL", "abort");
  if (controller) {
    controller.abort();
  }
}
