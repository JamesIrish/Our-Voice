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
import * as Validation from "../../helpers/Validation";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";
import Visibility from "material-ui-icons/Visibility";
import VisibilityOff from "material-ui-icons/VisibilityOff";
import * as Constants from "../../helpers/Constants";

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

    this.debouncedValidate = _debounce(this.validateField, Constants.VALIDATION_DEBOUNCE);

    this.refs = {};

    this.state = {
      credentials: {
        currentPassword: "",
        password: "",
        confirmPassword: ""
      },
      loading: false,
      errors: {},
      formValid: false,
      showCurrentPassword: false
    };
  }
  
  componentWillReceiveProps = (nextProps) => {
    this.props.configLoading = nextProps.configLoading;
    this.props.activeDirectoryEnabled = nextProps.activeDirectoryEnabled;
    
    this.setState({
      loading: nextProps.loading
    });
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
          case "currentpassword":
            this.refs.password.focus();
            break;
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
    let newState = Object.assign({}, this.state.credentials);
    newState[field] = value;
    return this.setState({ credentials: newState }, () => { this.debouncedValidate(field, value); });
  };

  validateField = (fieldName, value) => {
    let fieldValidationErrors = Object.assign({}, this.state.errors);
    switch(fieldName) {
      case "password":
      case "confirmPassword": {
        
        //if (!passwordsMatch)
        //  fieldValidationErrors.confirmPassword = "Passwords do not match";
        //else
        //  delete fieldValidationErrors.confirmPassword;
        break;
      }
      default:
        break;
    }

    this.setState({
      errors: fieldValidationErrors
    }, this.validateForm);
  };

  validateForm = () => {
    this.setState({ formValid: false });
  };

  onSubmit = (event) => {
    event.preventDefault();
    //this.props.actions.changePassword(this.state.credentials);
  };

  render() {
    const { classes, activeDirectoryEnabled } = this.props;
    const { credentials, showCurrentPassword, loading } = this.state;

    const { currentPassword, password, confirmPassword } = credentials;
    
    const hasCurrentPasswordError = this.stateHasProp("errors.currentPassword");
    const hasPasswordError = this.stateHasProp("errors.password");
    const hasConfirmPasswordError = this.stateHasProp("errors.confirmPassword");
  
    const currentPasswordError = this.state.errors.currentPassword;
    
    const fieldInputProps = { ref: this.setRef };

    return (
      <div>
      {activeDirectoryEnabled ?
        (
          <Typography variant="subheading">You are using Windows Single Sign-on and cannot change your password here.</Typography>
        ) : (
          <div>
            <Typography variant="subheading" gutterBottom align="left">Change your password using the form below</Typography>
            <Typography variant="caption" gutterBottom align="left">If anything seems unusual or you have any concerns please contact us at <a href="mailto:support@our-voice.io">support@our-voice.io</a>.</Typography>
  
            <FormControl id="passwordCtl" error={hasCurrentPasswordError} style={{marginTop: "16px", marginLeft: 0, marginRight: "24px", width: 280}}>
    
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
              passwordValidator={Validation.validatePassword}
              confirmPasswordLabel="Confirm new password"
              hasConfirmPasswordError={hasConfirmPasswordError}
              confirmPasswordError={this.state.errors.confirmPassword}
              confirmPasswordValue={confirmPassword}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              loading={loading}
            />
            
            <Button variant="raised" color="primary" onClick={this.onSubmit}>Save</Button>

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
