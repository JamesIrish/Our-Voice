import React from "react";
import PropTypes from "prop-types";
import {withRouter, Link} from "react-router";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import DocumentTitle from "react-document-title";
import { withStyles } from "material-ui/styles";
import TextField from "material-ui/TextField";
import Card, { CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Divider from "material-ui/Divider";
import Typography from "material-ui/Typography";
import * as SnackActions from "../../actions/snackActions";
import * as AuthActions from "../../actions/authActions";
import _get from "lodash/get";

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

class SignInForm extends React.Component {

  constructor(props) {
    super(props);

    this.passwordRef = null;
    this.setPasswordRef = element => {
      this.passwordRef = element;
    };

    this.state = {
      credentials: {},
      errors: {},
      configLoading: props.configLoading,
      activeDirectoryEnabled: props.activeDirectoryEnabled,
      authLoading: props.authLoading,
      error: props.error
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      configLoading: nextProps.configLoading,
      activeDirectoryEnabled: nextProps.activeDirectoryEnabled,
      authLoading: nextProps.authLoading,
      error: nextProps.error
    });
  };

  onChange = (event) => {
    event.preventDefault();
    const field = event.target.id;
    let credentials = Object.assign({}, this.state.credentials);
    credentials[field] = event.target.value;
    return this.setState({ credentials: credentials });
  };

  onKeyDown = (event) => {
    if (event.nativeEvent.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      if (event.target.id === "email")
        this.passwordRef.focus();
      if (event.target.id === "password")
        this.onSubmit(event);
    }
  };

  onSubmit = (event) => {
    event.preventDefault();
    let redirect = _get(this.props.location, "query.redirect", null);
    this.props.actions.signInUser(this.state.credentials, redirect);
  };
  onSubmitAd = (event) => {
    event.preventDefault();
    this.props.actions.signInAdUser();
  };

  render() {
    const { classes } = this.props;
    const { activeDirectoryEnabled, authLoading } = this.state;
    
    const emailInputProps = {
      type: "email",
      spellCheck: false
    };
    const passwordInputProps = {
      ref: this.setPasswordRef
    };

    const ActiveDirectory = () => {
      if (activeDirectoryEnabled){
        return (
          <div>
            <Divider style={{marginTop: 24, marginBottom: 24}}/>
            <Button variant="raised" disabled={authLoading} onClick={this.onSubmitAd}>
              <img src="/microsoft-80660_16.png" style={{marginRight: 8}} />
              Sign in with a domain account
            </Button>
          </div>);
      }
      return null;
    };

    return (
      <DocumentTitle title="Our Voice :. Sign in">
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" style={{textAlign: "left" }}>
              Please sign in or <Link to="register">register for an account</Link>.
            </Typography>

            <TextField
              autoFocus
              required
              id="email"
              label="Email address"
              className={classes.textField}
              margin="normal"
              inputProps={emailInputProps}
              error={this.state.errors.email}
              helperText={this.state.errors.email}
              onChange={this.onChange}
              disabled={authLoading}
              onKeyDown={this.onKeyDown}
            />

            <TextField
              required
              id="password"
              inputProps={passwordInputProps}
              label="Password"
              type="password"
              className={classes.textField}
              margin="normal"
              error={this.state.errors.password}
              helperText={this.state.errors.password}
              onChange={this.onChange}
              disabled={authLoading}
              onKeyDown={this.onKeyDown}
            />

            <Button size="large"
                    disabled={authLoading}
                    style={{marginTop: 16, marginRight: 48}}
                    component={Link}
                    to={{pathname: "/forgotten", state: { email: this.state.credentials.email }}}>
              Forgotten
            </Button>

            <Button color="primary"
                    disabled={authLoading}
                    variant="raised"
                    size="large"
                    style={{marginTop: 16}}
                    onClick={this.onSubmit}>
              {authLoading ? "Signing in..." : "Sign in"}
            </Button>

           <ActiveDirectory/>

          </CardContent>
        </Card>
      </div>
      </DocumentTitle>
    );
  }
}

SignInForm.propTypes = {
  errors: PropTypes.object,
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  configLoading: PropTypes.bool.isRequired,
  activeDirectoryEnabled: PropTypes.bool.isRequired,
  authLoading: PropTypes.bool.isRequired,
  error: PropTypes.string
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
    authLoading: state.auth.loading,
    error: state.auth.error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, SnackActions, AuthActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(SignInForm)));
