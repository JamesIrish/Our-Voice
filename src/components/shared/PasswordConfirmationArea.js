import React from "react";
import PropTypes from "prop-types";
import {withStyles} from "material-ui";
import {FormControl, FormHelperText} from "material-ui/Form";
import {IconButton} from "material-ui/IconButton";
import {Input, InputLabel, InputAdornment} from "material-ui/Input";
import Visibility from "material-ui-icons/Visibility";
import VisibilityOff from "material-ui-icons/VisibilityOff";

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
  let ZXCVBN_SRC = "/zxcvbn.js";
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

        // call the user validation method
        let validation = this.props.passwordValidator(value, results);

        this.setState({
          strength: results,
          strengthPercent: (results.score+1)*20,
          strengthOkay: validation.valid,
          passwordMessage: validation.message
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

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  handleClickShowConfirmPassword = () => {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  };

  render() {
    const {
      classes,
      textFieldClassName,
      fieldInputProps,
      passwordLabel,
      passwordValue,
      confirmPasswordLabel,
      hasConfirmPasswordError,
      confirmPasswordError,
      confirmPasswordValue,
      onKeyDown,
      loading
    } = this.props;

    const { strength, strengthOkay, strengthPercent, showPassword, showConfirmPassword, passwordMessage } = this.state;

    const hasPasswordError = strength === null ? this.props.hasPasswordError : !strengthOkay;

    const additionalClasses = strength === null ? "" : `${classes.strength} ${classes["strength" + strengthPercent]}`;

    return (
      <div>

        <FormControl id="passwordCtl" error={hasPasswordError} style={{marginTop: "16px", marginLeft: 0, marginRight: "24px", width: 280}}>

          <InputLabel htmlFor="password">
            {passwordLabel}
          </InputLabel>

          <Input
            autoFocus
            disabled={loading}
            className={additionalClasses}
            type={showPassword ? "text" : "password"}
            value={passwordValue}
            id="password"
            onChange={this.onChangeWrapper}
            inputProps={fieldInputProps}
            onKeyDown={onKeyDown}
            endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={this.handleClickShowPassword}
                onMouseDown={this.handleMouseDownPassword}
                tabIndex="-1"
              >
                {showPassword ? <VisibilityOff/> : <Visibility/>}
              </IconButton>
            </InputAdornment>
          }
          />

          <FormHelperText id="password-helper-text">
            {passwordMessage}
          </FormHelperText>

        </FormControl>


        <FormControl id="confirmPasswordCtl" error={hasConfirmPasswordError} style={{marginTop: "16px", marginLeft: 0, marginRight: "24px", width: 280}}>

          <InputLabel htmlFor="password">
            {confirmPasswordLabel}
          </InputLabel>

          <Input
            disabled={loading}
            className={textFieldClassName}
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPasswordValue}
            id="confirmPassword"
            onChange={this.onChangeWrapper}
            inputProps={fieldInputProps}
            onKeyDown={onKeyDown}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowConfirmPassword}
                  onMouseDown={this.handleMouseDownPassword}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
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
  passwordLabel: PropTypes.string,
  hasPasswordError: PropTypes.bool.isRequired,
  passwordError: PropTypes.string,
  passwordValue: PropTypes.string.isRequired,
  passwordValidator: PropTypes.func.isRequired,
  confirmPasswordLabel: PropTypes.string,
  hasConfirmPasswordError: PropTypes.bool.isRequired,
  confirmPasswordError: PropTypes.string,
  confirmPasswordValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

PasswordConfirmationArea.defaultProps = {
  passwordLabel: "Password",
  confirmPasswordLabel: "Confirm password",
};

export default withStyles(styles, {name:"PasswordConfirmation"})(PasswordConfirmationArea);
