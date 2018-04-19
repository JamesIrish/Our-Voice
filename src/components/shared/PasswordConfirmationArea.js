import React from "react";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField";

const PasswordConfirmationArea = (
  {
    classes,
    fieldInputProps,
    hasPasswordError,
    passwordError,
    passwordValue,
    hasConfirmPasswordError,
    confirmPasswordError,
    confirmPasswordValue,
    onChange,
    onKeyDown,
    loading
  }) => {
  return (
    <div>
      
      <TextField
        autoFocus
        id="password"
        label="Password"
        type="password"
        className={classes.textField}
        margin="normal"
        inputProps={fieldInputProps}
        error={hasPasswordError}
        helperText={passwordError}
        value={passwordValue}
        onChange={onChange}
        disabled={loading}
        onKeyDown={onKeyDown}
      />
  
      <TextField
        id="confirmPassword"
        label="Confirm password"
        type="password"
        className={classes.textField}
        margin="normal"
        inputProps={fieldInputProps}
        error={hasConfirmPasswordError}
        helperText={confirmPasswordError}
        value={confirmPasswordValue}
        onChange={onChange}
        disabled={loading}
        onKeyDown={onKeyDown}
      />
      
    </div>
  );
};

PasswordConfirmationArea.propTypes = {
  classes: PropTypes.object.isRequired,
  fieldInputProps: PropTypes.object.isRequired,
  hasPasswordError: PropTypes.bool.isRequired,
  passwordError: PropTypes.string,
  passwordValue: PropTypes.string.isRequired,
  hasConfirmPasswordError: PropTypes.bool.isRequired,
  confirmPasswordError: PropTypes.string,
  confirmPasswordValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default PasswordConfirmationArea;
