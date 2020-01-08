import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ApolloError } from 'apollo-server-express';
import { ObjectId } from 'mongodb';


const MINUTE = 60


export default class enrollments extends MongoDataSource {
    constructor(db) {
        // console.log('in cons');
        
        // console.log(db);
        super();
        this.sections=db.collection('sections');
        this.collections = [this.sections];
    }
    async getSections (sections) {
        console.log('in getSections: ',sections)
        const fetchedSections =  await this.sections.find().toArray();
        fetchedSections.map(section=>console.log(section.name,section.tableOfContents));
        //console.log('fecthed section :', fetchedSections);

        return fetchedSections;
    }


    async getSectionsBySectionIds(sections){
        console.log(sections);
        const fecthedSections = await this.sections.findManyByIds(sections, { ttl: MINUTE } );
        if(!fecthedSections) throw new ApolloError('Sections don\'t exists',400050,{fecthedSections});  
        console.log('fecthed section :', fecthedSections);
        return fecthedSections;
    }
    async getSection (sectionId) {
        const fetchedSection = await this.sections.findOneById(new ObjectId(sectionId), { ttl: MINUTE });
        if (!fetchedSection) throw new ApolloError("Treatment doesn't exists",400040,{sectionId}); 
        return fetchedSection;
    }

  }
