import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";
import DocumentTitle from "react-document-title";
import { withStyles } from "material-ui/styles";
import TextField from "material-ui/TextField";
import Card, { CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import Stepper, { Step, StepLabel, StepContent } from "material-ui/Stepper";
import * as SnackActions from "../../actions/snackActions";
import * as AuthActions from "../../actions/authActions";
import {isValidEmail} from "../../helpers/Validation";
import _debounce from "lodash/debounce";
import {has as _has} from "lodash/object";
import PasswordConfirmationArea from "../shared/PasswordConfirmationArea";

const styles = theme => ({
  container: {
    margin: theme.spacing.unit*3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap"
  },
  card: {
    minWidth: 450,
    maxWidth: 450
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  actionsContainer: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2
  },
  resetContainer: {
    padding: theme.spacing.unit * 3
  },
  title: {
    marginBottom: theme.spacing.unit,
    fontSize: 14
  },
  textField: {
    marginLeft: 0,
    marginRight: theme.spacing.unit*3,
    width: 280
  }
});

class RegisterForm extends React.Component {

  constructor(props) {
    super(props);

    this.debouncedValidate = _debounce(this.validateField, 200);

    this.refs = {};

    this.state = {
      newUser: {
        email: "",
        firstName: "",
        lastName: "",
        displayName: "",
        password: "",
        confirmPassword: ""
      },
      steps: [
        { valid: false, controls: { email: null } },
        { valid: false, controls: { firstName: null, lastName: null, displayName: null } },
        { valid: false, controls: { password: null, confirmPassword: null } }
      ],
      errors: {},
      loading: this.props.loading,
      activeStep: 0,
      formValid: false
    };
  }

  componentWillReceiveProps = (nextProps) => {
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

  handleNext = (event) => {
    event.preventDefault();
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  handleBack = (event) => {
    event.preventDefault();
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  onKeyDown = (event) => {
    if (event.nativeEvent.keyCode === 13) {
      if ((event.target.id === "email" && this.state.steps[0].valid) || (event.target.id === "displayName" && this.state.steps[1].valid))
        this.handleNext(event);
      else if (event.target.id === "confirmPassword" && this.state.steps[2].valid && this.state.formValid)
        this.onSubmit(event);
      else {
        switch (event.target.id) {
          case "firstName":
            this.refs.lastName.focus();
            break;
          case "lastName":
            this.refs.displayName.focus();
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
    let newUser = Object.assign({}, this.state.newUser);
    newUser[field] = value;
    return this.setState({ newUser: newUser }, () => { this.debouncedValidate(field, value); });
  };

  validateField = (fieldName, value) => {

    let fieldValidationErrors = Object.assign({}, this.state.errors);
    let newSteps = Object.assign({}, this.state.steps);

    switch(fieldName) {
      case "email": {
        let emailValid = isValidEmail(value);
        newSteps[0].valid = newSteps[0].controls.email = emailValid;
        if (emailValid)
          delete fieldValidationErrors[fieldName];
        else
          fieldValidationErrors[fieldName] = "Please provide a valid email address";
        break;
      }
      case "firstName":
      case "lastName":
      case "displayName": {
        let fieldValid = value.length >= 3;
        if (fieldValid)
          delete fieldValidationErrors[fieldName];
        else
          fieldValidationErrors[fieldName] = "Should be at least 3 characters long";
        newSteps[1].controls[fieldName] = fieldValid;
        newSteps[1].valid = newSteps[1].controls.firstName === true && newSteps[1].controls.lastName === true && newSteps[1].controls.displayName === true;
        break;
      }
      case "password":
      case "confirmPassword": {
        let passwordsMatch = this.state.newUser.password === this.state.newUser.confirmPassword;
        if (!passwordsMatch)
          fieldValidationErrors.confirmPassword = "Passwords do not match";
        else
          delete fieldValidationErrors.confirmPassword;
        newSteps[2].controls.confirmPassword = passwordsMatch;
        newSteps[2].valid = newSteps[2].controls.password === true && passwordsMatch;
        break;
      }
      default:
        break;
    }

    this.setState({
      errors: fieldValidationErrors,
      steps: newSteps
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

    let newSteps = Object.assign({}, this.state.steps);
    newSteps[2].controls.password = passwordValid;
    this.setState({ steps: newSteps });

    return {
      valid: passwordValid,
      message: pwHelperText
    };
  };

  validateForm = () => {
    let steps = this.state.steps;
    let allStepsValid = steps[0].valid === true && steps[1].valid === true && steps[2].valid === true;
    this.setState({ formValid: allStepsValid });
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.props.actions.createUser(this.state.newUser);
  };

  render() {
    const { classes } = this.props;
    const { activeStep, loading, steps, formValid } = this.state;

    const hasEmailError = this.stateHasProp("errors.email");
    const hasFirstNameError = this.stateHasProp("errors.firstName");
    const hasLastNameError = this.stateHasProp("errors.lastName");
    const hasDisplayNameError = this.stateHasProp("errors.displayName");
    const hasPasswordError = steps[2].controls.password === false;
    const hasConfirmPasswordError = this.stateHasProp("errors.confirmPassword");

    const hasStep1Error = loading || hasEmailError;
    const step1NotOkay = steps[0].controls.email === null ? true : hasStep1Error;
    const hasStep2Error = loading || hasFirstNameError || hasLastNameError || hasDisplayNameError;
    const step2NotOkay = steps[1].controls.firstName === null || steps[1].controls.lastName === null || steps[1].controls.displayName === null ? true : hasStep2Error;
    const hasStep3Error = loading || hasPasswordError || hasConfirmPasswordError;
    const step3NotOkay = steps[2].controls.password === null || steps[2].controls.confirmPassword === null ? true : hasStep3Error || !formValid;

    const fieldInputProps = { ref: this.setRef };
    const emailFieldInputProps = Object.assign({}, fieldInputProps, { type: "email", spellCheck: "false" });

    return (
      <DocumentTitle title="Our Voice :. Register">
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              Please follow the steps to create your account.
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
              <Step key="email">
                <StepLabel error={hasStep1Error}>Provide an email address</StepLabel>
                <StepContent>

                  <TextField
                    autoFocus
                    required
                    id="email"
                    label="Email address"
                    className={classes.textField}
                    margin="normal"
                    inputProps={emailFieldInputProps}
                    error={hasEmailError}
                    helperText={this.state.errors.email}
                    value={this.state.newUser.email}
                    onChange={this.onChange}
                    disabled={loading}
                    onKeyDown={this.onKeyDown}
                  />

                  <div className={classes.actionsContainer}>
                    <div>
                      <Button disabled onClick={this.handleBack} className={classes.button}>Back</Button>
                      <Button disabled={step1NotOkay} variant="raised" color="primary" onClick={this.handleNext} className={classes.button}>Next</Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
              <Step key="details">
                <StepLabel error={hasStep2Error}>Enter your details</StepLabel>
                <StepContent>

                  <TextField
                    autoFocus
                    required
                    id="firstName"
                    label="First name"
                    className={classes.textField}
                    margin="normal"
                    inputProps={fieldInputProps}
                    error={hasFirstNameError}
                    helperText={this.state.errors.firstName}
                    value={this.state.newUser.firstName}
                    onChange={this.onChange}
                    disabled={loading}
                    onKeyDown={this.onKeyDown}
                  />

                  <TextField
                    required
                    id="lastName"
                    label="Last name"
                    className={classes.textField}
                    margin="normal"
                    inputProps={fieldInputProps}
                    error={hasLastNameError}
                    helperText={this.state.errors.lastName}
                    value={this.state.newUser.lastName}
                    onChange={this.onChange}
                    disabled={loading}
                    onKeyDown={this.onKeyDown}
                  />

                  <TextField
                    required
                    id="displayName"
                    label="Display name"
                    className={classes.textField}
                    margin="normal"
                    inputProps={fieldInputProps}
                    error={hasDisplayNameError}
                    helperText={this.state.errors.displayName}
                    value={this.state.newUser.displayName}
                    onChange={this.onChange}
                    disabled={loading}
                    onKeyDown={this.onKeyDown}
                  />

                  <div className={classes.actionsContainer}>
                    <div>
                      <Button disabled={loading} onClick={this.handleBack} className={classes.button}>Back</Button>
                      <Button disabled={step2NotOkay} variant="raised" color="primary" onClick={this.handleNext} className={classes.button}>Next</Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
              <Step key="password">
                <StepLabel error={hasStep3Error}>Create a password</StepLabel>
                <StepContent>

                  <PasswordConfirmationArea
                    textFieldClassName={classes.textField}
                    fieldInputProps={fieldInputProps}
                    hasPasswordError={hasPasswordError}
                    passwordValue={this.state.newUser.password}
                    passwordValidator={this.validatePassword}
                    hasConfirmPasswordError={hasConfirmPasswordError}
                    confirmPasswordError={this.state.errors.confirmPassword}
                    confirmPasswordValue={this.state.newUser.confirmPassword}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    loading={loading}
                  />

                  <div className={classes.actionsContainer}>
                    <div>
                      <Button disabled={loading} onClick={this.handleBack} className={classes.button}>Back</Button>
                      <Button disabled={step3NotOkay} variant="raised" color="primary"
                              onClick={this.onSubmit} className={classes.button}>{loading ? (<span>Creating..</span>) : (<span>Register</span>)}</Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            </Stepper>
          </CardContent>
        </Card>
      </div>
      </DocumentTitle>
    );
  }
}

RegisterForm.propTypes = {
  loading: PropTypes.bool,
  errors: PropTypes.object,
  classes: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    loading: state.auth.loading
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, SnackActions, AuthActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(RegisterForm)));
