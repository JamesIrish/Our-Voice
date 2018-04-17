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
import * as LoginActions from "../../actions/loginActions";
import {has as _has} from "lodash/object";
import PasswordConfirmationArea from "../shared/PasswordConfirmationArea";

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

    this.state = {
      checking: true,
      password: "",
      confirmPassword: "",
      errors: {},
      loading: props.loading,
      error: props.error
    };
  }
  
  componentDidMount = () => {
    let passwordResetToken = this.props.params.resetToken;
    this.props.actions.checkResetPasswordToken(passwordResetToken);
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
    return this.setState({ email: event.target.value });
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
    this.setState({ loading: true });
    this.props.actions.reset(this.state.email, this.state.password)
      .finally(() => {
        //this.props.actions.showSnack("Done, if you have an account an email with instructions has been sent to you.");
        //this.setState({ email: "" });
      });
  };

  render() {
    const { classes } = this.props;
    const { loading, checking } = this.state;
    
    const hasPasswordError = this.stateHasProp("errors.password");
    const hasConfirmPasswordError = this.stateHasProp("errors.confirmPassword");
    
    const saveButtonDisabled = loading || checking || hasPasswordError || hasConfirmPasswordError;
    
    const fieldInputProps = {
    
    };
    
    return (
      <DocumentTitle title="Voice :. Reset password">
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" style={{textAlign: "left" }}>
              Enter your new password
            </Typography>

            {checking ?
              (
                <Typography style={{marginTop: 60, marginBottom: 40}}>Please wait... checking details..</Typography>
              ) : (
                <div>
                  
                  <PasswordConfirmationArea
                    classes={classes}
                    fieldInputProps={fieldInputProps}
                    hasPasswordError={hasPasswordError}
                    passwordError={this.state.errors.password}
                    passwordValue={this.state.password}
                    hasConfirmPasswordError={hasConfirmPasswordError}
                    confirmPasswordError={this.state.errors.confirmPassword}
                    confirmPasswordValue={this.state.confirmPassword}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    loading={this.state.loading}
                  />
  
                  <Button color="primary"
                          disabled={saveButtonDisabled}
                          variant="raised"
                          size="large"
                          style={{marginTop: 16}}
                          onClick={this.onSubmit}>
                    Save
                  </Button>
                  
                </div>
              )
            }
            
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ResetForm));
