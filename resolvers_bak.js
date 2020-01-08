import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { ApolloError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import {token} from './../models/user' ;
const {OAuth2Client} = require('google-auth-library');


const MINUTE = 60;



export default  {
    User: {
        enrollments: async(user,_,{ dataSources: {db} }) =>await db.enrollments.findManyByIds(user.enrollments, { ttl: MINUTE } ),
    },
    Enrollment:{
        user: async (enrollment,_, { userId, dataSources: {db} }) => await db.users.findOneById(new ObjectId(enrollment.user) , { ttl: MINUTE }),
        treatment: async (enrollment,_, { userId, dataSources: {db} }) =>  await db.treatments.findOneById(new ObjectId(enrollment.treatment), { ttl: MINUTE }),
    },  
    Query: {
        treatments: async (_,__,{userId, dataSources: {db} }) => await db.treatments.find().toArray(),
        me: async (_,{userId: me},{ userId, dataSources: {db} }) =>  {      
            const test=db.getUsersCollection();
            
            if(me===userId)  return(db.users.findOneById(new ObjectId(me) ));     
            return new ApolloError('Authtication failure', 200020, {duplicate: true});
        },
        // login: async  (_,user,{dataSources: {db}}) => {
        //     const fetchedUser = await db.usersModel.findOne({email: user.email});    
        //     if(!fetchedUser) throw new ApolloError('User doesn\'t exists', 200000, );
        //     if(!await bcrypt.compare(user.password, fetchedUser.password)) throw  new ApolloError('Invalid password', 200010, );
        //     return token(fetchedUser);                
        // }, 
        login: async  (_,user,{dataSources: {userModel}}) => { 
            console.log('in res');
            console.log(user);
            console.log(userModel);

            return userModel.getAuth(user);
        },
        enrollments: async  (_,__,{dataSources: {db}}) => await db.enrollments.find().toArray(),
  },
  Mutation: {
        createUser: async (_,user,{dataSources: {db}}) =>{
            if (await db.users.findOne({email: user.email, authticationSource: user.authticationSource})) return new ApolloError('Registeration failed', 100000, {duplicate: true}) ;
            return (await db.getUsersCollection().insertOne({...user, password: await bcrypt.hash(user.password,12)})).ops[0];
        },
        registerUser: async (_,user,{dataSources: {db}})=> {
            if (await db.users.findOne({email: user.email, authticationSource: user.authticationSource})) return new ApolloError('Registeration failed', 100000, {duplicate: true}) ;
            return (await db.getUsersCollection().insertOne({...user, password: await bcrypt.hash(user.password,12)})).ops[0];
        },
        createTreatment: async (_,treatment,{dataSources: {db}} )=>{
            return((await db.treatments.insertOne(treatment)).ops[0]);
        },
        enrollInTreatment: async (_,{userId,treatmentId}, {dataSources: {db}} )=>{
            if(!await db.treatments.findOneById(new ObjectId(treatmentId))) return new ApolloError('Treatment doesn\'t exists',300000);  
            return (await db.users.findOneAndUpdate({_id: new ObjectId(userId)},{$addToSet: {treatments: treatmentId}})).value;
        },
        enrollment: async (_,{userId,treatmentId}, {dataSources: {db}} )=>{
            if(!await db.treatments.findOneById(new ObjectId(treatmentId))) return new ApolloError('Treatment doesn\'t exists',300000);
            // const fetchedUser= db.users.findOneById(new ObjectId(userId));  
            // if(!fectheduser) return new ApolloError('User doesn\'t exists',300010); 
            if(!await db.users.findOneById(new ObjectId(userId))) return new ApolloError('User doesn\'t exists',300010); 
            if(await db.enrollments.findOne({user: new ObjectId(userId),treatment: new ObjectId(treatmentId) })) return new ApolloError('Duplicate enrollment',300020); 
            const insertedEnrollment= (await db.enrollments.insertOne({user: new ObjectId(userId),treatment: new ObjectId(treatmentId) })).ops[0] ;
            await db.users.findOneAndUpdate({_id: new ObjectId(userId)},{$addToSet: {enrollments: insertedEnrollment._id}});
            return insertedEnrollment;
            //return((await db.enrollments.insertOne({user: new ObjectId(userId),treatment: new ObjectId(treatmentId) })).ops[0]);
        },
  },
};