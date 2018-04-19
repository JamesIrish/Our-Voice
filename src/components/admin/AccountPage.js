import React from "react";
import PropTypes from "prop-types";
import {withRouter, Link} from "react-router";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import DocumentTitle from "react-document-title";
import { withStyles } from "material-ui/styles";
import Card, { CardContent } from "material-ui/Card";
import * as AuthActions from "../../actions/authActions";

const styles = theme => ({
  container: {
    margin: theme.spacing.unit*3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap",
    textAlign: "center"
  },
  card: {
    minWidth: 400,
    maxWidth: 400
  },
  title: {
    marginBottom: theme.spacing.unit,
    fontSize: 14
  },
  textField: {
    marginLeft: 0,
    marginRight: 0,
    width: 280
  }
});

class AccountPage extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      configLoading: props.configLoading,
      activeDirectoryEnabled: props.activeDirectoryEnabled
    };
  }
  
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      configLoading: nextProps.configLoading,
      activeDirectoryEnabled: nextProps.activeDirectoryEnabled
    });
  };
  
  render() {
    const { classes } = this.props;
    const { activeDirectoryEnabled, configLoading } = this.state;
    
    return (
      <DocumentTitle title="Our Voice :. My Account">
        <div className={classes.container}>
          <Card className={classes.card}>
            <CardContent/>
          </Card>
        </div>
      </DocumentTitle>
    );
  }
}

AccountPage.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  configLoading: PropTypes.bool.isRequired,
  activeDirectoryEnabled: PropTypes.bool.isRequired
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, AuthActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(AccountPage)));
