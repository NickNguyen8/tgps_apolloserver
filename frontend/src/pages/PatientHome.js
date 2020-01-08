import React, { Component } from 'react';
import { render } from 'react-dom';
import AuthContext from '../context/auth-context';
import Typography from '@material-ui/core/Typography';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Grid from '@material-ui/core/Grid';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
//import Markdown from 'react-markdown'
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
//import { compiler } from 'markdown-to-jsx';
import { Link } from 'react-router-dom'; 
import Treatment from './Treatment';

import Description from './Description';
import { compiler } from 'markdown-to-jsx';
import ReactDOM from 'react-dom'
import {  deserialize } from "react-serialize"
import Markdown from 'markdown-to-jsx';











import CircularProgress from '@material-ui/core/CircularProgress';


import Dialog from '@material-ui/core/Dialog';
import { Container } from '@material-ui/core';


const styles = theme => ({
   
    progress: {
        margin: theme.spacing(2,2,2,2),
    },
    dailog: {
        margin: theme.spacing(2,2,2,2),
    },
    card: {
        //width: '33%' ,
        'background-color':     theme.palette.custom.main,
        padding: theme.spacing(4),

      },
      bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
      },
      title: {
        fontSize: 14,
      },
      pos: {
        marginBottom: 12,
      },
      root: {
        //flexGrow: 1,
        height: '100%'
      },
      paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        overflow: 'auto',
      },
      typography:{
        padding: theme.spacing(8),


      },

  });

const ME = gql`
  query Me($userId: String!) {
    me(userId: $userId) {
      _id
      email
      firstName
      lastName
      enrollments{
        treatment{
            _id
            name
            description
            content
            tableOfContents{
                level
                entry
            }
            subSections{
                _id
                name
            }
        }
      }
    }
  }
`;

class PatientHome extends Component{

    state ={
      
    };

    static contextType = AuthContext;
 

    render(){

        const { classes, theme } = this.props;

        return(
            <React.Fragment>
                { this.context.userId && 
                    <Query query={ME} variables={{ userId: this.context.userId }} >
                    {({ loading, error, data }) => { 
                        return(
                        <React.Fragment>
                            {loading &&  
                                <React.Fragment>
                                    <Dialog
                                        open
                                        aria-labelledby="alert-dialog-slide-title"
                                        aria-describedby="alert-dialog-slide-description"
                                        fullWidth
                                        maxWidth="xs"
                                    >                                           
                                        <Grid container justify="space-evenly" alignItems="center" spacing={3}>
                                            <Grid item xs={3}>
                                                <CircularProgress className={classes.progress} />
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography classses={classes.dailog} >
                                                    Loading details...
                                                </Typography>
                                            </Grid>

                                        </Grid>         
                                    </Dialog>
                                </React.Fragment>
                            }
                            {!loading && data && 
                                <React.Fragment>
                                    <div id='PatientHomeMainDiv' className={classes.root}>
                                        <Grid container className={classes.root} spacing={3}>
                                            <Grid item xs={12} sm={9} className={classes.root}  >
                                            <div style={{ height: '100%', overflow: "auto" }} >
                                                {!this.context.selectedTreatment && 
                                                    <Grid container spacing={1} >
                                                        {data.me.enrollments.map( ({treatment}) => (
                                                        <Grid item xs={12} sm={6} >
                                                            <Card className={classes.card} key={treatment._id} >
                                                                <CardContent>
                                                                    <Typography variant="h5">
                                                                        {treatment.name}
                                                                    </Typography>
                                                                    <Markdown>
                                                                        {treatment.description}
                                                                    </Markdown>
                                                                </CardContent>
                                                                <CardActions>
                                                                    <Button  variant="outlined" size="small" onClick={(e)=>{ 
                                                                        e.preventDefault();
                                                                        this.context.setTreatment(treatment);
                                                                    }  }>Start</Button>
                                                                </CardActions>
                                                            </Card>
                                                        </Grid>                                                     
                                                        ))
                                                    }
                                                    </Grid>                       
                                                }
                                                {this.context.selectedTreatment && 
                                                    <Treatment/>
                                                }
                                            </div>    
                                            </Grid>
                                            <Grid item xs={0} sm={3}>

                                                <Paper className={classes.paper}>
                                                    things to come...

                                                    Messaging 

                                                    Progress

                                                    Etc....
                                                    
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </div>



                                </React.Fragment>
                            }
                        </React.Fragment>
                    )}}
                    </Query>
                }
            </React.Fragment>
        );
    
    }
}

export default withStyles(styles )(withTheme( PatientHome));