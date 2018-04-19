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
import * as LoginActions from "../../actions/authActions";
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
  
    let email = props.location.state.email || "";
    let emailValid = isValidEmail(email);
    
    this.state = {
      email: email,
      isEmailValid: emailValid,
      emailError: emailValid ? "" : "please provide a valid email address",
      loading: props.loading,
      error: props.error
    };
  }
  
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
    this.props.actions.forgotten(this.state.email);
  };

  render() {
    const { classes } = this.props;
    const { loading, email, isEmailValid, emailError } = this.state;
    
    const emailInputProps = {
      type: "email",
      spellCheck: false
    };
    
    const hasEmailError = !isEmailValid;
    const buttonDisabled = loading || !isEmailValid;
    
    return (
      <DocumentTitle title="Our Voice :. Reset password">
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
              disabled={loading}
              onKeyDown={this.onKeyDown}
              value={email}
            />

            <Button color="primary"
                    disabled={buttonDisabled}
                    variant="raised"
                    size="large"
                    style={{marginTop: 16}}
                    onClick={this.onSubmit}>
              {loading ? (<span>Resetting...</span>) : (<span>Reset</span>)}
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
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  location: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    loading: state.auth.loading,
    error: state.auth.error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, SnackActions, LoginActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ForgottenForm));
