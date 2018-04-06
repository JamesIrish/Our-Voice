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
    super();
    
    this.state = {
      drawerOpen: false,
      snackOpen: props.snackOpen,
      snackMessage: props.snackMessage
    };
  }
  
  componentWillMount = () => {
    const { cookies } = this.props;
    let access = cookies.get("access_token");
    console.log(access);
    let refresh = cookies.get("refresh_token");
    console.log(refresh);
  };
  
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      snackOpen: nextProps.snackOpen,
      snackMessage: nextProps.snackMessage
    });
  };
  
  toggleDrawer = (open) => () => {
    this.setState({ drawerOpen: open });
  };
  
  snackClose = () => {
    this.setState({ snackOpen: false });
  };

  render() {
    const { classes, children } = this.props;
    const { drawerOpen, snackOpen, snackMessage } = this.state;

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
            <Button color="inherit" component={Link} to="signin">Sign in</Button>
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
  cookies: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    snackOpen: state.snackReducer.snackOpen,
    snackMessage: state.snackReducer.snackMessage
  };
}

export default withCookies(connect(mapStateToProps)(withStyles(styles)(Layout)));
