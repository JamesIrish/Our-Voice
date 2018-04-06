export default class Auth {
  
  // checks if the user is authenticated
  isAuthenticated = () => {
    // Check whether the current time is past the
    // access token's expiry time
    let expiry = localStorage.getItem("expires_at");
    if (!expiry) return false;
    let expiresAt = JSON.parse(expiry);
    return new Date().getTime() < expiresAt;
  }
}
