import React from "react";
import PropTypes from "prop-types";
import DocumentTitle from "react-document-title";
import { withStyles } from "material-ui/styles";
import Card, { CardContent } from "material-ui/Card";
import Grid from "material-ui/Grid";
import AccountNav from "../shared/AccountNav";

const styles = theme => ({
  container: {
    margin: theme.spacing.unit*3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap",
    textAlign: "center"
  },
  root: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    alignContent: "stretch"
  },
  card: {

  }
});

class AccountPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <DocumentTitle title="Our Voice :. My Account">
        <div className={classes.container}>
          <Grid container className={classes.root} spacing={16}>
            <Grid item style={{flexBasis: "auto"}}>
              <Card className={classes.card}>
                <CardContent>
                  <AccountNav/>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card className={classes.card}>
                <CardContent>
                  {this.props.children}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </DocumentTitle>
    );
  }
}

AccountPage.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.object
};

export default withStyles(styles)(AccountPage);
