import express from 'express';
import typeDefs from './schema/typeDefs';
import resolvers from './schema/resolvers';
import { ApolloServer, gql } from 'apollo-server-express';
import {MongoClient, ObjectId} from 'mongodb';
import MainDataBase from './models/maindatabase';
import isAuth from './middleware/isAuth';
import UserModel from './models/users';

const PORT= 3000;
const MONGO_URL = `mongodb://localhost:27017/${process.env.MONGO_DB}`;


const mongoConnection =  MongoClient.connect(MONGO_URL, { useNewUrlParser: true }).then( conn=>{
    console.log(conn);
    return conn});
console.log (mongoConnection); 
//console.log (mongoConnection.db(process.env.MONGO_DB)); 


MongoClient.connect(MONGO_URL, { useNewUrlParser: true } , (err,conn)=>{
    if(err){
            console.log(err);
            return;
    }
    const ds = new MainDataBase(conn.db(process.env.MONGO_DB)); 
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        dataSources: () => ({
            // //db: new MainDataBase(db.db(process.env.MONGO_DB))
            // db: db,
            userModel: new UserModel(conn.db(process.env.MONGO_DB)),
          }) , 
        context: ({ req }) => {
            return  { 
                userId: req.userId              
            };
        },  
    });
    const app = express();
    app.use(isAuth);
    //app.use((req)=>{ req.userId='123'; console.log('app use');req.next();} );
    server.applyMiddleware({ app });
    // console.log('db uri: ' + dbUri);
    //console.log('db options: ' + dbOptions);
    
    //mongoose.connect(dbUri, dbOptions ).then(()=>{ 
        //console.log('conncted to db');
        app.listen({ port: PORT }, () =>
          console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
        //);
    
        //}
    );
    
    
    
    
    
    


});
