import React, { Component } from 'react';
import PropTypes from "prop-types";


import { GoogleLogin } from 'react-google-login';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Button, TextField } from "@material-ui/core";
import { withStyles, withTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Email from '@material-ui/icons/Email';
import Container from '@material-ui/core/Container';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';


import CssBaseline from '@material-ui/core/CssBaseline';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

import CircularProgress from '@material-ui/core/CircularProgress';


import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import { withApollo } from 'react-apollo';











//import { Field,  FieldProps, Form, Formik } from "formik";



// import './Auth.css';
import AuthContext from '../context/auth-context';

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
        backgroundColor: theme.palette.primary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    progress: {
        margin: theme.spacing(2,2,2,2),
    },
    dailog: {
        margin: theme.spacing(2,2,2,2),
    },
    thirdParty: {
        margin: theme.spacing(2),
            
    },

  });
const GOOGLELOGIN = gql`
mutation loginUser($idToken: String!) {
    googleLoginUser(
        idToken: $idToken, 
    ){
        userId
        token
        tokenExpiration
        user{
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
}
`;


const TESTLOGIN = gql`
mutation testLogin {
    testLogin{
        userId
        token
        tokenExpiration
        user{
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
}
`;
const LOGIN = gql`
mutation loginUser($email: String!, $password: String!) {
    loginUser(
        email: $email, 
        password: $password
    ){
        userId
        token
        tokenExpiration
        user{
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
}
`;

class AuthPage extends Component{
    state = {
        isLogin: true,
    };
    
    static contextType = AuthContext;
    constructor(props){
        super(props);
    };
    
    onChange= e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value}); 
    }
    handleClickShowPassword=e=>{
        this.setState(prevState => {
            return {showPassword: !prevState.showPassword}; 
        })
    }
    
    responseGoogle = async (response,googleLoginMutation) => {
        //this.validateToken(response.Zi.id_token); 
        //console.log(response.Zi.id_token);
        try{
            console.log('idToken: ',response.Zi.id_token);
            await googleLoginMutation({ 
                        variables: {idToken: response.Zi.id_token},
                        update: (DataProxy, {data: {googleLoginUser: {token,userId,tokenExpiration,user }}})=>{
                                console.log(user);
                                this.context.login(token,userId,tokenExpiration,user);
                        },
            });
        }
        catch(e) {
            console.log(e);

        }

    }


    componentDidMount=async () =>{
        // const idToken= "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg0NmRkYWY4OGNjMTkyMzUyMjFjOGVlMGRmYTNiYjQ2YWUyN2JmZmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiODE1MjI4MzU2MDMtY2RjNm44NjFrc2tqcG1qbHI5MjhkajhsaWI5NWduMGYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MTUyMjgzNTYwMy1jZGM2bjg2MWtza2pwbWpscjkyOGRqOGxpYjk1Z24wZi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExMzU4MDMzODk0MDU2NTc0MDk0OCIsImVtYWlsIjoiYXJhaG1lZEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjJrMlJiRThyOU9MWXg1R1dUbTBIV0EiLCJuYW1lIjoiQXNpZiBBaG1lZCIsInBpY3R1cmUiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLUxCbG10TlBVOGE0L0FBQUFBQUFBQUFJL0FBQUFBQUFBQV9FL3FoZ0N2T2VqZHlJL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJBc2lmIiwiZmFtaWx5X25hbWUiOiJBaG1lZCIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNTYwMjU1NTIyLCJleHAiOjE1NjAyNTkxMjIsImp0aSI6ImRlNzQ5YWM4MGJmYTBjODIxYjkxYTdmZDBkNjc5ZDQ3NGUxMzI1NmEifQ.m6U_JmRl4b0zZ1EpNUzf7jK2yhI6CoaLDYxzEbh9u2gKyJoX8AstaCvPpuzSXT6HYJqRRLpjOMQDuX1KwKg-TLx_NhFfm1oXeEa54toKZUCKr4wHdfwdqtE_DV2iPSPysz1AdsYo00bFSLgKg-rUIpDcP9w9ZJoX_chGsREuQ7pn4mQwm43vYWDTtKrXTWLaXsGmV8KvqP77M_n8pjnvv8SRphKRwpgAXDm1ubK8ZddD9ZXPUMU3QWMbX2WuD38SpuXrR46OylhakxHxHN17Ck2_h8KqJ0hT23YlGl3AHSpM1Yc7zXw6SRdVpFLo1M61A1BMGSOoxUCMj-6t5M-sQw";
        // const {data: {googleLoginUser: {token,userId,tokenExpiration,user }}} = await client.mutate({
        //     mutation: GOOGLELOGIN,
        //     variables: {idToken: idToken},

        // });

        // const idToken= "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg0NmRkYWY4OGNjMTkyMzUyMjFjOGVlMGRmYTNiYjQ2YWUyN2JmZmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiODE1MjI4MzU2MDMtY2RjNm44NjFrc2tqcG1qbHI5MjhkajhsaWI5NWduMGYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MTUyMjgzNTYwMy1jZGM2bjg2MWtza2pwbWpscjkyOGRqOGxpYjk1Z24wZi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExMzU4MDMzODk0MDU2NTc0MDk0OCIsImVtYWlsIjoiYXJhaG1lZEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InY4eHpDOUFZUkNVcWI0T0syazNqNlEiLCJuYW1lIjoiQXNpZiBBaG1lZCIsInBpY3R1cmUiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLUxCbG10TlBVOGE0L0FBQUFBQUFBQUFJL0FBQUFBQUFBQV9FL3FoZ0N2T2VqZHlJL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJBc2lmIiwiZmFtaWx5X25hbWUiOiJBaG1lZCIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNTYwMjYwNjM1LCJleHAiOjE1NjAyNjQyMzUsImp0aSI6IjIwZGNkZDFiOWY2ODVkOTI0OGRmZDNmZjI1OGY5Mjg5ZTdmODE1YWMifQ.OY9T45yQNykC8ylysQmNvh07_Gs5s2GopRJtkCDYh-LO5CaBAQeELzLMjMveGtQ-LOqyFX65_293eeHiHx8SnzD17AEBH0dOK4Sa06qcQdSJX99AnRnxcN6AZglDOtWb7l-lVVobQoWxAZtkn8jZKHbWZPFZnYU2U3_KsTbc3UwxDMjNTmzKGpXnEPJkIaRkhpjqLE84Ntpt8u9AbmySn06F_Ne9qYMF52KvVUp3ChLQ-kVJHTwmUtMx8YOkwOCw90ljqVmcVOSy10OZaUruPOm2NSQ8NSTPPzLHh-2n1iFquQhawepLgY5DoFphR5qvQXjSjnV-rUCMIWbp1F0w7g";
        // const { client } = this.props;
        // const {data: {testLogin: {token,userId,tokenExpiration,user }}} = await client.mutate({
        //     mutation: TESTLOGIN,
        // });
        // console.log('in componentDidMopunt response: ', token,userId,tokenExpiration,user);
        // this.context.login(token,userId,tokenExpiration,user);

    }

    switchModeHandler = () =>{
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin}; 
        })
    }
    submitHandler = async (event,loginMutation) =>{
        event.preventDefault();
        const email = this.state.email;
        const password = this.state.password;
        if(email.trim().length ===0 || password.trim().length ===0){
            this.state.message="Please enter both email and password."; 
        }
        else{
            try{
                await loginMutation({ 
                            variables: {email: email ,password: password},
                            update: (DataProxy, {data: {loginUser: {token,userId,tokenExpiration,user }}})=>{
                                    this.context.login(token,userId,tokenExpiration,user);
                            },
                });
            }
            catch(e) {
                console.log(e);

            }
        }
        
    };
    render(){
        const { classes, theme } = this.props;
        const {  email, password} = this.state
        return(
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <Mutation mutation={LOGIN}>{(loginMutation,{loading, data, error})=>{return(
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
                                                            Signing in....
                                                        </Typography>
                                                    </Grid>
        
                                                </Grid>         
                                            </Dialog>
                                        </React.Fragment>
                                    }
                                    <form className={classes.form} noValidate>
                                        <TextField
                                            id="email"
                                            label="Email"
                                            //className={classes.textField}
                                            fullWidth
                                            type="email"
                                            name="email"
                                            margin="normal"
                                            variant="outlined"
                                            autoFocus={true}
                                            //  error="true"
                                            required
                                            helperText="Please enter your email"
                                            onChange={this.onChange}
                                            InputProps={{
                                                endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                    edge="end"
                                                    aria-label="Email"
                                                    >
                                                    <Email /> 
                                                    </IconButton>
                                                </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <TextField
                                                id="password"
                                                label="password"
                                                //className={classes.textField}
                                                type={this.state.showPassword ? 'text' : 'password'}
                                                name="password"
                                                margin="normal"
                                                required
                                                fullWidth
                                                variant="outlined"
                                                helperText="Please enter your password"
                                                autoComplete='new-password'
                                                // InputLabelProps={{
                                                //     shrink: true,
                                                // }}
                                                onChange={this.onChange}
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                        edge="end"
                                                        aria-label="Toggle password visibility 123"
                                                        onClick={this.handleClickShowPassword}
                                                        >
                                                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}
                                                onClick={ (e) => this.submitHandler(e,loginMutation)}>
                                                Sign In
                                            </Button>
                                            <Grid container>
                                                <Grid item xs>
                                                <Link href="#" variant="body2">
                                                    Forgot password?
                                                </Link>
                                                </Grid>
                                                <Grid item>
                                                <Link href="#" variant="body2">
                                                    {"Don't have an account? Sign Up"}
                                                </Link>
                                                </Grid>
                                            </Grid>             
                                    </form>
                                </React.Fragment>
                                );}}    
                            </Mutation>

                            <Grid container    justify="space-between" alignItems="center" className={classes.thirdParty} >
                                <Grid item xs   >
                                <Mutation mutation={GOOGLELOGIN}>{(googleLoginMutation,{loading, data, error})=>{return(
                                    <React.Fragment>
                                        {loading &&  
                                        
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
                                                            Signing in....
                                                        </Typography>
                                                    </Grid>
        
                                                </Grid>         
                                            </Dialog>
                                            
                                        }
                                        
                                        <GoogleLogin clientId="81522835603-cdc6n861kskjpmjlr928dj8lib95gn0f.apps.googleusercontent.com"
                                            buttonText="Login"
                                            onSuccess={(r) => this.responseGoogle(r,googleLoginMutation)}
                                            onFailure={this.responseGoogle}
                                            cookiePolicy={'single_host_origin'}
                                        />
                                    </React.Fragment>)}}
                                </Mutation>

                                </Grid>
                                <Grid item xs>
                                    
                                </Grid>
                            </Grid>              
                        </div>
                    </Container>
                

     
        );
    
    }
}
// AuthPage.propTypes = {
//     classes: PropTypes.object.isRequired,
//     theme: PropTypes.object.isRequired,
//   };
export default withApollo(withStyles(styles )(withTheme(AuthPage)));