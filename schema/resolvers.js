import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { ApolloError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
//mport {token} from './../models/user' ;

const MINUTE = 60;



export default  {
    User: {
        enrollments: async(user,_,{ dataSources: {enrollments} }) => await enrollments.getEnrollmentByUserIds([user._id]),
        //getEnrollmentByIds(user.enrollments),
        //await db.enrollments.findManyByIds(user.enrollments, { ttl: MINUTE } ),
    },
    Enrollment:{
        user: async (enrollment,_, {  dataSources: {users} }) => await users.getUser(new ObjectId(enrollment.user)),
        treatment: async (enrollment,_, { dataSources: {treatments} }) =>  await treatments.getTreatment(new ObjectId(enrollment.treatment)),
    },  
    Treatment:{
        subSections: async (treatment,_,{ dataSources: {treatments} }) => await treatments.getTreatmentsByIds(treatment.subSections),
    },
    // Section:{
    //     subSections: async (section,_,{ dataSources: {sections} }) => {console.log('in section section ', section.subSections ); return await sections.getSectionsBySectionIds(section.subSections)},
    // },
    AuthData: {
        user: async (authData,_, {  dataSources: {users} }) => await users.getUser(new ObjectId(authData.userId)),
    },
    Query: {
        //treatments: async (_,__,{userId, dataSources: {db} }) => await db.treatments.find().toArray(),
        treatments: async (_,__, {dataSources: {treatments} }) => await treatments.getTreatments(),
        sections: async (_,__, {dataSources: {sections} }) => sections.getSections(),
        me: async (_,{userId},{dataSources: {users}}) =>  await users.getMe(userId),
        login: async  (_,user,{dataSources: {users}}) => await users.getAuth(user),
        enrollments: async  (_,__,{dataSources: {enrollments}}) => await enrollments.getEnrollments(),
        user: async (_, {userId}, {  dataSources: {users} }) => await users.getUser(new ObjectId(userId)),
        //section: async (_,{sectionId},{dataSources: {enrollments}})=> await enrollments.getSection(new ObjectId(sectionId)),
        treatment: async (_,{treatmentId},{  dataSources: {treatments,} } ) => await treatments.getTreatment(treatmentId),
        section: async (_,{sectionId},{  dataSources: {sections,} }) =>await sections.getSection(sectionId),
  },
  Mutation: {
        createUser:async (_,user,{dataSources: {users}})=> users.createUser(user),
        registerUser: async (_,user,{dataSources: {users}})=> users.createUser(user),
        createTreatment: async (_,treatment,{dataSources: {treatments}} )=>treatments.createTreatment(treatment),
        enrollInTreatment: async (_,{userId,treatmentId}, {dataSources: {db}} )=>{
            if(!await db.treatments.findOneById(new ObjectId(treatmentId))) return new ApolloError('Treatment doesn\'t exists',300000);  
            return (await db.users.findOneAndUpdate({_id: new ObjectId(userId)},{$addToSet: {treatments: treatmentId}})).value;
        },
        enrollment: async (_,{userId,treatmentId}, {dataSources: {users,treatments,enrollments}} )=>{
            // check if user exists
            users.getUser(userId);
            treatments.getTreatment(treatmentId);
            // enroll
            return await enrollments.enroll(userId,treatmentId);
        },
        loginUser:  async  (_,user,{dataSources: {users}}) => await users.getAuth(user),
        googleLoginUser: async (_,idToken,{dataSources: {users}})=> await users.getGoogleAuth(idToken),
        testLogin: async (_,__,{dataSources: {users}})=> await users.getTestAuth(),

  },
};