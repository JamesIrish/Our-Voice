import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Card, { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';

const styles = theme => ({
  container: {
    margin: theme.spacing.unit*3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'wrap',
    textAlign: 'center'
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

class SignInForm extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      credentials: {},
      errors: {},
      loading: false
    };
  }

  onChange = (event) => {
    const field = event.target.id;
    let credentials = Object.assign({}, this.state.credentials);
    credentials[field] = event.target.value;
    return this.setState({credentials: credentials});
  };

  onSubmit = () => {
    // handle auth
    //console.log('**handle auth**', this.state.credentials);
  };

  render() {
    const {classes} = this.props;

    return (
      <DocumentTitle title="Voice :. Sign in">
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              Welcome back! Please sign in or <Link to="register">register for an account</Link>.
            </Typography>

            <TextField
              required
              id="email"
              label="Email address"
              className={classes.textField}
              margin="normal"
              error={this.state.errors.email}
              helperText={this.state.errors.email}
              onChange={this.onChange}
            />

            <TextField
              required
              id="password"
              label="Password"
              type="password"
              className={classes.textField}
              margin="normal"
              error={this.state.errors.password}
              helperText={this.state.errors.password}
              onChange={this.onChange}
            />

            <Button size="large" style={{marginTop: 16, marginRight: 48}} component={Link} to="forgotten">Forgotten</Button>

            <Button color="primary"
                    disabled={this.state.loading}
                    variant="raised"
                    size="large"
                    style={{marginTop: 16}}
                    onClick={this.onSubmit}>
              {this.state.loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Divider style={{marginTop: 24, marginBottom: 24}}/>

            <Button variant="raised" >
              <img src="/microsoft-80660_16.png" style={{marginRight: 8}} />
              Sign in with a domain account
            </Button>

          </CardContent>
        </Card>
      </div>
      </DocumentTitle>
    );
  }
}

SignInForm.propTypes = {
  loading: PropTypes.bool,
  errors: PropTypes.object,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SignInForm);
