import React from "react";
import {connect} from "react-redux";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import amber from 'material-ui/colors/amber';
import Layout from "./Layout";
import PropTypes from "prop-types";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: amber
  }
});

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Layout children={this.props.children}/>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default connect()(App);
