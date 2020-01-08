import React,  { useState }from 'react';
import AuthContext from './../context/auth-context';
import { makeStyles, useTheme } from '@material-ui/core/styles';
//import Markdown from 'react-markdown';
import {Typography,Button,Grid,Hidden,Link,List,ListItem,Divider } from '@material-ui/core';
import {  deserialize } from "react-serialize"
// import Button from '@material-ui/core/Button';
import Markdown,{ compiler } from 'markdown-to-jsx';
// import Grid from '@material-ui/core/Grid';
import ScrollableAnchor from 'react-scrollable-anchor'
import { getQueryDefinition } from 'apollo-utilities';
import gql from "graphql-tag";
import { Query } from "react-apollo";






const useStyles = makeStyles(theme => ({
  gridContainer:{
    height: '100%',
  },
  gridHeader:{
    overflow: 'auto',
    height: '10%',
    minHeight: 54, 
  },
  gridSection:{
    overflow: 'auto',
    height: '90%'
  },
  gridTableOfConetents:{
    overflow: 'auto',
    height: '90%',
  },
  img:{
      maxWidth: '100%',
      maxHeight: '100%',
  }

}));

const HandleTextContent=(props)=>{
  const {variant,id}=props;
  return(
    <React.Fragment>
      <Typography  variant={variant} >
        {id && <a id={id}></a>} 
        {props.children}
      </Typography>

    </React.Fragment> 
  )
}

function Treatment(props) {
  const classes = useStyles();
  const theme = useTheme();
  function slugify(str) {
    return str
        .replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g, 'a')
        .replace(/[çÇ]/g, 'c')
        .replace(/[ðÐ]/g, 'd')
        .replace(/[ÈÉÊËéèêë]/g, 'e')
        .replace(/[ÏïÎîÍíÌì]/g, 'i')
        .replace(/[Ññ]/g, 'n')
        .replace(/[øØœŒÕõÔôÓóÒò]/g, 'o')
        .replace(/[ÜüÛûÚúÙù]/g, 'u')
        .replace(/[ŸÿÝý]/g, 'y')
        .replace(/[^a-z0-9- ]/gi, '')
        .replace(/ /gi, '-')
        .toLowerCase();
  }
  const options = {
    slugify: str => slugify(str),
    overrides: 
    {
        h1: {component: HandleTextContent, props: { variant: 'h4' }},
        h2: {component: HandleTextContent, props: { variant: 'h5' }},
        h3: {component: HandleTextContent, props: { variant: 'h6' }},
        h4: {component: HandleTextContent, props: { variant: 'h6' }},
        h5: {component: HandleTextContent, props: { variant: 'h6' }},
        h6: {component: HandleTextContent, props: { variant: 'h6' }},
        p: {component: HandleTextContent, props: { variant: 'body1' }},
        img: {
          component: 'img',
          props: {
              className: classes.img,
          },
        },
    },
  }
  
  const TREATMENT = gql`
    query  treatment($id: ID!) {
      treatment(treatmentId: $id) {
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
  `;
  return (
    <AuthContext.Consumer>
      {context => (
        <Query query={TREATMENT} variables={{ id: context.selectedTreatment._id }} >
        {({ loading, error, data ,refetch }) => {return( 
        <React.Fragment >
          {console.log('status of loading && data && section  && context',loading, data, context )}
          {!loading && data && 
          <React.Fragment > 
            {/* {section=data.section?data.section:data.treatment} */}
            {/* {setSection(data.section?data.section:data.treatment)} */}
          <Grid container  spacing={1}   direction="row" className={classes.gridContainer} > 
          <Grid item xs={12} sm={12} className={classes.gridHeader} >
              <Button  variant="outlined" size="small" onClick={(e)=>{ 
                  e.preventDefault();
                  context.setTreatment();
                }}>
                  Back..
              </Button>
            </Grid>
            <Grid item xs={12} sm={9}  md={9} className={classes.gridSection} >
                <Typography variant="h5">
                  {console.log('treatment: ',data.treatment)}
                  {data.treatment.name }
                  {/* {context.selectedTreatment.name } */}

                </Typography>
                {console.log('treatment description :', data.treatment.description  )}
                {console.log('type of treatment description :', typeof data.treatment.description  )}

                
                <Markdown options={options}>
                  {data.treatment.description}
                  {/* {context.selectedTreatment.description} */}
                </Markdown>
                <Markdown options={options}>
                  {data.treatment.content}
                  {/* {context.selectedTreatment.content} */}
                </Markdown>
            </Grid>
            <Hidden smDown>
              <Grid item  sm={3}  md={3} className={classes.gridTableOfConetents} zeroMinWidth >
                <Typography variant="h6">
                   {data.treatment.name+' Contents:' }

                  {/* {context.selectedTreatment.name+' Contents:' } */}
                </Typography>
                <List>
                  {data.treatment.tableOfContents.map(entry=>{
                  // {context.selectedTreatment.tableOfContents.map(entry=>{
                    return(
                      <ListItem dense >
                      {/* <Typography variant={'h'+(entry.level+4)}> */}
                        <Link color="textSecondary" variant='body2'  href={'#'+slugify(entry.entry.trim())} >
                          {entry.entry}
                        </Link>
                      {/* </Typography> */}
                      </ListItem>
                  )})}
                  {data.treatment.subSections && <Divider />}
                  {data.treatment.subSections && data.treatment.subSections.map(subSection=>{
                    return(
                      <ListItem dense >
                      {/* <Typography variant={'h'+(entry.level+4)}> */}
                        <Link color="textSecondary" variant='body2' href='' onClick={async e=>
                          {
                            e.preventDefault(); 
                            await context.setTreatment(subSection); 
                            refetch( {variables: { id: subSection._id }} ); 
                            console.log(subSection)} }>
                          {subSection.name}
                        </Link>
                      {/* </Typography> */}
                      </ListItem>
                  )})}
                    <Divider />
                    <ListItem dense >
                        <Link color="textSecondary" variant='body2' href=''>
                          {'Testing'}
                        </Link>
                      </ListItem>
                      <ListItem dense >
                      <Link color="textSecondary" variant='body2' href=''>
                          {'Medication'}
                      </Link>
                    </ListItem>
                    
                    

                </List>  
              </Grid>
            </Hidden>
          </Grid>
          </React.Fragment >
          }  
        </React.Fragment>
        )}}
        </Query>
        )}
    </AuthContext.Consumer>
  );
}

export default Treatment;