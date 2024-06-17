"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInputData = exports.InputFormats = void 0;
const csvtojson_1 = __importDefault(require("csvtojson"));
const arrays_1 = require("../../../libs/arrays");
const objects_1 = require("../../../libs/objects");
const models_1 = require("../../utils/models");
// const IdMapper = require('../import/import-v2/IdMapper');
// import { IdMapper } from '../import/import-v2';
const id_mapper_1 = require("./utils/id-mapper");
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
const headerMap = new id_mapper_1.IdMapper();
const inputFormatToParser = {
    csv: parseCsv,
    jso: parseJso,
    json: parseJson,
};
const InputFormats = Object.keys(inputFormatToParser);
exports.InputFormats = InputFormats;
module.exports = {
    InputFormats,
    parseInputData,
};
/**
 * Parse input data.
 */
function parseInputData(format, dataRaw, { slug }) {
    return __awaiter(this, void 0, void 0, function* () {
        const parser = inputFormatToParser[format];
        if (!parser) {
            throw new Error(`Data input format ${format} is not supported.`);
        }
        const data = yield parser(dataRaw, { slug });
        return data;
    });
}
exports.parseInputData = parseInputData;
function parseCsv(dataRaw, { slug }) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield (0, csvtojson_1.default)().fromString(dataRaw);
        const schema = (0, models_1.getModel)(slug);
        console.log("scheme: ", schema);
        if ((_a = schema === null || schema === void 0 ? void 0 : schema.pluginOptions) === null || _a === void 0 ? void 0 : _a['import-export-map']) {
            (_d = (_c = (_b = schema === null || schema === void 0 ? void 0 : schema.pluginOptions) === null || _b === void 0 ? void 0 : _b['import-export-map']) === null || _c === void 0 ? void 0 : _c.k_v_pairs) === null || _d === void 0 ? void 0 : _d.forEach((entry) => {
                const k_V_pair = entry.split("=");
                headerMap.setMapping(slug, k_V_pair[0], k_V_pair[1]);
                console.log('Slug: ', slug, "KV pairs: ", k_V_pair[0], k_V_pair[1]);
            });
        }
        const relationNames = (0, models_1.getModelAttributes)(slug, { filterType: ['component', 'dynamiczone', 'media', 'relation'] }).map((a) => a.name);
        data = data.map((datum) => {
            for (let name of relationNames) {
                try {
                    datum[name] = JSON.parse(datum[name]);
                }
                catch (err) {
                    strapi.log.error(err);
                }
            }
            return datum;
        });
        data = data.map((datum) => {
            var _a, _b;
            for (let name of Object.keys(datum)) {
                try {
                    let dname = headerMap.getMapping(slug, name);
                    //console.log("dname: ", dname, "name: ", name, "datum: ", datum );
                    if (dname != undefined && !relationNames.includes(name)) {
                        datum[dname] = datum[name];
                    }
                    let relations = (_b = (_a = schema === null || schema === void 0 ? void 0 : schema.pluginOptions) === null || _a === void 0 ? void 0 : _a['import-export-map']) === null || _b === void 0 ? void 0 : _b.relations_id;
                    if (relations && dname != undefined) {
                        if (Object.keys(relations).includes(dname.toString())) {
                            console.log("relations:", relations);
                            datum[dname] = relations[dname][datum[name]];
                        }
                    }
                }
                catch (err) {
                    strapi.log.error(err);
                }
            }
            return datum;
        });
        console.log("returned_data: ", data);
        return data.filter(function (datum) {
            var _a, _b;
            let skip_fields = (_b = (_a = schema === null || schema === void 0 ? void 0 : schema.pluginOptions) === null || _a === void 0 ? void 0 : _a['import-export-map']) === null || _b === void 0 ? void 0 : _b.skip_field;
            //let ok_to_return = true;
            if (skip_fields) {
                skip_fields.forEach((field_name) => {
                    if (!Object.keys(datum).includes(field_name) || datum[field_name] == undefined || datum[field_name].trim() == "") {
                        return false;
                    }
                });
            }
            return true;
        });
    });
}
function parseJson(dataRaw) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = JSON.parse(dataRaw);
        return data;
    });
}
function parseJso(dataRaw) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, objects_1.isObjectSafe)(dataRaw) && !(0, arrays_1.isArraySafe)(dataRaw)) {
            throw new Error(`To import JSO, data must be an array or an object`);
        }
        return dataRaw;
    });
}
