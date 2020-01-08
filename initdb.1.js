import {MongoClient, ObjectId} from 'mongodb';
import { compiler } from 'markdown-to-jsx';
import fs from 'fs';
import marked from 'react-marked';
import ReactDOMServer from 'react-dom/server';
const renderer = new marked.Renderer();
import { serialize, deserialize } from "react-serialize";
import {Builder,parseString} from  'xml2js';

const OAB = fs.readFileSync('./sources/OAB.md', 'utf-8'); 
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
const processContent= async (sections,treatments,obj,root)=>{
    if(obj.content){
        obj.tableOfContents = buildTableOfContnets(obj.content);
    }
    if(obj.section) {
        if(!Array.isArray(obj.section)) obj.section =[obj.section];   
        obj.subSections =  await Promise.all(obj.section.map(section=>processContent(sections,treatments,section,false)));
        if (root){
            const insertedTreatment=await treatments.insertOne(obj);
            return(insertedTreatment)
        } 
        else{
            const insertedSection=await sections.insertOne(obj);
            return insertedSection.insertedId;
        }
    }
    else{
        const insertedSection=await sections.insertOne({...obj,subSections: []});
        return insertedSection.insertedId;
    }
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

    //     description: OAB_1_DESC,
    //     type: 'main',
    //     text: OAB_1_TEXT

    // });
    // console.log(oab.ops[0]._id);
    // await enrollments.insertOne({user: new ObjectId("5cf5cabedac4b331a7f8511c"), treatment: new ObjectId(oab.ops[0]._id) });

    // const bph= await treatments.insertOne({
    //     name: 'Benign Prostatic Hyperplasia',
    //     description: BPH_1_DESC,
    //     type: 'main',
    //     text: BPH_1_TEXT

    // });
    // console.log(bph.ops[0]._id);
    // await enrollments.insertOne({user: new ObjectId("5cf5cabedac4b331a7f8511c"), treatment: new ObjectId(bph.ops[0]._id) });


   // console.log(OAB);
    
    // const converter = new showdown.Converter(),
    // html      = converter.makeMarkdown(OAB);
    

    // console.log(html);

    // console.log(JSON.parse(JSON.stringify(jsxObj))) ;
    // console.log( compiler(OAB));  
    
    //
    // const nameToLowerCase =name => name.toLowerCase(); 
    // let parsedOAB ={};    
    // parseString(OAB,
    //     {
    //         tagNameProcessors: [nameToLowerCase],
    //         strict: false,
    //         preserveChildrenOrder: true,
    //         trim: true,
    //         explicitArray: false,
    //     },
    //     (err,result)=>{
    //         if(err) console.log(err)
    //         else parsedOAB=result;
    //         //console.dir(result);
    //     }
    // );
     
    //console.log(buildTableOfContenets(parsedOAB.treatment.content));
    enrollments.remove({});
    treatments.remove({});
    sections.remove({});
    const parsedOAB=parse(OAB);
    const parsedBPH=parse(BPH);
    console.log('parsedBPH: ', parsedBPH);
    const oab= await processContent(sections,treatments,parsedOAB.treatment,true);
    await enrollments.insertOne({user: new ObjectId("5cf5cabedac4b331a7f8511c"), treatment: new ObjectId(oab.ops[0]._id) });
    const bph= await processContent(sections,treatments,parsedBPH.treatment,true);
    await enrollments.insertOne({user: new ObjectId("5cf5cabedac4b331a7f8511c"), treatment: new ObjectId(bph.ops[0]._id) });
    

    const parsedOAB1=parse(OAB);
    const parsedBPH1=parse(BPH);
    console.log('parsedBPH: ', parsedBPH);
    const oab1= await processContent(sections,treatments,parsedOAB1.treatment,true);
    await enrollments.insertOne({user: new ObjectId("5cf5cabedac4b331a7f8511c"), treatment: new ObjectId(oab1.ops[0]._id) });
    const bph1= await processContent(sections,treatments,parsedBPH1.treatment,true);
    await enrollments.insertOne({user: new ObjectId("5cf5cabedac4b331a7f8511c"), treatment: new ObjectId(bph1.ops[0]._id) });



    // const oab= await treatments.insertOne({
    //     name: parsedOAB.treatment.name,
    //     description: parsedOAB.treatment.description,
    //     type: 'main',
    //     content: parsedOAB.treatment.content,
    //     tableOfContents: parsedOAB.treatment.tableOfContents,
    //     section: parsedOAB.treatment.section,
    // });
    //console.dir(JSON.stringify(parsedOAB));


    // const myRe=/(#+)(.+)/g
    // //console.log(myRe.exec(OAB));
    // //console.log(OAB.match(/(#+)(.+)/g));
    // let result;
    // while ((result = myRe.exec(OAB)) !== null) {
    //     console.log(result[1]);
    //     console.log(result[2]);
        
    //   }

// console.log(myRe.exec(OAB));
// var re = /quick\s(brown).+?(jumps)/ig;
// var result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');
// console.log(result);
    
    //console.dir(parsedOAB);
    //if (parsedOAB.treatment.section ) console.dir(parsedOAB.treatment.section);
    // const jsxObj=compiler(OAB, {
    //     overrides: {
    //         h1: {
    //             component: 'Typography',
    //             props: {
    //                 variant: "h1"
    //             },
    //         },
    //     },
    // });
    // //console.log(jsxObj);
 
    // const oabDescIndex = jsxObj.props.children.findIndex(child=>child.type.toUpperCase()==='Description');
    // const oabDesc = jsxObj.props.children.splice(oabDescIndex,1);

    // console.log(oabDesc);


    // const oabNameIndex = jsxObj.props.children.findIndex(child=>child.type.toUpperCase()==='NAME');
    // const oabName = jsxObj.props.children.splice(oabNameIndex,1);
    // console.log(oabDesc[0].props.children);
    // console.log(serialize(oabDesc[0].props.children));
    // console.log(jsxObj.props.children);
    // console.log(serialize(jsxObj));

    
    
    
    //console.log(jsxObj);
    // console.log(jsxObj.props.children[1]);
    //console.log(jsxObj.props.children.filter(child=>child.type==='DESC' ));
    //const oabDescElelemnt=jsxObj.props.children.filter(child=>child.type==='DESC')     
    //const oabDesc=jsxObj.props.children.filter(child=>child.type==='DESC')[0].props.children;
    // const oabNameIndex = jsxObj.props.children.findIndex(child=>child.type.toUpperCase()==='NAME');
    // const oabName = jsxObj.props.children.splice(oabNameIndex,1);


    // const oabDescIndex = jsxObj.props.children.findIndex(child=>child.type.toUpperCase()==='DESC');
    // const oabDesc = jsxObj.props.children.splice(oabDescIndex,1);

    // console.log(oabDesc);

    // console.log(JSON.stringify(oabDesc[0].props.children));

    // enrollments.remove({});
    // treatments.remove({});

    // const oab= await treatments.insertOne({
    //     name: 'Overactive Bladder',
    //     description: JSON.stringify(oabDesc,convert),
    //     type: 'main',
    //     text: JSON.stringify(jsxObj)
    // });
    // await enrollments.insertOne({user: new ObjectId("5cf5cabedac4b331a7f8511c"), treatment: new ObjectId(oab.ops[0]._id) });
    // console.log(oabDesc);
    // const oabTableOfContents=jsxObj.props.children.filter(child=>child.type.charAt(0)==='h');
    // console.log(oabTableOfContents);



    // const triverse= (obj) => {
    //     console.log(obj.type);
    //     console.log(obj.type);
    //     console.log(obj.props.children);

    //     if(obj.props.children.length>1){
    //         obj.props.children.map(child => {if (typeof child ===object) triverse(child)});
    //     }
    //     else if(obj.type.charAt(0)==='h') {
    //         console.log('in triver recu end');
    //         console.log(obj);
    //         const entry = {
    //             level: parseInt(obj.type.substr(1)),
    //             content: obj.props.children[0],
    //         }
    //         tableOfContents.push(entry);
    //     }
    // }
    // triverse(jsxObj);
    // console.log(tableOfContents);


 
// renderer.heading = function (text, level) {
//     console.log(typeof text);
//     console.log( text);
    
//   //var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
 
//   return '<h' + level + '><a name="' +
//                 //escapedText +
//                  '" class="anchor" href="#' +
//                  //escapedText +
//                  '"><span class="header-link"></span></a>' +
//                   text + '</h' + level + '>';
// },
 
// console.log(marked('# heading+', { renderer: renderer }));
//console.log(OAB.split('</DESC>'))

    
 


});
