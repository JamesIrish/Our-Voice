import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { withCookies } from "react-cookie";
import { withStyles } from "material-ui/styles";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import List from "material-ui/List";
import Divider from "material-ui/Divider";
import Snackbar from "material-ui/Snackbar";
import { mailFolderListItems, otherMailFolderListItems } from "./tileData";
import {bindActionCreators} from "redux";
import jwtDecode from "jwt-decode";
import * as SnackActions from "../actions/snackActions";
import * as LoginActions from "../actions/loginActions";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  },
  titleLink: {
    color: theme.palette.primary.contrastText,
    textDecoration: "none"
  }
});

class Layout extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      loading: false,
      user: props.user,
      drawerOpen: false,
      snackOpen: props.snackOpen,
      snackMessage: props.snackMessage
    };
  }
  
  componentWillMount = () => {
    if (!this.state.user)
    {
      const { cookies } = this.props;
      let access = cookies.get("access_token");
      let refresh = cookies.get("refresh_token");
      if (access && refresh) {
        let decoded = jwtDecode(access);
        this.setState({ loading: true, user: decoded.user });
        this.props.actions.refreshToken(decoded.user._id, refresh);
      }
    }
  };
  
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      loading: false,
      user: nextProps.user,
      snackOpen: nextProps.snackOpen,
      snackMessage: nextProps.snackMessage
    });
  };
  
  toggleDrawer = (open) => () => {
    this.setState({ drawerOpen: open });
  };
  
  snackClose = () => {
    this.props.actions.clearSnack();
  };

  render() {
    const { classes, children } = this.props;
    const { loading, user, drawerOpen, snackOpen, snackMessage } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
              <MenuIcon/>
            </IconButton>
            <Typography variant="headline" color="inherit" className={classes.flex}>
              <Link to="/" className={classes.titleLink}>Voice</Link>
            </Typography>
            {user
              ? (<Button color="inherit" component={Link} to="/account" disabled={loading}>{user.displayName}</Button>)
              : (<Button color="inherit" component={Link} to="/signin" disabled={loading}>Sign in</Button>)}
          </Toolbar>
        </AppBar>
        <Drawer open={drawerOpen} onClose={this.toggleDrawer(false)}>
          <List>{mailFolderListItems}</List>
          <Divider/>
          <List>{otherMailFolderListItems}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar}/>
          {children}
        </main>
        <Snackbar
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right"}}
          open={snackOpen}
          onClose={this.snackClose}
          message={snackMessage}
        />
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  snackOpen: PropTypes.bool.isRequired,
  snackMessage: PropTypes.string,
  cookies: PropTypes.object.isRequired,
  user: PropTypes.object,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    loading: state.auth.loading,
    user: state.auth.user,
    snackOpen: state.snack.snackOpen,
    snackMessage: state.snack.snackMessage
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, SnackActions, LoginActions), dispatch)
  };
}

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Layout)));
