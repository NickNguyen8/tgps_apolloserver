import React from 'react';
import AuthContext from './../../context/auth-context';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import BarChartIcon from '@material-ui/icons/BarChart';






const useStyles = makeStyles(theme => ({
      root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },

}));

function SideNav(){
    const classes = useStyles();
    const theme = useTheme();
    // const [open, setOpen] = React.useState(false);

    // function handleDrawerOpen() {
    //   setOpen(true);
    // }

    // function handleDrawerClose() {
    //   setOpen(false);
    // }
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    function handleListItemClick(event, index) {
      setSelectedIndex(index);
    }
    return (
        <AuthContext.Consumer>
            {context => (
                <Drawer anchor='right' open variant='permanent'>
                    <div className={classes.root}>
                        <div className={classes.toolbar}>
                            <IconButton >
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </div>
                        <List component="nav" aria-label="Main mailbox folders">
                            <ListItem
                                button
                                selected={selectedIndex === 0}
                                onClick={event => handleListItemClick(event, 0)}
                            >
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Inbox" />
                            </ListItem>
                            <Divider />

                            <ListItem
                                button
                                selected={selectedIndex === 1}
                                onClick={event => handleListItemClick(event, 1)}
                            >
                                <ListItemIcon>
                                    <BarChartIcon />
                                </ListItemIcon>
                                <ListItemText primary="My Progress" />
                            </ListItem>
                        </List>
                        <Divider />
                        <List component="nav" aria-label="Secondary mailbox folder">
                            <ListItem
                                button
                                selected={selectedIndex === 2}
                                onClick={event => handleListItemClick(event, 2)}
                            >
                                <ListItemText primary="Trash" />
                            </ListItem>
                            <ListItem
                                button
                                selected={selectedIndex === 3}
                                onClick={event => handleListItemClick(event, 3)}
                            >
                                <ListItemText primary="Spam" />
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
            )}

        </AuthContext.Consumer>
    );
}

export default SideNav;