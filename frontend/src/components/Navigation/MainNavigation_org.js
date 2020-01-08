import React, { Component } from 'react';

import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';


import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/Mail';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';



//import './MainNavigation.css';





class mainNavigation extends Component{  
    
    renderNavLink = itemProps => <NavLink to={this.props.to} {...itemProps} />;

    render(){
        return(
            <AuthContext.Consumer>
            {(context)=>{
                return( 
                    <React.Fragment>
                    <div>
                        <AppBar position="static">
                            <Toolbar>
                                <IconButton  color="inherit" aria-label="Menu">
                                    <MenuIcon />
                                </IconButton>

                                <Typography variant="title" color="inherit">
                                React & Material-UI Sample Application
                                </Typography>
                                <Button component={this.renderNavLink} to="/bookings">
                                    Bookings
                                    
                                </Button>
                                <IconButton color="inherit">
                                    <Badge badgeContent={4} color="secondary">
                                        <MailIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    aria-owns='material-appbar'
                                    aria-haspopup="true"
                                    onClick=""
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                    </div>
                    
                    </React.Fragment>
                )

            }}
    
            </AuthContext.Consumer>
        )
        
    }
}

export default mainNavigation;