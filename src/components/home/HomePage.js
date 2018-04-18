import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import DocumentTitle from "react-document-title";
import Typography from "material-ui/Typography";
import {withStyles} from "material-ui/styles/index";

const styles = theme => ({
  container: {
    margin: theme.spacing.unit*3
  }
});

class HomePage extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      authLoading: props.authLoading,
      user: props.user
    };
  }
  
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      authLoading: nextProps.authLoading,
      user: nextProps.user
    });
  };
  
  render() {
    const { classes } = this.props;
    const { user, authLoading } = this.state;
    const Greeting = () => {
      if (authLoading)
        return (<Typography gutterBottom noWrap>Signing you in, please wait a moment...</Typography>);
      else {
        return user ? (
          <Typography gutterBottom noWrap>Welcome back {user.firstName}!</Typography>
        ) : (
          <Typography gutterBottom noWrap>Please <Link to="/signin">sign in</Link> or <Link to="/register">register for an account</Link>.</Typography>
        );
      }
    };
    return (
      <DocumentTitle title="Our Voice">
        <div className={classes.container}>
          <Typography variant="display1" gutterBottom noWrap>Welcome to Our Voice</Typography>
          <Typography gutterBottom noWrap>Make the most of your voice; introduce, comment &amp; vote for project features.</Typography>
          <Greeting />
        </div>
      </DocumentTitle>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
  authLoading: PropTypes.bool.isRequired,
  user: PropTypes.object
};

function mapStateToProps(state) {
  return {
    authLoading: state.auth.loading,
    user: state.auth.user
  };
}

export default connect(mapStateToProps)(withStyles(styles)(HomePage));
