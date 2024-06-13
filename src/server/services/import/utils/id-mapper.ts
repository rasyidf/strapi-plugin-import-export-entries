import { SchemaUID } from "../../../types";

export class IdMapper {

    constructor(){}
  
    private mapping: {
      [slug in SchemaUID]?: Map<string | number, string | number>;
    } = {};
  
    public getMapping(slug: SchemaUID, fileId: string | number) {
      return this.mapping[slug]?.get(`${fileId}`);
    }
  
    public setMapping(slug: SchemaUID, fileId: string | number, dbId: string | number) {
      if (!this.mapping[slug]) {
        this.mapping[slug] = new Map<string | number, string | number>();
      }
  
      this.mapping[slug]!.set(`${fileId}`, dbId);
    }
}

