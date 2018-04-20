import React from "react";
import PropTypes from "prop-types";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import blue from "material-ui/colors/blue";
import amber from "material-ui/colors/amber";
import Layout from "./Layout";

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

export default App;
