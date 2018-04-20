import React from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import DocumentTitle from "react-document-title";
import { withStyles } from "material-ui/styles";
import Card, { CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import * as SnackActions from "../../actions/snackActions";
import * as LoginActions from "../../actions/authActions";
import {has as _has} from "lodash/object";
import PasswordConfirmationArea from "../shared/PasswordConfirmationArea";
import _debounce from "lodash/debounce";

const styles = theme => ({
  container: {
    margin: theme.spacing.unit*3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap",
    textAlign: "center"
  },
  card: {
    minWidth: 400,
    maxWidth: 400
  },
  title: {
    marginBottom: theme.spacing.unit,
    fontSize: 14
  },
  textField: {
    marginLeft: 0,
    marginRight: 0,
    width: 280
  }
});

class ResetForm extends React.Component {

  constructor(props) {
    super(props);

    this.debouncedValidate = _debounce(this.validateField, 300);

    this.state = {
      checking: true,
      credentials: {
        password: "",
        confirmPassword: "",
      },
      errors: {},
      loading: props.loading,
      error: props.error
    };
  }

  componentDidMount = () => {
    let passwordResetToken = this.props.params.resetToken;
    this.props.actions.checkPasswordResetToken(passwordResetToken)
      .finally(() => this.setState({checking: false}));
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      loading: nextProps.loading,
      error: nextProps.error
    });
  };

  stateHasProp = (propPath) => {
    return _has(this.state, propPath);
  };

  onChange = (event) => {
    event.preventDefault();
    const field = event.target.id;
    const value = event.target.value;
    let credentials = Object.assign({}, this.state.credentials);
    credentials[field] = value;

    return this.setState({ credentials: credentials }, () => { this.debouncedValidate(field, value); });
  };

  onKeyDown = (event) => {
    if (event.nativeEvent.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      if (event.target.id === "confirmPassword")
        this.onSubmit(event);
    }
  };

  validateField = (fieldName, value) => {
    let fieldValidationErrors = Object.assign({}, this.state.errors);

    if (fieldName === "password")
    {
        if (value.length >= 8)
          delete fieldValidationErrors[fieldName];
        else
          fieldValidationErrors[fieldName] = "should be at least 8 characters long";
    }

    if (this.state.credentials.password !== this.state.credentials.confirmPassword)
      fieldValidationErrors.confirmPassword = "passwords do not match";
    else
      delete fieldValidationErrors.confirmPassword;

    this.setState({errors: fieldValidationErrors});
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.props.actions.resetPassword(this.props.params.resetToken, this.state.credentials.password);
  };

  render() {
    const { classes } = this.props;
    const { loading, checking, error } = this.state;

    const hasPasswordError = this.stateHasProp("errors.password");
    const hasConfirmPasswordError = this.stateHasProp("errors.confirmPassword");

    const saveButtonDisabled = loading || checking || hasPasswordError || hasConfirmPasswordError;

    const fieldInputProps = {

    };

    const ErrorDisplay = () => { return (<Typography style={{marginTop: 60, marginBottom: 40, color: "red"}}>Error: {error}</Typography>);};
    const CheckingDisplay = () => { return (<Typography style={{marginTop: 60, marginBottom: 40}}>Please wait... checking details...</Typography>);};
    const Display = () => {
      if (error) return ErrorDisplay();
      if (checking) return CheckingDisplay();
      return null;
    };

    return (
      <DocumentTitle title="Our Voice :. Reset your password">
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardContent>
            {error || checking
              ? <Display/>
              : (<div>
                  <Typography className={classes.title} color="textSecondary" style={{textAlign: "left"}}>
                    Enter your new password
                  </Typography>

                  <PasswordConfirmationArea
                    classes={classes}
                    fieldInputProps={fieldInputProps}
                    hasPasswordError={hasPasswordError}
                    passwordError={this.state.errors.password}
                    passwordValue={this.state.credentials.password}
                    hasConfirmPasswordError={hasConfirmPasswordError}
                    confirmPasswordError={this.state.errors.confirmPassword}
                    confirmPasswordValue={this.state.credentials.confirmPassword}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    loading={loading}/>

                  <Button color="primary"
                          disabled={saveButtonDisabled}
                          variant="raised"
                          size="large"
                          style={{marginTop: 16}}
                          onClick={this.onSubmit}>
                    {loading ? (<span>Saving...</span>) : (<span>Save</span>)}
                  </Button>
                  </div>
                )}
          </CardContent>
        </Card>
      </div>
      </DocumentTitle>
    );
  }
}

ResetForm.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string
};

function mapStateToProps(state) {
  let error = state.auth.error;
  if (state.auth.passwordResetTokenOkay === false)
    error = state.auth.passwordResetTokenError;

  return {
    loading: state.auth.loading,
    error: error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, SnackActions, LoginActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ResetForm));
