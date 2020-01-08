import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import lightBlue from '@material-ui/core/colors/lightBlue';


import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
    palette: { 
        custom: {
            main: "#f0f3f5"

        }
    }
});

export default theme;