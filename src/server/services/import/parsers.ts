import csvtojson from 'csvtojson';
import { isArraySafe } from '../../../libs/arrays';
import { isObjectSafe } from '../../../libs/objects';
import { getModelAttributes, getModel } from '../../utils/models';
import { EnumValues } from '../../../types';
import { SchemaUID } from '../../types';
// const IdMapper = require('../import/import-v2/IdMapper');
// import { IdMapper } from '../import/import-v2';
import { IdMapper } from './utils/id-mapper';

// class IdMapper {

//   constructor(){}

//   private mapping: {
//     [slug in SchemaUID]?: Map<string | number, string | number>;
//   } = {};

//   public getMapping(slug: SchemaUID, fileId: string | number) {
//     return this.mapping[slug]?.get(`${fileId}`);
//   }

//   public setMapping(slug: SchemaUID, fileId: string | number, dbId: string | number) {
//     if (!this.mapping[slug]) {
//       this.mapping[slug] = new Map<string | number, string | number>();
//     }

//     this.mapping[slug]!.set(`${fileId}`, dbId);
//   }
// }

const headerMap = new IdMapper();
const inputFormatToParser = {
  csv: parseCsv,
  jso: parseJso,
  json: parseJson,
} as const;

const InputFormats = Object.keys(inputFormatToParser) as InputFormat[];

export { InputFormats, parseInputData };

module.exports = {
  InputFormats,
  parseInputData,
};

type InputFormat = keyof typeof inputFormatToParser;
type InputDataRaw = Parameters<EnumValues<typeof inputFormatToParser>>[0];

/**
 * Parse input data.
 */
async function parseInputData(format: InputFormat, dataRaw: InputDataRaw, { slug }: { slug: SchemaUID }) {
  const parser = inputFormatToParser[format];
  if (!parser) {
    throw new Error(`Data input format ${format} is not supported.`);
  }

  const data = await parser(dataRaw as any, { slug });
  return data;
}

async function parseCsv(dataRaw: string, { slug }: { slug: SchemaUID }) {
  let data = await csvtojson().fromString(dataRaw);
  const schema = getModel(slug);
  console.log("scheme: ", schema);

  if(schema?.pluginOptions?.['import-export-map']){
    schema?.pluginOptions?.['import-export-map']?.k_v_pairs?.forEach((entry: string) =>{
      const k_V_pair = entry.split("=");
      headerMap.setMapping(slug, k_V_pair[0], k_V_pair[1]);
      console.log('Slug: ', slug, "KV pairs: ", k_V_pair[0], k_V_pair[1]);
    });
  }


  const relationNames = getModelAttributes(slug, { filterType: ['component', 'dynamiczone', 'media', 'relation'] }).map((a) => a.name);
  data = data.map((datum) => {
    for (let name of relationNames) {
      try {
        datum[name] = JSON.parse(datum[name]);
      } catch (err) {
        strapi.log.error(err);
      }
    }
    return datum;
  });

  data = data.map((datum) => {
    for (let name of Object.keys(datum)) {
      try {
        let dname = headerMap.getMapping(slug, name);
        //console.log("dname: ", dname, "name: ", name, "datum: ", datum );
        if(dname != undefined && !relationNames.includes(name)){
          datum[dname] = datum[name];
        }
        
        let relations = schema?.pluginOptions?.['import-export-map']?.relations_id;
        if(relations && dname != undefined){
          if(Object.keys(relations).includes(dname.toString())){
            console.log("relations:", relations);
            datum[dname] = relations[dname][datum[name]];
          }
        }     
      } catch (err) {
        strapi.log.error(err);
      }
    }
    let skip_fields = schema?.pluginOptions?.['import-export-map']?.skip_field;
    let ok_to_return = true;
    if (skip_fields){
      skip_fields.forEach((field_name) => {
        if(!Object.keys(datum).includes(field_name) || datum[field_name] == undefined || datum[field_name].trim() == ""){
          ok_to_return = false;
        }
      });
    }
    if(!ok_to_return){
      datum = {}
    }
    return datum;
    
  });

  console.log("returned_data: ", data);
  return data;
}

async function parseJson(dataRaw: string) {
  let data = JSON.parse(dataRaw);
  return data;
}

async function parseJso(dataRaw: any[] | object) {
  if (!isObjectSafe(dataRaw) && !isArraySafe(dataRaw)) {
    throw new Error(`To import JSO, data must be an array or an object`);
  }

  return dataRaw;
}
