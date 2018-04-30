import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import List, { ListItem, ListItemText } from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Icon from "material-ui/Icon";
import moment from "moment";
import * as userActions from "../../../webapi/UserActions";
import _orderBy from "lodash/orderBy";

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
});

class ActivityPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      auth: props.auth
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      auth: nextProps.auth
    });
  };

  render() {
    const { classes } = this.props;
    const { auth } = this.state;
    const loading = auth.loading;

    const Created = (props) => (
      <ListItem>
        <Avatar>
          <Icon>person_add</Icon>
        </Avatar>
        <ListItemText primary="Account created" secondary={moment(props.action.date).calendar()} />
      </ListItem>
    );
    const SignInSuccess = (props) => (
      <ListItem>
        <Avatar>
          <Icon>lock_open</Icon>
        </Avatar>
        <ListItemText primary="Signed in successfully" secondary={moment(props.action.date).calendar()} />
      </ListItem>
    );
    const SignInFailure = (props) => (
      <ListItem>
        <Avatar>
          <Icon>block</Icon>
        </Avatar>
        <ListItemText primary="Sign in failed" secondary={moment(props.action.date).calendar()} />
      </ListItem>
    );
    const SignOutSuccess = (props) => (
      <ListItem>
        <Avatar>
          <Icon>lock</Icon>
        </Avatar>
        <ListItemText primary="Signed out" secondary={moment(props.action.date).calendar()} />
      </ListItem>
    );
    const PasswordResetRequested = (props) => (
      <ListItem>
        <Avatar>
          <Icon>vpn_key</Icon>
        </Avatar>
        <ListItemText primary="Password reset requested" secondary={moment(props.action.date).calendar()} />
      </ListItem>
    );
    const PasswordResetSuccess = (props) => (
      <ListItem>
        <Avatar>
          <Icon>verified_user</Icon>
        </Avatar>
        <ListItemText primary="Password reset successfully" secondary={moment(props.action.date).calendar()} />
      </ListItem>
    );

    /*
    actions = {
      created: "created",
      signInSuccess: "signin_success",
      signInFailure: "signin_failure",
      signOutSuccess: "signout_success",
      pwResetRequest: "password_reset_request",
      pwResetSuccess: "password_reset_success"
    };
     */

    const switchAction = (value, idx) => {
      let key = `Action_${idx+1}`;
      switch(value.action) {
        case userActions.created:
          return (<Created key={key} action={value}/>);
        case userActions.signin_success:
          return (<SignInSuccess key={key} action={value}/>);
        case userActions.signin_failure:
          return (<SignInFailure key={key} action={value}/>);
        case userActions.signout_success:
          return (<SignOutSuccess key={key} action={value}/>);
        case userActions.password_reset_request:
          return (<PasswordResetRequested key={key} action={value}/>);
        case userActions.password_reset_success:
          return (<PasswordResetSuccess key={key} action={value}/>);
        default:
          return null;
      }
    };

    return (
      <div className={classes.root}>
        <Typography variant="subheading" gutterBottom align="left">Recent activity on your account.</Typography>
        <Typography variant="caption" gutterBottom align="left">If anything seems unusual or you have any concerns please contact us at <a href="mailto:support@our-voice.io">support@our-voice.io</a>.</Typography>

        <List>
          {_orderBy(auth.user.actions, ["date"], ["desc"]).map((value, key) => switchAction(value, key))}
        </List>
      </div>

    );
  }
}

ActivityPage.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps, null)(withStyles(styles)(ActivityPage));
