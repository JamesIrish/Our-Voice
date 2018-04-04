import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router';
import { mailFolderListItems, otherMailFolderListItems } from './tileData';

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
    width: 'auto'
  },
  titleLink: {
    color: theme.palette.primary.contrastText,
    textDecoration: 'none'
  }
});

class Layout extends React.Component {
  state = {
    open: false
  };

  toggleDrawer = (open) => () => {
    this.setState({open: open});
  };

  render() {
    const {classes} = this.props;

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
        <Drawer open={this.state.open} onClose={this.toggleDrawer(false)}>
          <List>{mailFolderListItems}</List>
          <Divider/>
          <List>{otherMailFolderListItems}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar}/>
          {this.props.children}
        </main>
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
};

export default withStyles(styles)(Layout);
