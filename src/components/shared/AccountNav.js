import React from "react";
import PropTypes from "prop-types";
import {Link, withRouter} from "react-router";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as AuthActions from "../../actions/authActions";
import Divider from "material-ui/Divider";
import { MenuList, MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import { ListItemText } from "material-ui/List";

const styles = theme => ({

});

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
    const { classes, location } = this.props;
    const { configLoading, auth } = this.state;

    const loading = configLoading || auth.loading;
    const isProfile = location.pathname === "/account" || location.pathname === "/account/profile";
    const isAvatar = location.pathname === "/account/avatar";
    const isActivity = location.pathname === "/account/activity";
    const isPassword = location.pathname === "/account/password";

    return (
      <MenuList>
        <MenuItem disabled={loading} component={Link} to="/account/profile" selected={isProfile}>
          <ListItemText primary="Profile" />
        </MenuItem >
        <MenuItem disabled={loading} component={Link} to="/account/avatar" selected={isAvatar}>
          <ListItemText primary="Avatar" />
        </MenuItem >
        <MenuItem disabled={loading} component={Link} to="/account/activity" selected={isActivity}>
          <ListItemText primary="Activity" />
        </MenuItem >
        <MenuItem disabled={loading} component={Link} to="/account/password" selected={isPassword}>
          <ListItemText primary="Password" />
        </MenuItem >
        <Divider/>
        <MenuItem disabled={loading} onClick={this.signOut}>
          <ListItemText primary="Sign Out" />
        </MenuItem>
      </MenuList>    );
  }
}

AccountNav.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles, {name:"AccountNav"})(AccountNav)));
