import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import './Auth.css';
import AuthContext from '../context/auth-context';


const LOGIN = gql`
    mutation User($email: String!, $password: String!) {
        loginUser(
            email: $email, 
            password: $password
        ){
            userId
            token	
        }
    }
`;

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

class AuthPage extends Component{
    state = {
        isLogin: true,
        message: ''
    };

    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    };
    responseGoogle = (response) => {
        this.validateToken(response.Zi.id_token);
        console.log("Id token= " +response.Zi.id_token);
        console.log(response);
    }

    switchModeHandler = () =>{
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin}; 
        })
    }
    submitHandler = async (event,loginF) =>{
        
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        if(email.trim().length ===0 || password.trim().length ===0){
            this.state.message="Please enter both email and password."; 
        }
        else{

            console.log(email);
            console.log(password);
            //this.messageEl.current.innerHTML='Trying....';
            try{
                await loginF({ variables: {email: email ,password: password}});
            }
            catch {

            }
        }
        
    };
    render(){
        console.log('in auth page');
        return(
            <Mutation mutation={LOGIN}>
                {(loginF,{loading, data, error})=>{ 
                    return(
                        <React.Fragment>
                        { data?console.log(data):null }
                        <form className="auth-form" onSubmit={ (e) => this.submitHandler(e,loginF) }>
                            {console.log(this.state.message )}
                            { this.state.message && <h1 ref={this.messageEl}>{this.state.message}</h1> }
                            { loading && <h1 ref={this.messageEl}>Trying....</h1> } 
                            { data && <h1 ref={this.messageEl}>Login Sucessful</h1> }
                            { error && <h1 ref={this.messageEl}>Login Failed</h1> }
                            
                            <div className="form-control">
                                <label htmlFor="email"  >E-Mail </label>
                                <input type="email" id="email" ref={this.emailEl}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="password">Password </label>
                                <input type="password" id="password" ref={this.passwordEl} />
                            </div>
                            <div className="form-actions">
                                <button type="submit">Submit</button>
                                <button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login' } </button>
                            </div>
                            <div className="form-actions">
                                <GoogleLogin clientId="81522835603-cdc6n861kskjpmjlr928dj8lib95gn0f.apps.googleusercontent.com"
                                    buttonText="Login"
                                    onSuccess={this.responseGoogle}
                                    onFailure={this.responseGoogle}
                                    cookiePolicy={'single_host_origin'}
                                />
                            </div>
                        </form>
                        </React.Fragment>

                    )
                }}
            </Mutation>
        );
    
    }
}

export default AuthPage;