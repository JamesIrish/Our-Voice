import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import CssBaseline from 'material-ui/CssBaseline';
import ClippedDrawer from './ClippedDrawer';

class Layout extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleToggle() {
    this.setState({open: !this.state.open});
  }

  handleClose() {
    this.setState({open: false});
  }

  render() {
    return (
      <div>
        <CssBaseline/>
        <ClippedDrawer/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.ajaxCallsInProgress > 0
  };
}

export default connect(mapStateToProps)(Layout);
