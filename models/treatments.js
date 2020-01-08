import { MongoDataSource } from 'apollo-datasource-mongodb';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';


const MINUTE = 60


export default class Treatments extends MongoDataSource {
    constructor(db) {
        
        super();
        this.treatments=db.collection('treatments');
        this.collections = [this.treatments];
    }
    async getTreatments () {
        return await this.treatments.find().toArray();
    }
    async createTreatment(treatment){
        return (await this.treatments.insertOne(treatment)).ops[0];

    }
    async getTreatment (treatmentId) {
        const fetchedTreatment = await this.treatments.findOneById(new ObjectId(treatmentId), { ttl: MINUTE });
        if (!fetchedTreatment) throw new ApolloError("Treatment doesn't exists",300040,{treatmentId}); 
        return fetchedTreatment;
    }
    async getTreatmentsByIds(treatmentIds){
        if(!treatmentIds) return ;
        const fecthedTreatments = await this.treatments.findManyByIds(treatmentIds, { ttl: MINUTE } );
        if(!fecthedTreatments) throw new ApolloError('Treatments don\'t exist',300050,{fecthedTreatments});  
        return fecthedTreatments;
    }
  }

