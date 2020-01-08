import { gql } from 'apollo-server-express';


export default gql`
    type User {
        _id:                    ID!
        email:                  String!
        firstName:              String!
        lastName:               String!
        middleName:             String
        authenticationSource:   String
        authenticationId:       String
        enrollments:            [Enrollment!]!
    }
    type Enrollment{
        _id:                    ID!
        user:                   User!
        treatment:              Treatment!
    }
    type Treatment {
        _id:                    ID!
        name:                   String!
        description:            String!
        tableOfContents:        [ContentEntry!]
        content:                String
        type:                   String!
        subSections:            [Treatment!]
    }
    type ContentEntry {
        level:                  Int!
        entry:                  String!
    }
    type Section {
        _id:                    ID!
        name:                   String!
        description:            String!
        tableOfContents:        [ContentEntry!]
        content:                String
        subSections:            [Section!]
    }

    type AuthData{
        userId:                 ID!
        token:                  String!
        tokenExpiration:        Int!
        user:                   User!
    }
    type Query {
        me(userId: String!): User!
        login(email: String!,password: String!): AuthData! 
        treatments: [Treatment!]!
        enrollments: [Enrollment!]!
        user(userId: String): User!
        sections: [Section!]
        section(sectionId: ID!): Section!
        treatment(treatmentId: ID!): Treatment!
    }
    type Mutation {
        createTreatment(
            name:                   String!
            description:            String!
            text:                   String
        ): Treatment!
        createUser(
            email:                  String!,
            password:               String!,
            firstName:              String!,
            lastName:               String!,
            middleName:             String,
            authenticationSource:   String!,
            authenticationId:       String!,
        ): User!
        registerUser(
            email:                  String!,
            password:               String!,
            firstName:              String!,
            lastName:               String!,
            middleName:             String,
            authenticationSource:   String!,
            authenticationId:       String!,
        ): User!
        enrollInTreatment(userId: ID!,treatmentId: ID! ): User!
        enrollment(userId: ID!,treatmentId: ID! ): Enrollment!
        loginUser(email: String!,password: String!): AuthData! 
        googleLoginUser(idToken: String!): AuthData! 
        testLogin: AuthData!


    }
`;