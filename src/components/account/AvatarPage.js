import React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { withStyles } from "material-ui/styles";
import * as AuthActions from "../../actions/authActions";
import Typography from "material-ui/Typography";

const styles = theme => ({
  container: {
    margin: theme.spacing.unit*3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap",
    textAlign: "center"
  },
  root: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    alignContent: "stretch"
  },
  card: {

  }
});

class ActivityPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      configLoading: props.configLoading,
      activeDirectoryEnabled: props.activeDirectoryEnabled,
      auth: props.auth
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      configLoading: nextProps.configLoading,
      activeDirectoryEnabled: nextProps.activeDirectoryEnabled,
      auth: nextProps.auth
    });
  };

  render() {
    const { classes } = this.props;
    const { activeDirectoryEnabled, configLoading, auth } = this.state;
    const loading = configLoading || auth.loading;

    return (

                  <Typography>Avatar</Typography>
    );
  }
}

ActivityPage.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  configLoading: PropTypes.bool.isRequired,
  activeDirectoryEnabled: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired
};

function getAdEnabled(state) {
  if (!state.config) return false;
  if (!state.config.activeDirectory) return false;
  return state.config.activeDirectory.enabled;
}
function mapStateToProps(state) {
  return {
    configLoading: state.config.loading,
    activeDirectoryEnabled: getAdEnabled(state),
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, AuthActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(ActivityPage)));
