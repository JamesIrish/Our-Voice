import React from "react";
import PropTypes from "prop-types";
import { LinearProgress } from "material-ui/Progress";
import { FormControl } from "material-ui/es/Form";

const styles = theme => ({

});

function loadZXCVBN() {
  let ZXCVBN_SRC = "zxcvbn.js";
  let first, s;
  s = document.createElement("script");
  s.src = ZXCVBN_SRC;
  s.type = "text/javascript";
  s.async = true;
  first = document.getElementsByTagName("script")[0];
  return first.parentNode.insertBefore(s, first);
}

class PasswordStrengthIndicator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      strength: null,
      strengthPercent: 20
    };
  }

  componentWillMount = () => {
    loadZXCVBN();
  };

  onChangeWrapper = (event) => {
    const field = event.target.id;
    const value = event.target.value;
    if (field === "password") {
      let results = null;
      try {
        // eslint-disable-next-line no-undef
        results = zxcvbn(value);
        this.setState({ strength: results, strengthPercent: results.score*20 });
        console.log("Password strength result: ", results);
      } catch (err) {
        console.error("Error evaluating password strength.", err);
      }
    }
    this.props.onChange(event);
  };

  render() {
    const {
      classes,
      fieldInputProps,
      passwordError,
      passwordValue,
      hasConfirmPasswordError,
      confirmPasswordError,
      confirmPasswordValue,
      onKeyDown,
      loading
    } = this.props;

    const { strengthPercent } = this.state;

    return (
      <FormControl>



        <LinearProgress color="primary" variant="determinate" value={strengthPercent} />

      </FormControl>
    );
  }
}

PasswordStrengthIndicator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default PasswordStrengthIndicator;
