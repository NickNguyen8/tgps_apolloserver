import express from 'express';
import typeDefs from './schema/typeDefs';
import resolvers from './schema/resolvers';
import { ApolloServer, gql } from 'apollo-server-express';
import {MongoClient, ObjectId} from 'mongodb';
import MainDataBase from './models/maindatabase';
import isAuth from './middleware/isAuth';
import Users from './models/users';
import Treatments from './models/treatments';
import Enrollments from './models/enrollments';
import Sections from './models/sections';
import { ServerHttp2Session } from 'http2';



const PORT= 8000;
const MONGO_URL = `mongodb://localhost:27017/${process.env.MONGO_DB}`;


const client = new MongoClient(MONGO_URL, { useNewUrlParser: true });
client.connect(e=>{
    //console.log(client.db(process.env.MONGO_DB)) 
    const db = client.db(process.env.MONGO_DB);
    //const session = client.startSession({ readPreference: { mode: "primary" } });
    //console.log(session);
    //console.log(session.getDatabase(process.env.MONGO_DB));
    //console.log(client.getMongo());

    //console.log(client.getMongo().startSession( { readPreference: { mode: "primary" } } )    )
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        dataSources: () => ({
            
            users: new Users(db),
            treatments: new Treatments(db), 
            enrollments: new Enrollments(db), 
            sections: new Sections(db), 

        }),
        context: ({ req }) => { 
                                return({userId: req.userId,
                            })},  
    });    
    const app = express();
    app.use(isAuth);
    server.applyMiddleware({ app });
    app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`));
});

