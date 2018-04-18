import React from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import DocumentTitle from "react-document-title";
import { withStyles } from "material-ui/styles";
import TextField from "material-ui/TextField";
import Card, { CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import * as SnackActions from "../../actions/snackActions";
import * as LoginActions from "../../actions/loginActions";
import {has as _has} from "lodash/object";
import {isValidEmail} from "../../helpers/Validation";

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

class ForgottenForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: props.location.state.email || "",
      isEmailValid: false,
      emailError: "please provide your email address",
      configLoading: props.configLoading,
      authLoading: props.authLoading,
      error: props.error
    };
  }
  
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      configLoading: nextProps.configLoading,
      authLoading: nextProps.authLoading,
      error: nextProps.error
    });
  };
  
  stateHasProp = (propPath) => {
    return _has(this.state, propPath);
  };

  onChange = (event) => {
    event.preventDefault();
    let email = event.target.value;
    let emailValid = isValidEmail(email);
    return this.setState({
      email: email,
      isEmailValid: emailValid,
      emailError: emailValid ? "" : "please provide a valid email address"
    });
  };

  onKeyDown = (event) => {
    if (event.nativeEvent.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      if (event.target.id === "email")
        this.onSubmit(event);
    }
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    this.props.actions.forgotten(this.state.email)
      .finally(() => {
        this.props.actions.showSnack("Done, if you have an account an email with instructions has been sent to you.");
        this.setState({ email: "" });
      });
  };

  render() {
    const { classes } = this.props;
    const { authLoading, email, isEmailValid, emailError } = this.state;
    
    const emailInputProps = {
      type: "email",
      spellCheck: false
    };
    
    const hasEmailError = !isEmailValid;
    const buttonDisabled = authLoading || !isEmailValid;
    
    return (
      <DocumentTitle title="Voice :. Reset password">
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" style={{textAlign: "left" }}>
              Enter your email and press "Reset" to be emailed a link with further instructions.
            </Typography>

            <TextField
              required
              autoFocus
              id="email"
              label="Email address"
              className={classes.textField}
              margin="normal"
              inputProps={emailInputProps}
              error={hasEmailError}
              helperText={emailError}
              onChange={this.onChange}
              disabled={authLoading}
              onKeyDown={this.onKeyDown}
              value={email}
            />

            <Button color="primary"
                    disabled={buttonDisabled}
                    variant="raised"
                    size="large"
                    style={{marginTop: 16}}
                    onClick={this.onSubmit}>
              Reset
            </Button>

          </CardContent>
        </Card>
      </div>
      </DocumentTitle>
    );
  }
}

ForgottenForm.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  configLoading: PropTypes.bool.isRequired,
  authLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  location: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    configLoading: state.config.loading,
    authLoading: state.auth.loading,
    error: state.auth.error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, SnackActions, LoginActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ForgottenForm));
