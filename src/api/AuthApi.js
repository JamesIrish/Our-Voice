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
    return AuthApi._fetchWrapper("post", "/api/auth/signin", model);
  };

  static authenticateUserAd = () => {
    return AuthApi._fetchWrapper("post", "/api/auth/sspi");
  };
  
  static forgotten = (email) => {
    return AuthApi._fetchWrapper("post", "/api/auth/forgotten", { email: email });
  };
  
  static checkPasswordResetToken = (passwordResetToken) => {
    return AuthApi._fetchWrapper("post", "/api/auth/checkPasswordResetToken", { passwordResetToken: passwordResetToken });
  };
  
  static resetPassword = (passwordResetToken, newPassword) => {
    return AuthApi._fetchWrapper("post", "/api/auth/resetPassword", { passwordResetToken: passwordResetToken, newPassword: newPassword });
  };

  static getAccessToken = (userId, refreshToken) => {
    return AuthApi._fetchWrapper("post", "/api/auth/refresh", { userId: userId, refreshToken: refreshToken });
  };
  
  static signOut = (userId, refreshToken) => {
    return AuthApi._fetchWrapper("post", "/api/auth/signout", { userId: userId, refreshToken: refreshToken });
  }
}



