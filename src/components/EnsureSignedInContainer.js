import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router";

class EnsureSignedInContainer extends React.Component {
  
  componentDidMount() {
    const { currentURL } = this.props;
    
    if (!this.props.isLoggedIn)
      this.props.router.replace("/signin?redirect=" + encodeURIComponent(currentURL));
  }
  
  render() {
    return this.props.isLoggedIn ? this.props.children : null;
  }
}

EnsureSignedInContainer.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool,
  router: PropTypes.object.isRequired,
  currentURL: PropTypes.string
};

// Grab a reference to the current URL. If this is a web app and you are
// using React Router, you can use `ownProps` to find the URL. Other
// platforms (Native) or routing libraries have similar ways to find
// the current position in the app.
function mapStateToProps(state, ownProps) {
  return {
    isLoggedIn: state.auth.user !== null,
    currentURL: ownProps.location.pathname
  };
}

export default connect(mapStateToProps)(withRouter(EnsureSignedInContainer));
