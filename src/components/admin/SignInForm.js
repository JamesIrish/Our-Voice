import React from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";
import { withStyles } from "material-ui/styles";
import TextField from "material-ui/TextField";
import Card, { CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Divider from "material-ui/Divider";
import Typography from "material-ui/Typography";
import * as SnackActions from "../../actions/snackActions";
import * as LoginActions from "../../actions/loginActions";

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

  constructor() {
    super();

    this.passwordRef = null;
    this.setPasswordRef = element => {
      this.passwordRef = element;
    };
    
    this.state = {
      credentials: {},
      error: null,
      errors: {},
      loading: false
    };
  }
  
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      loading: nextProps.loading,
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
    this.setState({ loading: true });
    this.props.actions.signInUser(this.state.credentials);
  };

  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    const pwInputProps = {
      ref: this.setPasswordRef
    };

    return (
      <DocumentTitle title="Voice :. Sign in">
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" style={{textAlign: "left" }}>
              Please sign in or <Link to="register">register for an account</Link>.
            </Typography>

            <TextField
              required
              autoFocus
              id="email"
              label="Email address"
              className={classes.textField}
              margin="normal"
              error={this.state.errors.email}
              helperText={this.state.errors.email}
              onChange={this.onChange}
              disabled={loading}
              onKeyDown={this.onKeyDown}
            />

            <TextField
              required
              id="password"
              inputProps={pwInputProps}
              label="Password"
              type="password"
              className={classes.textField}
              margin="normal"
              error={this.state.errors.password}
              helperText={this.state.errors.password}
              onChange={this.onChange}
              disabled={loading}
              onKeyDown={this.onKeyDown}
            />

            <Button size="large"
                    disabled={loading}
                    style={{marginTop: 16, marginRight: 48}}
                    component={Link}
                    to="forgotten">Forgotten</Button>

            <Button color="primary"
                    disabled={loading}
                    variant="raised"
                    size="large"
                    style={{marginTop: 16}}
                    onClick={this.onSubmit}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <Divider style={{marginTop: 24, marginBottom: 24}}/>

            <Button variant="raised" disabled={loading}>
              <img src="/microsoft-80660_16.png" style={{marginRight: 8}} />
              Sign in with a domain account
            </Button>

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
  history: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SignInForm));
