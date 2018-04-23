import React from "react";
import PropTypes from "prop-types";
import {Link, withRouter} from "react-router";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as AuthActions from "../../actions/authActions";
import Divider from "material-ui/Divider";
import ListItemText from "material-ui/List";
import {MenuItem, MenuList} from "material-ui/Menu";
import {withStyles} from "material-ui/styles";

const styles = theme => ({
  miRoot: {
    ...theme.typography.subheading,
    height: theme.spacing.unit * 3,
    boxSizing: "content-box",
    width: "auto",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    "&$selected": {
      backgroundColor: theme.palette.primary.main,
      "& $primary, & $icon": {
        color: theme.palette.common.white,
      }
    },
  },
  miSelected: {},

  primary: {},
  icon: {},
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
        <MenuItem disabled={loading} component={Link} to="/account/profile" selected={isProfile} classes={{ root: classes.miRoot, selected: classes.miSelected }}>
          <ListItemText classes={{ primary: classes.primary }} primary="Profile" />
        </MenuItem >
        <MenuItem disabled={loading} component={Link} to="/account/avatar" selected={isAvatar} classes={{ root: classes.miRoot, selected: classes.miSelected }}>
          <ListItemText classes={{ primary: classes.primary }} primary="Avatar" />
        </MenuItem >
        <MenuItem disabled={loading} component={Link} to="/account/activity" selected={isActivity} classes={{ root: classes.miRoot, selected: classes.miSelected }}>
          <ListItemText classes={{ primary: classes.primary }} primary="Activity" />
        </MenuItem >
        <MenuItem disabled={loading} component={Link} to="/account/password" selected={isPassword} classes={{ root: classes.miRoot, selected: classes.miSelected }}>
          <ListItemText classes={{ primary: classes.primary }} primary="Password" />
        </MenuItem >
        <Divider/>
        <MenuItem disabled={loading} onClick={this.signOut}>
          <ListItemText primary="Sign Out" />
        </MenuItem>
      </MenuList>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(AccountNav)));
