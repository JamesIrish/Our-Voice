import React from "react";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField";
import {FormControl, FormHelperText} from "material-ui/Form";
import {InputLabel} from "material-ui/Input";
import {Icon, IconButton, Input, InputAdornment, withStyles} from "material-ui";

const styles = theme => ({
  strength: {
    "&:after": {
      transformOrigin: "left 0 !important"
    }
  },
  strength20: {
    "&:after": {
      transform: "scaleX(0.2) !important",
      backgroundColor: theme.palette.error.main + " !important"
    }
  },
  strength40: {
    "&:after": {
      transform: "scaleX(0.4) !important",
      backgroundColor: "#e65100 !important"
    }
  },
  strength60: {
    "&:after": {
      transform: "scaleX(0.6) !important",
      backgroundColor: "#ffa000 !important"
    }
  },
  strength80: {
    "&:after": {
      transform: "scaleX(0.8) !important",
      backgroundColor: "#fdd835 !important"
    }
  },
  strength100: {
    "&:after": {
      transform: "scaleX(1) !important",
      backgroundColor: "#00c853 !important"
    }
  }
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

class PasswordConfirmationArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      strength: null,
      strengthPercent: 20,
      strengthOkay: false,

      showPassword: false,
      showConfirmPassword: false
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
        this.setState({
          strength: results,
          strengthPercent: (results.score+1)*20,
          strengthOkay: results.score > 2
        });

      } catch (err) {
        console.error("Error evaluating password strength.", err);
      }
    }
    this.props.onChange(event);
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = (event) => {
    let parent = event.target.parentElement.parentElement.parentElement.previousElementSibling;
    if (parent.id === "password")
      this.setState({ showPassword: !this.state.showPassword });
    else if (parent.id === "confirmPassword")
      this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  };

  render() {
    const {
      classes,
      textFieldClassName,
      fieldInputProps,
      passwordError,
      passwordValue,
      hasConfirmPasswordError,
      confirmPasswordError,
      confirmPasswordValue,
      onKeyDown,
      loading
    } = this.props;

    const { strength, strengthOkay, strengthPercent, showPassword, showConfirmPassword } = this.state;

    let pwHelperText = passwordError;
    if (
      (pwHelperText === null || pwHelperText === undefined || pwHelperText === "")
      && strength !== null
      && strength.feedback !== null
    )
      pwHelperText = strength.feedback.warning || "";
    if (pwHelperText === "" && strength.feedback.suggestions.length > 0)
      pwHelperText = strength.feedback.suggestions[0];
    if (pwHelperText === "" && strengthOkay)
      pwHelperText = "Password strength: " + (strengthPercent > 80 ? "excellent" : "good");

    const hasPasswordError = !strengthOkay;

    const additionalClasses = `${classes.strength} ${classes["strength" + strengthPercent]}`;

    return (
      <div>

        <FormControl id="passwordCtl" error={hasPasswordError} style={{marginTop: "16px", marginLeft: 0, marginRight: "24px", width: 280}}>

          <InputLabel htmlFor="password">
            Password
          </InputLabel>

          <Input
            autoFocus
            disabled={loading}
            className={additionalClasses}
            type={showPassword ? 'text' : 'password'}
            value={passwordValue}
            id="password"
            onChange={this.onChangeWrapper}
            endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={this.handleClickShowPassword}
                onMouseDown={this.handleMouseDownPassword}
              >
                {showPassword ? <Icon>visibility_off</Icon> : <Icon>visibility</Icon>}
              </IconButton>
            </InputAdornment>
          }
          />

          <FormHelperText id="password-helper-text">
            {pwHelperText}
          </FormHelperText>

        </FormControl>


        <FormControl id="confirmPasswordCtl" error={hasConfirmPasswordError} style={{marginTop: "16px", marginLeft: 0, marginRight: "24px", width: 280}}>

          <InputLabel htmlFor="password">
            Confirm password
          </InputLabel>

          <Input
            disabled={loading}
            className={textFieldClassName}
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPasswordValue}
            id="confirmPassword"
            onChange={this.onChangeWrapper}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPassword}
                  onMouseDown={this.handleMouseDownPassword}
                >
                  {showConfirmPassword ? <Icon>visibility_off</Icon> : <Icon>visibility</Icon>}
                </IconButton>
              </InputAdornment>
            }
          />

          <FormHelperText id="confirm-password-helper-text">
            {confirmPasswordError}
          </FormHelperText>

        </FormControl>

      </div>
    );
  }
}

PasswordConfirmationArea.propTypes = {
  classes: PropTypes.object.isRequired,
  textFieldClassName: PropTypes.string.isRequired,
  fieldInputProps: PropTypes.object.isRequired,
  hasPasswordError: PropTypes.bool.isRequired,
  passwordError: PropTypes.string,
  passwordValue: PropTypes.string.isRequired,
  hasConfirmPasswordError: PropTypes.bool.isRequired,
  confirmPasswordError: PropTypes.string,
  confirmPasswordValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default withStyles(styles, {name:"PasswordConfirmation"})(PasswordConfirmationArea);
