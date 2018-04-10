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

  static authenticateUserAd = () => {
    return new Promise((resolve, reject) =>
    {
      fetch("/api/auth/sspi", {
        method: "post",
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        credentials: "same-origin"
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

  static getAccessToken = (email, refreshToken) => {
    return new Promise((resolve, reject) =>
    {
      fetch("/api/auth/refresh", {
        method: "post",
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({ email: email, refreshToken: refreshToken })
      })
        .then(response => {
          console.log(response);
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



