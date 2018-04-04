import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import CssBaseline from 'material-ui/CssBaseline';
import ClippedDrawer from './ClippedDrawer';

class Layout extends React.Component {
  render() {
    return (
      <div>
        <CssBaseline/>
        <ClippedDrawer children={this.props.children}/>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    loading: state.ajaxCallsInProgress > 0
  };
}

export default connect(mapStateToProps)(Layout);
