export default class AuthApi {
  
  static authenticateUser = (model) => {
    return new Promise((resolve, reject) =>
    {
      fetch("/api/auth/token", {
          method: "post",
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
          },
          credentials: "same-origin",
          body: JSON.stringify(model)
        })
        .then(response => {
          console.log(response);
          if (response.ok) {
            resolve();
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



