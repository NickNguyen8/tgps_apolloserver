import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

//import AuthPage from './pages/Auth';
//import BookingsPage from './pages/Bookings';
//import EvenstPage from './pages/Events';
//import MainNavigation from './components/Navigation/MainNavigation';
//import AuthContext from './context/auth-context';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';


import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { Container } from '@material-ui/core';








//import './App.css';



const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const client = new ApolloClient({
  uri: `http://localhost:8000/graphql`
});

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);



class App extends Component {
  state = {
    token:null,
    userId:null
  }
  login=(token,userId,tokenExpiration)=>{
    this.setState({token: token, userId: userId });
  }
  logout = () =>{
    this.setState({token: null, userId: null });


  }
  render(){
    const classes = makeStyles();
    return(
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
      </div>

    </Container>
    );
    // return(
    //     <BrowserRouter>
    //       <React.Fragment>
    //         <ApolloProvider client={client}>
    //           <AuthContext.Provider value={{token: this.state.token, userId: this.state.userId, login: this.login , logout: this.logout}}>
    //             <MainNavigation>
    //               <main className="main-content">
    //                 <Container maxWidth="xs">
    //                   <h1>hello world</h1>
    //                 </Container>
    //                 <Switch> 

    //                   {this.state.token && <Redirect from ="/" to="/events"  exact/>}
    //                   {this.state.token && <Redirect from ="/auth" to="/events"  exact/>}
    //                   {!this.state.token && <Route path ="/auth" component={AuthPage} /> }
    //                   <Route path ="/events" component={EvenstPage} />
    //                   {this.state.token &&  <Route path ="/bookings" component={BookingsPage} />  }   
    //                   {!this.state.token && <Redirect to="/auth"  exact/>}
    //                 </Switch>
    //               </main>
    //             </MainNavigation>  
    //           </AuthContext.Provider>
    //         </ApolloProvider>   
    //       </React.Fragment>
    //     </BrowserRouter>
    // );
  }
}

export default App;
