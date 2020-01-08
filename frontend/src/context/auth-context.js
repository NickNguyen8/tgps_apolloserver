import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    tokenExpiration: null,
    user: null,
    selectedTreatment: null, 
    selectedSection: null,


    login: ()=>{},
    logout: ()=>{},
    setTreatment: ()=>{},
    setSection: ()=>{},
    
});