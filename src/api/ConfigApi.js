export default class ConfigApi {
  
  static getConfig = () => {
    return new Promise((resolve, reject) =>
    {
      fetch("/api/config", {
          method: "get",
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(response.statusText, response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
}



