import { MongoDataSource } from 'apollo-datasource-mongodb';
//import UserModel from './users';


export default class MainDataBase extends MongoDataSource {
 
    constructor(db) {
        super();
        this.users=db.collection('users');
        //this.usersModel=new UserModel(db);        
        this.treatments= db.collection('treatments');
        this.enrollments= db.collection('enrollments')
         
        // console.log('maindatabase constructor');
        // console.log(db.collection);
        //this.collections = [db.collection('users'),db.collection('bookings')];
        this.collections = [this.users
                            ,this.treatments
                            ,this.enrollments
                            ,this.usersModel
                        ];
        //this.collections = [User];
    }
    getUsersCollection(){
        console.log('maindatabase getUsersCollection context: ' + this.context);
        console.log(this.context);
        return this.users;
    }
    async getUser_(id){
        //console.log(this.collections);
        console.log('maindatabase getUser_ id: ' + id);
        console.log('maindatabase getUser_ : ' +  await this.collections.find( col => col.s.name === 'users' ).findOneById(id) );

        //return [ await this.collections.find( col => col.s.name === 'users' ).findOneById(id)];
        console.log('maindatabase ');
        return [this.users.findOneById(id)]; 
    } 
    getCollection(){
        return this.collections;
    }
    getUsers(){
        return User.find();
    }
  }
