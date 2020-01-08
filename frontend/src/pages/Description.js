import { compiler } from 'markdown-to-jsx';
import React from 'react';
import { render } from 'react-dom';


function Description({description}){

 
    return compiler('# Hello world!');
 
/*
    renders:
 
    <h1>Hello world!</h1>
 */
}
export default Description;