export default class AuthApi {
  
  static authenticateUser = (model) => {
    return new Promise((resolve, reject) =>
    {
      fetch('/api/auth', {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
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



