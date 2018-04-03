import React from "react";
import {connect} from "react-redux";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import yellow from 'material-ui/colors/yellow';
import Layout from "./Layout";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: yellow,
  }
});

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Layout children={this.props.children} />
      </MuiThemeProvider>
    );
  }
}

export default connect()(App);
