export function isValidEmail(email) {
  return email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) !== null;
}

export function validatePassword(password, strength) {
  let passwordValid = strength.score > 2;
  
  let pwHelperText = "";
  if (pwHelperText === "" && strength !== null && strength.feedback !== null)
    pwHelperText = strength.feedback.warning || "";
  if (pwHelperText === "" && strength.feedback.suggestions.length > 0)
    pwHelperText = strength.feedback.suggestions[0] || "";
  if (pwHelperText === "" && strength.score > 2)
    pwHelperText = "Password strength: " + (strength.score === 4 ? "excellent" : "good");
  
  let newSteps = Object.assign({}, this.state.steps);
  newSteps[2].controls.password = passwordValid;
  this.setState({ steps: newSteps });
  
  return {
    valid: passwordValid,
    message: pwHelperText
  };
}
