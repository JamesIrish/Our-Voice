export default class UserApi {
  
  static createUser = (model) => {
    return new Promise((resolve, reject) => {
      fetch("/api/user", {
          method: "post",
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(model)
        })
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
}



