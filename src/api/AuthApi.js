export default class AuthApi {

  static _fetchWrapper = (method, url, body) => {
    return new Promise((resolve, reject) =>
    {
      fetch(url, {
        method: method,
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify(body)
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
  } ;
  
  static authenticateUser = (model) => {
    return AuthApi._fetchWrapper("post", "/api/auth/login", model);
  };

  static authenticateUserAd = () => {
    return AuthApi._fetchWrapper("post", "/api/auth/sspi");
  };
  
  static forgotten = (email) => {
    return AuthApi._fetchWrapper("post", "/api/auth/forgotten", { email: email });
  };
  
  static checkResetPasswordToken = (resetPasswordToken) => {
    return AuthApi._fetchWrapper("post", "/api/auth/checkPasswordResetToken", { resetToken: resetPasswordToken });
  };

  static getAccessToken = (userId, refreshToken) => {
    return AuthApi._fetchWrapper("post", "/api/auth/refresh", { userId: userId, refreshToken: refreshToken });
  };
}



