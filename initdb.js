import {MongoClient, ObjectId} from 'mongodb';
import { compiler } from 'markdown-to-jsx';
import fs from 'fs';
import marked from 'react-marked';
import ReactDOMServer from 'react-dom/server';
const renderer = new marked.Renderer();
import { serialize, deserialize } from "react-serialize";
import {Builder,parseString} from  'xml2js';

const OAB = fs.readFileSync('./sources/OAB.xml', 'utf-8'); 
const OAB1 = fs.readFileSync('./sources/OAB.1.xml', 'utf-8'); 
const OAB2 = fs.readFileSync('./sources/OAB.2.xml', 'utf-8'); 


const BPH = fs.readFileSync('./sources/BPH.md', 'utf-8');
const MONGO_URL = `mongodb://localhost:27017/${process.env.MONGO_DB}`;

const parse= (xmlContentToParse)=>{
    const nameToLowerCase =name => name.toLowerCase(); 
    let parsed ={};    
    parseString(xmlContentToParse,
        {
            tagNameProcessors: [nameToLowerCase],
            strict: false,
            preserveChildrenOrder: true,
            trim: true,
            explicitArray: false,
        },
        (err,result)=>{
            if(err) console.log(err)
            else parsed=result;
        }
    );
    return parsed;
}
const buildTableOfContnets=(content)=>{
    let headingMatch;
    let tableOfContent=[];
    const headingMatchRegEx=/(#+)(.+)/g
    while((headingMatch=headingMatchRegEx.exec(content))!==null){
        tableOfContent.push({
            level: headingMatch[1].length, 
            entry: headingMatch[2],   
        })
    }
    return tableOfContent;
}
const processContent= async (treatments,obj,root)=>{
    if(obj.content){
        obj.tableOfContents = buildTableOfContnets(obj.content);
    }
    // console.log('subsections:',obj.subsections );
    if(obj.subsections) {
        // console.log('in if :', obj);
        if(!Array.isArray(obj.subsections.section)) obj.subsections.section =[obj.subsections.section];   
        obj.subSections =  await Promise.all(obj.subsections.section.map(section=>processContent(treatments,section,false)));
    }
        obj.type = root?'main':'section';
        delete obj.subsections;
        if(obj.name) obj.name = obj.name.replace(/(^[ 	]*)/gm,'');
        if(obj.description) obj.description = obj.description.replace(/(^[ 	]*)/gm,'');
        if(obj.content) obj.content = obj.content.replace(/(^[ 	]*)/gm,'');
        console.log(obj.content); 
        const insertedTreatment=await treatments.insertOne(obj);
        return insertedTreatment.insertedId;
    // }
    // else{
    //     console.log('in else :', obj);
    //     obj.type = root?'main':'section';
    //     const insertedTreatment=await treatments.insertOne(obj);
    //     return insertedTreatment.insertedId;
    // }
}

MongoClient.connect(MONGO_URL, { useNewUrlParser: true } , async (err,db)=>{
    if(err){
            console.log(err);
            return;
    }
    const database = db.db(process.env.MONGO_DB);
    const users= database.collection('users');
    const enrollments= database.collection('enrollments');
    const treatments= database.collection('treatments');
    const sections= database.collection('sections');
        
    users.createIndex(
        {
            email: 1,
            authicationSource: 1
        },
        {
            unique: true,
            //name: email_authicationSource

        }
    );
    enrollments.createIndex(
        {
            user: 1,
            treatment: 1
        },
        {
            unique: true,
            name: "idxUserTreatement"

        }
    );
    enrollments.createIndex(
        {
            user: 1
        },
        {
            name: "idxUser"

        }
    );

   
    enrollments.remove({});
    treatments.remove({});
    sections.remove({});
    const parsedOAB=parse(OAB);
    // const parsedBPH=parse(BPH);
    //console.log('parsedOAB: ', parsedOAB);
    const oab= await processContent(treatments,parsedOAB.treatment,true);
    await enrollments.insertOne({user: new ObjectId("5e150d8bd7fd326149c716df"), treatment: new ObjectId(oab)});
    // const bph= await processContent(sections,treatments,parsedBPH.treatment,true);
    // await enrollments.insertOne({user: new ObjectId("5cf5cabedac4b331a7f8511c"), treatment: new ObjectId(bph.ops[0]._id) });
    

    // const parsedOAB1=parse(OAB);
    // const parsedBPH1=parse(BPH);
    // console.log('parsedBPH: ', parsedBPH);
    const parsedOAB1=parse(OAB1);
    const oab1= await processContent(treatments,parsedOAB1.treatment,true);
    await enrollments.insertOne({user: new ObjectId("5e150d8bd7fd326149c716df"), treatment: new ObjectId(oab1)});

    const parsedOAB2=parse(OAB2);
    const oab2= await processContent(treatments,parsedOAB2.treatment,true);
    await enrollments.insertOne({user: new ObjectId("5e150d8bd7fd326149c716df"), treatment: new ObjectId(oab2)});
    // const bph1= await processContent(sections,treatments,parsedBPH1.treatment,true);
    // await enrollments.insertOne({user: new ObjectId("5cf5cabedac4b331a7f8511c"), treatment: new ObjectId(bph1.ops[0]._id) });



    
    
 


});
