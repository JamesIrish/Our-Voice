import React from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { withStyles } from "material-ui/styles";
import * as AuthActions from "../../actions/authActions";
import Typography from "material-ui/Typography";
import PasswordConfirmationArea from "../shared/PasswordConfirmationArea";
import _debounce from "lodash/debounce";
import {has as _has} from "lodash/object";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";
import Visibility from "material-ui-icons/Visibility";
import VisibilityOff from "material-ui-icons/VisibilityOff";

const styles = theme => ({
  textField: {
    marginLeft: 0,
    marginRight: theme.spacing.unit*3,
    width: 280
  }
});

class PasswordPage extends React.Component {

  constructor(props) {
    super(props);

    this.debouncedValidate = _debounce(this.validateField, 200);

    this.refs = {};

    this.state = {
      currentPassword: "",
      password: "",
      confirmPassword: "",
      errors: {},
      formValid: false,
      showCurrentPassword: false
    };
  }

  componentWillReceiveProps = (nextProps) => {

  };

  setRef = element => {
    if (element && element.id) {
      let newRefs = Object.assign({}, this.refs);
      newRefs[element.id] = element;
      this.refs = newRefs;
    }
  };

  stateHasProp = (propPath) => {
    return _has(this.state, propPath);
  };

  handleClickShowCurrentPassword = () => {
    this.setState({ showCurrentPassword: !this.state.showCurrentPassword });
  };

  onKeyDown = (event) => {
    if (event.nativeEvent.keyCode === 13) {
      if (event.target.id === "confirmPassword" && this.state.steps[2].valid && this.state.formValid)
        this.onSubmit(event);
      else {
        switch (event.target.id) {
          case "password":
            this.refs.confirmPassword.focus();
            break;
        }
        event.preventDefault();
      }
    }
  };

  onChange = (event) => {
    event.preventDefault();
    const field = event.target.id;
    const value = event.target.value;
    let newState = Object.assign({}, this.state);
    newState[field] = value;
    return this.setState({ credentials: newState }, () => { this.debouncedValidate(field, value); });
  };

  validateField = (fieldName, value) => {
    let fieldValidationErrors = Object.assign({}, this.state.errors);
    switch(fieldName) {
      case "password":
      case "confirmPassword": {
        let passwordsMatch = this.state.password === this.state.confirmPassword;
        if (!passwordsMatch)
          fieldValidationErrors.confirmPassword = "Passwords do not match";
        else
          delete fieldValidationErrors.confirmPassword;
        break;
      }
      default:
        break;
    }

    this.setState({
      errors: fieldValidationErrors
    }, this.validateForm);
  };

  validatePassword = (password, strength) => {
    let passwordValid = strength.score > 2;

    let pwHelperText = "";
    if (pwHelperText === "" && strength !== null && strength.feedback !== null)
      pwHelperText = strength.feedback.warning || "";
    if (pwHelperText === "" && strength.feedback.suggestions.length > 0)
      pwHelperText = strength.feedback.suggestions[0] || "";
    if (pwHelperText === "" && strength.score > 2)
      pwHelperText = "Password strength: " + (strength.score === 4 ? "excellent" : "good");

    return {
      valid: passwordValid,
      message: pwHelperText
    };
  };

  validateForm = () => {
    this.setState({ formValid: false });
  };

  onSubmit = (event) => {
    event.preventDefault();
    //this.props.actions.changePassword(this.state);
  };

  render() {
    const { classes, activeDirectoryEnabled, configLoading, auth } = this.props;
    const { currentPassword, password, confirmPassword, showCurrentPassword } = this.state;
    const loading = false;

    const hasCurrentPasswordError = this.stateHasProp("errors.currentPassword");
    const hasPasswordError = this.stateHasProp("errors.password");
    const hasConfirmPasswordError = this.stateHasProp("errors.confirmPassword");
  
    const currentPasswordError = this.state.errors.currentPassword;
    
    const fieldInputProps = { ref: this.setRef };

    const adEnabled = false;

    return (
      <div>
      {adEnabled ?
        (
          <Typography variant="subheading">You are using Windows Single Sign-on and cannot change your password here.</Typography>
        ) : (
          <div>
            <Typography variant="subheading" gutterBottom align="left">Change your password using the form below</Typography>
            <Typography variant="caption" gutterBottom align="left">If anything seems unusual or you have any concerns please contact us at <a href="mailto:support@our-voice.io">support@our-voice.io</a>.</Typography>
  
            <FormControl id="passwordCtl" error={hasPasswordError} style={{marginTop: "16px", marginLeft: 0, marginRight: "24px", width: 280}}>
    
              <InputLabel htmlFor="currentpassword">
                Current password
              </InputLabel>
    
              <Input
                disabled={loading}
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                id="currentpassword"
                onChange={this.onChangeWrapper}
                inputProps={fieldInputProps}
                onKeyDown={this.onKeyDown}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowCurrentPassword}
                      onMouseDown={this.handleMouseDownPassword}
                      tabIndex="-1"
                    >
                      {showCurrentPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                }
              />
    
              <FormHelperText id="password-helper-text">
                {currentPasswordError}
              </FormHelperText>
  
            </FormControl>
            
            <PasswordConfirmationArea
              autoFocusEnabled={false}
              textFieldClassName={classes.textField}
              fieldInputProps={fieldInputProps}
              hasPasswordError={hasPasswordError}
              passwordLabel="New password"
              passwordError={this.state.errors.password}
              passwordValue={password}
              passwordValidator={this.validatePassword}
              confirmPasswordLabel="Confirm new password"
              hasConfirmPasswordError={hasConfirmPasswordError}
              confirmPasswordError={this.state.errors.confirmPassword}
              confirmPasswordValue={confirmPassword}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              loading={loading}
            />
            
            <Button variant="raised" color="primary">Save</Button>

          </div>
        )}
      </div>
    );
  }
}

PasswordPage.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  configLoading: PropTypes.bool.isRequired,
  activeDirectoryEnabled: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired
};

function getAdEnabled(state) {
  if (!state.config) return false;
  if (!state.config.activeDirectory) return false;
  return state.config.activeDirectory.enabled;
}
function mapStateToProps(state) {
  return {
    configLoading: state.config.loading,
    activeDirectoryEnabled: getAdEnabled(state),
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, AuthActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PasswordPage));

/*

<FormControl id="currentPasswordCtl" error={hasCurrentPasswordError} style={{marginTop: "16px", marginLeft: 0, marginRight: "24px", width: 280}}>

              <InputLabel htmlFor="currentPassword">
                Current password
              </InputLabel>





            </FormControl>

            <Divider/>

<Input
                disabled={loading}
                className={classes.textField}
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                id="currentPassword"
                onChange={this.onChangeWrapper}
                inputProps={fieldInputProps}
                onKeyDown={this.onKeyDown}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowCurrentPassword}
                      tabIndex="-1"
                    >
                      {showCurrentPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                }
              />


              <FormHelperText id="current-password-helper-text">
                {this.state.errors.currentPassword}
              </FormHelperText>


 */
