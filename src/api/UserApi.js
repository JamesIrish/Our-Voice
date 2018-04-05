

export default class UserApi {
  
  static createUser = (model) => {
    return fetch('/api/user', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(model)
      });
  }
}



