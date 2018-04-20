import React from "react";
import Typography from "material-ui/Typography";

const NotFound = ({ location }) => (
  <div>
    <Typography>Sorry but <b>{location.pathname}</b> didn’t match any pages</Typography>
  </div>
);

NotFound.propTypes = {
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
  }).isRequired,
};

export default NotFound;
