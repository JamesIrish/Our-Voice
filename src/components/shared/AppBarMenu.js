import React from "react";
import {Link} from "react-router";
import PropTypes from "prop-types";
import {withStyles} from "material-ui/styles/index";
import {connect} from "react-redux";
import {Button, Menu, MenuItem} from "material-ui";
import * as AuthActions from "../../actions/authActions";
import {bindActionCreators} from "redux";

const styles = theme => ({

});

class AppBarMenu extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      loading: props.loading,
      user: props.user,
      refreshToken: props.refreshToken,
      menuAnchorEl: null
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      loading: nextProps.loading,
      user: nextProps.user,
      refreshToken: nextProps.refreshToken
    });
  };

  handleMenuOpen = event => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };
  handleMenuClose = () => {
    this.setState({ menuAnchorEl: null });
  };

  signOut = () => {
    this.props.actions.signOutUser(this.state.user._id);
    this.setState({ menuAnchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { loading, user, menuAnchorEl } = this.state;
    const menuOpen = Boolean(menuAnchorEl);

    return (
      <div className={classes.root}>
        {user ?
          (
            <div>
              <Button color="inherit" disabled={loading}
                      aria-owns={menuOpen ? "menu-appbar" : null} aria-haspopup="true"
                      onClick={this.handleMenuOpen}>{loading ? (<span>....</span>) : user.displayName || ""}</Button>
              <Menu
                id="menu-appbar"
                anchorEl={menuAnchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={menuOpen}
                onClose={this.handleMenuClose}
              >
                <MenuItem disabled={loading} onClick={this.handleMenuClose} component={Link} to="/account">My Account</MenuItem>
                <MenuItem disabled={loading} onClick={this.signOut}>Sign Out</MenuItem>
              </Menu>
            </div>
          )
          :
          (
            <Button color="inherit" component={Link} to="/signin" disabled={loading}>{loading ? (<span>....</span>) : (<span>Sign in</span>)}</Button>
          )
        }
      </div>
    );
  }

}

AppBarMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  user: PropTypes.object,
  refreshToken: PropTypes.string,
  loading: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    loading: state.auth.loading || state.config.loading,
    user: state.auth.user,
    refreshToken: state.auth.refreshToken
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, AuthActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AppBarMenu));
