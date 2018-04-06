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
    super();
    
    this.state = {
      loading: props.loading,
      user: props.user
    };
  }
  
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      loading: nextProps.loading,
      user: nextProps.user
    });
  };
  
  render() {
    const { classes } = this.props;
    const { user } = this.state;
    return (
      <DocumentTitle title="Voice">
        <div className={classes.container}>
          <Typography variant="display1" gutterBottom noWrap>Welcome to Voice</Typography>
          <Typography gutterBottom noWrap>Make the most of your voice; introduce, comment &amp; vote for project features.</Typography>
          {user ? (
            <Typography gutterBottom noWrap>Welcome back {user.firstName}!</Typography>
          ) : (
            <Typography gutterBottom noWrap><Link to="signin">Please sign in</Link></Typography>
          )}
        </div>
      </DocumentTitle>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object
};

function mapStateToProps(state) {
  return {
    loading: state.auth.loading,
    user: state.auth.user
  };
}

export default connect(mapStateToProps)(withStyles(styles)(HomePage));
