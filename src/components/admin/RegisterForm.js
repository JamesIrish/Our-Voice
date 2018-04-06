import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";
import DocumentTitle from "react-document-title";
import { withStyles } from "material-ui/styles";
import TextField from "material-ui/TextField";
import Card, { CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import Stepper, { Step, StepLabel, StepContent } from "material-ui/Stepper";
import UserApi from "../../api/UserApi";
import * as snackActions from "../../actions/snackActions";

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

  constructor() {
    super();

    this.state = {
      newUser:{},
      errors: {},
      loading: false,
      activeStep: 0
    };
  }

  handleNext = (event) => {
    event.preventDefault();
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  handleBack = (event) => {
    event.preventDefault();
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  onChange = (event) => {
    event.preventDefault();
    const field = event.target.id;
    let newUser = Object.assign({}, this.state.newUser);
    newUser[field] = event.target.value;
    return this.setState({ newUser: newUser });
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    UserApi.createUser(this.state.newUser)
      .then(() => {
        this.setState({ loading: false });
        this.props.history.push("/signin");
        this.props.actions.showSnack("User account created. Please sign in.");
      })
      .catch(error => {
        this.setState({ loading: false });
        this.props.actions.showSnack("An error occurred");
        console.log(error);
      });
  };

  render() {
    const { classes } = this.props;
    const { activeStep, loading } = this.state;

    return (
      <DocumentTitle title="Voice :. Register">
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              Please follow the steps to create your account.
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
              <Step key="email">
                <StepLabel>Provide an email address</StepLabel>
                <StepContent>

                  <TextField
                    id="email"
                    label="Email address"
                    className={classes.textField}
                    margin="normal"
                    error={this.state.errors.email}
                    helperText={this.state.errors.email}
                    onChange={this.onChange}
                    disabled={loading}
                  />

                  <div className={classes.actionsContainer}>
                    <div>
                      <Button disabled onClick={this.handleBack} className={classes.button}>Back</Button>
                      <Button variant="raised" color="primary" onClick={this.handleNext} className={classes.button} disabled={loading}>Next</Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
              <Step key="details">
                <StepLabel>Enter your details</StepLabel>
                <StepContent>

                  <TextField
                    id="firstName"
                    label="First name"
                    className={classes.textField}
                    margin="normal"
                    error={this.state.errors.firstName}
                    helperText={this.state.errors.firstName}
                    onChange={this.onChange}
                    disabled={loading}
                  />

                  <TextField
                    id="lastName"
                    label="Last name"
                    className={classes.textField}
                    margin="normal"
                    error={this.state.errors.lastName}
                    helperText={this.state.errors.lastName}
                    onChange={this.onChange}
                    disabled={loading}
                  />

                  <TextField
                    id="displayName"
                    label="Display name"
                    className={classes.textField}
                    margin="normal"
                    error={this.state.errors.displayName}
                    helperText={this.state.errors.displayName}
                    onChange={this.onChange}
                    disabled={loading}
                  />

                  <div className={classes.actionsContainer}>
                    <div>
                      <Button disabled={loading} onClick={this.handleBack} className={classes.button}>Back</Button>
                      <Button disabled={loading} variant="raised" color="primary" onClick={this.handleNext} className={classes.button}>Next</Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
              <Step key="password">
                <StepLabel>Create a password</StepLabel>
                <StepContent>

                  <TextField
                    id="password"
                    label="Password"
                    type="password"
                    className={classes.textField}
                    margin="normal"
                    error={this.state.errors.password}
                    helperText={this.state.errors.password}
                    onChange={this.onChange}
                    disabled={loading}
                  />

                  <TextField
                    id="confirmPassword"
                    label="Confirm password"
                    type="password"
                    className={classes.textField}
                    margin="normal"
                    error={this.state.errors.confirmPassword}
                    helperText={this.state.errors.confirmPassword}
                    onChange={this.onChange}
                    disabled={loading}
                  />

                  <div className={classes.actionsContainer}>
                    <div>
                      <Button disabled={loading} onClick={this.handleBack} className={classes.button}>Back</Button>
                      <Button disabled={loading} variant="raised" color="primary"
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
  history: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(snackActions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(RegisterForm));
