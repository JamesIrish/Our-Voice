import React from "react";
import PropTypes from "prop-types";
import {withRouter, Link} from "react-router";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as AuthActions from "../../actions/authActions";
import {Divider, List, ListItem, ListItemText} from "material-ui";

class AccountNav extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      configLoading: props.configLoading,
      auth: props.auth
    };
  }
  
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      configLoading: nextProps.configLoading,
      auth: nextProps.auth
    });
  };
  
  signOut = () => {
    this.props.actions.signOutUser(this.state.auth.user._id, this.state.auth.refreshToken);
  };
  
  render() {
    const { configLoading, auth } = this.state;
    const loading = configLoading || auth.loading;
    
    return (
      <List>
        <ListItem button disabled={loading} component={Link} to="/account/profile">
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button disabled={loading} component={Link} to="/account/password">
          <ListItemText primary="Password" />
        </ListItem>
        <ListItem button disabled={loading} component={Link} to="/account/activity">
          <ListItemText primary="Activity" />
        </ListItem>
        <Divider/>
        <ListItem button disabled={loading} onClick={this.signOut}>
          <ListItemText primary="Sign Out" />
        </ListItem>
      </List>
    );
  }
}

AccountNav.propTypes = {
  actions: PropTypes.object.isRequired,
  configLoading: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    configLoading: state.config.loading,
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, AuthActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountNav));
