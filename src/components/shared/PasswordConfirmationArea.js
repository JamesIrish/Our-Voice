import React from "react";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField";
import { LinearProgress } from "material-ui/Progress";

function loadZXCVBN() {
  let ZXCVBN_SRC = "zxcvbn.js";
  let first, s;
  s = document.createElement("script");
  s.src = ZXCVBN_SRC;
  s.type = "text/javascript";
  s.async = true;
  first = document.getElementsByTagName("script")[0];
  return first.parentNode.insertBefore(s, first);
}

class PasswordConfirmationArea extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      strength: null,
      strengthPercent: 20
    };
  }
  
  componentWillMount = () => {
    loadZXCVBN();
  };
  
  onChangeWrapper = (event) => {
    const field = event.target.id;
    const value = event.target.value;
    if (field === "password") {
      let results = null;
      try {
        // eslint-disable-next-line no-undef
        results = zxcvbn(value);
        this.setState({ strength: results, strengthPercent: results.score*20 });
        console.log("Password strength result: ", results);
      } catch (err) {
        console.error("Error evaluating password strength.", err);
      }
    }
    this.props.onChange(event);
  };
  
  render() {
    const {
      classes,
      fieldInputProps,
      passwordError,
      passwordValue,
      hasConfirmPasswordError,
      confirmPasswordError,
      confirmPasswordValue,
      onKeyDown,
      loading
    } = this.props;
    
    const { strengthPercent } = this.state;
    
    let finalPasswordError = passwordError;
    if (
      (finalPasswordError === null || finalPasswordError === undefined || finalPasswordError === "")
      && this.state.strength !== null
      && this.state.strength.feedback !== null
    )
      finalPasswordError = this.state.strength.feedback.warning;
    
    const hasPasswordError = this.props.hasConfirmPasswordError || finalPasswordError !== null;
    
    const progressClasses = {
      root: "strengthRoot",
      barColorPrimary: "strengthBar"
    };
    
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
          helperText={finalPasswordError}
          value={passwordValue}
          onChange={this.onChangeWrapper}
          disabled={loading}
          onKeyDown={onKeyDown}
        />
  
        <LinearProgress color="primary" variant="determinate" value={strengthPercent} classes={progressClasses} />
        
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
          onChange={this.onChangeWrapper}
          disabled={loading}
          onKeyDown={onKeyDown}
        />
      
      </div>
    );
  }
}

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
