import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Card, { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
});

class LoginForm extends React.Component {
  
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      credentials: {},
      errors: {},
      loading: false
    };
  }
  
  onChange = (event) => {
    const field = event.target.name;
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
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
            Welcome back! Please sign in.
          </Typography>
        
          <TextField
            required
            id="email"
            label="Email address"
            className={classes.textField}
            margin="normal"
            error={this.state.errors.email}
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
            onChange={this.onChange}
          />
        
          <Button color="primary" disabled={this.state.loading}
                  onClick={this.onSubmit}>{this.state.loading ? 'Signing in...' : 'Sign in'}</Button>
        
          <Divider/>
        
          <Button>Sign in with a domain account</Button>
      
        </CardContent>
      </Card>
    );
  }
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.object,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginForm);
