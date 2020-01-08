import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { ApolloProvider } from "react-apollo";

import AuthPage from './pages/Auth';
import Treatment from './pages/Treatment';
import PatientHome from './pages/PatientHome';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';


import { ThemeProvider } from '@material-ui/styles';
import { withStyles } from '@material-ui/core/styles';
import theme from './components/Theme/theme';






const styles = theme => ({
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
    width: '100%',  //Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});


// const client = new ApolloClient({
//   uri: `http://localhost:8000/graphql`
// });


class App extends Component  {
  state = {
    token: null,
    userId: null,
    tokenExpiration: null,
    user: null,
    selectedTreatment: null, 
    selectSection: null,
  } 
  httpLink = createHttpLink({
    uri: `http://192.168.1.27:8000/graphql`,
  });
  
  authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: this.state.token ? `Bearer ${this.state.token}` : "",
      }
    }
  });
  
  client = new ApolloClient({
    link: this.authLink.concat(this.httpLink),
    cache: new InMemoryCache()
  });
  
  login=async (token,userId,tokenExpiration,user)=>{
    await this.setState({token: token,
                        userId: userId, 
                        tokenExpiration: tokenExpiration,
                        user: user });
    this.client = new ApolloClient({
      link: this.authLink.concat(this.httpLink),
      cache: new InMemoryCache()
    });

  }
  logout = () =>{
    this.setState({token: null, userId: null });
  }
  setTreatment= async (treatment)=>{
    await this.setState({selectedTreatment: treatment});
  }
  setSection= async (section)=>{
    await this.setState({selectedSection: section});
  }

  render(){
    const { classes }= this.props;
    console.log(theme)
    
    return (
    <ThemeProvider theme={theme}>
         <BrowserRouter>
           <React.Fragment>
             <ApolloProvider client={this.client}>
               <AuthContext.Provider value={
                 {  token: this.state.token, 
                    userId: this.state.userId,
                    tokenExpiration: this.state.tokenExpiration, 
                    user: this.state.user, 
                    selectedTreatment: this.state.selectedTreatment,
                    selectedSection: this.state.selectedSection,
                    login: this.login , 
                    logout: this.logout,
                    setTreatment: this.setTreatment, 
                    setSection: this.setSection, 
                  }}>
                 <MainNavigation> 
                   {/* <main className="main-content"> */}

                     <Switch> 
                       {console.log('switch token: ', this.state.token )}
                       {this.state.token && <Redirect from ="/" to="/patientHome"  exact/>}
                       {this.state.token && <Redirect from ="/auth" to="/patientHome"  exact/>}
                       {!this.state.token && <Route path ="/auth" component={AuthPage} /> }
                       <Route path ="/patientHome" component={PatientHome} />
                       {this.state.token &&  <Route path ="/treatment" component={Treatment} />  }   
                       {!this.state.token && <Redirect to="/auth"  exact/>}
                     </Switch>
                   {/* </main> */}
                 </MainNavigation>
               </AuthContext.Provider>
             </ApolloProvider>   
           </React.Fragment>
         </BrowserRouter>
      </ThemeProvider>

    );
  }
}

export default withStyles(styles)(App);
