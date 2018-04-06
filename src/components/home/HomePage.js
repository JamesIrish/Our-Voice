import React from "react";
import Typography from 'material-ui/Typography';
import {Link} from "react-router";
import PropTypes from "prop-types";
import {withStyles} from "material-ui/styles/index";
import DocumentTitle from 'react-document-title';

const styles = theme => ({
  container: {
    margin: theme.spacing.unit*3
  }
});

class HomePage extends React.Component {
  
  constructor(props, context) {
    super(props, context);
  }
  
  render() {
    const {classes} = this.props;
    const isAuthenticated = this.props.auth.isAuthenticated();
    return (
      <DocumentTitle title="Voice">
        <div className={classes.container}>
          <Typography variant="display1" gutterBottom noWrap>Welcome to Voice</Typography>
          <Typography gutterBottom noWrap>Make the most of your voice; introduce, comment &amp; vote for project features.</Typography>
          {isAuthenticated ? (
            <Typography gutterBottom noWrap>Welcome back!</Typography>
          ) : (
            <Typography gutterBottom noWrap><Link to="signin">Please sign in</Link></Typography>
          )}
        </div>
      </DocumentTitle>
    );
  }
}

HomePage.propTypes = {
  auth: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HomePage);
