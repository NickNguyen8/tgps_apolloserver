import { MongoDataSource } from 'apollo-datasource-mongodb';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';


const MINUTE = 60


export default class enrollments extends MongoDataSource {
    constructor(db) {
        // console.log('in cons');
        
        // console.log(db);
        super();
        this.enrollments=db.collection('enrollments');
        this.collections = [this.enrollments];
    }
    async getEnrollments () {
        return await this.enrollments.find().toArray();
    }
    async createEnrollment(treatment){
        return (await this.treatments.insertOne(treatment)).ops[0];

    }
    async enroll(userId,treatmentId){
        //console.log(users);
        if(await this.enrollments.findOne({user: new ObjectId(userId),treatment: new ObjectId(treatmentId) })) throw new ApolloError('Duplicate enrollment',300020); 
        const insertedEnrollment= (await this.enrollments.insertOne({user: new ObjectId(userId),treatment: new ObjectId(treatmentId) })).ops[0] ;
        //console.log(this.treatments
        
        //await users.findOneAndUpdate({_id: new ObjectId(user._id)},{$addToSet: {enrollments: insertedEnrollment._id}});

        return insertedEnrollment;
        //return {_id: '1232321321'};
    }
    async getEnrollment(enrollmentId){
        const fecthedEnrollment = this.enrollments.findOneById(new ObjectId(enrollmentId), { ttl: MINUTE } )
        if(!fecthedEnrollment) throw new ApolloError('Enrollment doesn\'t exists',300010,{enrollmentId});  
        return fecthedEnrollment;

    }


    async getEnrollmentByIds(enrollments){
        console.log(enrollments);
        const fecthedEnrollments = await this.enrollments.findManyByIds(enrollments, { ttl: MINUTE } );
        if(!fecthedEnrollments) throw new ApolloError('Enrollments don\'t exists',300050,{enrollments});  
        return fecthedEnrollments;
    }
    async getEnrollmentByUserIds(userIds){
        console.log(await  this.enrollments.find( { user: { $in: userIds } } ).explain() );
        const fecthedEnrollments = await this.enrollments.find( { user: { $in: userIds } } );
        if(!fecthedEnrollments) throw new ApolloError('Enrollments don\'t exists',300050,{enrollments});  
        return fecthedEnrollments.toArray();
    }
  }
