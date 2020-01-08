import { MongoDataSource } from 'apollo-datasource-mongodb';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import {OAuth2Client} from 'google-auth-library';



const MINUTE = 60
const token=(user)=> {
    return {
        userId: user._id,
        token: jwt.sign(
            {
                userId: user._id,
                email: user.email
            }
            ,process.env.JWT_PASSWORD
            ,{  expiresIn: '1h' }
            ),
        tokenExpiration: 1
    }; 
}  

export default class Users extends MongoDataSource {
    constructor(db) {
        super();
        this.users=db.collection('users');
        this.collections = [this.users];
    }
    async getMe(userId){
        if (!(userId===this.context.userId)) throw new ApolloError('You can only query authticated user', 200030);
        return await this.users.findOneById(new ObjectId(userId), { ttl: MINUTE }); 
    }
    async createUser(user){
        if (await this.users.findOne({email: user.email, authticationSource: user.authticationSource})) return new ApolloError('Registeration failed', 100000, {duplicate: true}) ;
        return (await this.users.insertOne({...user, password: await bcrypt.hash(user.password,12)})).ops[0];

    }
    async getAuth({email,password}){
        const fetchedUser = await this.users.findOne({email: email });
        if(!fetchedUser) throw new ApolloError('User doesn\'t exists', 200000, );
        if(!await bcrypt.compare(password, fetchedUser.password)) throw  new ApolloError('Invalid password', 200010, );
        return token(fetchedUser);                
    }
    async getUser(userId){
        //getUser tries to find a user with given userId and return it otherwise it throws user not found error so it can be user to check if user exists
        const fetchedUser= await this.users.findOneById(userId, { ttl: MINUTE });
        if (!fetchedUser) throw new ApolloError("User doesn't exists",200040,{userId}); 
        return fetchedUser; 
    }
    async enroll(userId,enrollmentId){
                return await this.users.findOneAndUpdate({_id: new ObjectId(userId)},{$addToSet: {enrollments: enrollmentId}});

    }
    async getGoogleAuth({idToken}){
        const CLIENT_ID = "81522835603-cdc6n861kskjpmjlr928dj8lib95gn0f.apps.googleusercontent.com";
        const client = new OAuth2Client(CLIENT_ID);
        try{
            const ticket = await client.verifyIdToken({
                idToken: idToken,
                audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            });
            const payload = ticket.getPayload();
            
            const user = {  email: payload.email , 
                            authticationSource: 'GOOGLE',
                            firstName: payload.given_name,              
                            lastName:  payload.family_name             
                        }
            return token( (await this.users.findOne(user)) || (await this.users.insertOne(user)).ops[0]);                
        }
        catch(e){
            console.log(e);
        }
    }
    async getTestAuth(){      
        const user = {  email: 'arahmed@gmail.com'             
                    }
        return token( await this.users.findOne(user));                
    }
  }

