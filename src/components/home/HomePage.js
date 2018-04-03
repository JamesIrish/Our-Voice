import React from "react";
import Typography from 'material-ui/Typography';
import {Link} from "react-router";

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom noWrap>Welcome to Voice</Typography>
        <Typography gutterBottom noWrap>Make the most of your voice; introduce, comment &amp; vote for project features.</Typography>
      </div>
    );
  }
}

export default HomePage;
