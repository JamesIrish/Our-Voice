import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Card, { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';

const styles = theme => ({
  container: {
    margin: theme.spacing.unit*3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'wrap'
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
  
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      email: null,
      password: null,
      confirmPassword: null,
      firstName: null,
      lastName: null,
      displayName: null,
      errors: {},
      loading: false,
      activeStep: 0,
    };
  }
  
  handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    });
  };
  
  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };
  
  onChange = (event) => {
    const field = event.target.id;
    let credentials = Object.assign({}, this.state.credentials);
    credentials[field] = event.target.value;
    return this.setState({credentials: credentials});
  };
  
  onSubmit = () => {
    // handle auth
    //console.log('**handle auth**', this.state.credentials);
  };
  
  render() {
    const {classes} = this.props;
    const { activeStep } = this.state;
  
    return (
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
                  />
                  
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button disabled onClick={this.handleBack} className={classes.button}>Back</Button>
                      <Button variant="raised" color="primary" onClick={this.handleNext} className={classes.button}>Next</Button>
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
                  />
                  
                  <TextField
                    id="lastName"
                    label="Last name"
                    className={classes.textField}
                    margin="normal"
                    error={this.state.errors.lastName}
                    helperText={this.state.errors.lastName}
                    onChange={this.onChange}
                  />
  
                  <TextField
                    id="displayName"
                    label="Display name"
                    className={classes.textField}
                    margin="normal"
                    error={this.state.errors.displayName}
                    helperText={this.state.errors.displayName}
                    onChange={this.onChange}
                  />
      
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button onClick={this.handleBack} className={classes.button}>Back</Button>
                      <Button variant="raised" color="primary" onClick={this.handleNext} className={classes.button}>Next</Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
              <Step key="details">
                <StepLabel>Enter your details</StepLabel>
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
                  />
      
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button onClick={this.handleBack} className={classes.button}>Back</Button>
                      <Button variant="raised" color="primary" onClick={this.handleNext} className={classes.button}>Register</Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            </Stepper>
          </CardContent>
        </Card>
      </div>
    );
  }
}

RegisterForm.propTypes = {
  loading: PropTypes.bool,
  errors: PropTypes.object,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RegisterForm);
