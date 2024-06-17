import {
  AttributeType,
  ComponentSchema as StrapiComponentSchema,
  SingleTypeSchema as StrapiSingleTypeSchema,
  CollectionTypeSchema as StrapiCollectionTypeSchema,
  ComponentAttribute as StrapiComponentAttribute,
  ComponentValue as StrapiComponentValue,
  DynamicZoneAttribute as StrapiDynamicZoneAttribute,
  DynamicZoneValue as StrapiDynamicZoneValue,
  MediaAttribute as StrapiMediaAttribute,
  MediaValue as StrapiMediaValue,
  RelationAttribute as StrapiRelationAttribute,
  RelationValue as StrapiRelationValue,
} from '@strapi/strapi';

export type {
  Attribute,
  AttributeType,
  CollectionTypeSchema,
  ComponentAttribute,
  ComponentEntry,
  ComponentSchema,
  DynamicZoneAttribute,
  DynamicZoneEntry,
  Entry,
  EntryId,
  MediaAttribute,
  MediaEntry,
  RelationAttribute,
  RelationEntry,
  Schema,
  SchemaUID,
  SingleTypeSchema,
  User,
};

type SchemaUID = 'plugin::upload.file' | string;

type User = any;

type BaseAttribute = { name: string };
type Attribute = ComponentAttribute | DynamicZoneAttribute | MediaAttribute | RelationAttribute;
type ComponentAttribute = BaseAttribute & (StrapiComponentAttribute<any, true> | StrapiComponentAttribute<any, false>);
type DynamicZoneAttribute = BaseAttribute & StrapiDynamicZoneAttribute;
type MediaAttribute = BaseAttribute & StrapiMediaAttribute<'audios' | 'files' | 'images' | 'videos'>;
type RelationAttribute = BaseAttribute &
  (StrapiRelationAttribute<any, 'oneToOne'> | StrapiRelationAttribute<any, 'oneToMany'> | StrapiRelationAttribute<any, 'manyToOne'> | StrapiRelationAttribute<any, 'manyToMany'>);
// TODO: handle polymorphic relations
// | StrapiRelationAttribute<any, 'morphOne'>
// | StrapiRelationAttribute<any, 'morphMany'>
// | StrapiRelationAttribute<any, 'morphToOne'>
// | StrapiRelationAttribute<any, 'morphToMany'>

// Media are not included in type because equals any atm.
type Entry = ComponentEntry | DynamicZoneEntry | RelationEntry;
type ComponentEntry = (WithI18n<StrapiComponentValue<any, true>> & EntryBase) | (WithI18n<StrapiComponentValue<any, false>> & EntryBase);
type DynamicZoneEntry = WithI18n<UnwrapArray<StrapiDynamicZoneValue<[any]>>> & EntryBase;
type MediaEntry = StrapiMediaValue;
type RelationEntry =
  | (WithI18n<StrapiRelationValue<'oneToOne', any>> & EntryBase)
  | (WithI18n<StrapiRelationValue<'oneToMany', any>> & EntryBase)
  | (WithI18n<StrapiRelationValue<'manyToOne', any>> & EntryBase)
  | (WithI18n<StrapiRelationValue<'manyToMany', any>> & EntryBase);
// TODO: handle polymorphic relations
// | (WithI18n<StrapiRelationValue<'morphOne', any>> & EntryBase)
// | (WithI18n<StrapiRelationValue<'morphMany', any>> & EntryBase)
// | (WithI18n<StrapiRelationValue<'morphToOne', any>> & EntryBase)
// | (WithI18n<StrapiRelationValue<'morphToMany', any>> & EntryBase);
type EntryBase = { id: EntryId };
type EntryId = number | string;
type WithI18n<T> = UnwrapArray<T> & {
  localizations?: UnwrapArray<T>[];
  locale?: string;
};
type UnwrapArray<T> = T extends Array<infer U> ? U : T;

type Schema = CollectionTypeSchema | SingleTypeSchema | ComponentSchema;
type CollectionTypeSchema = StrapiCollectionTypeSchema & SchemaPluginOptions;
type SingleTypeSchema = StrapiSingleTypeSchema & SchemaPluginOptions;
type ComponentSchema = StrapiComponentSchema & { uid: SchemaUID } & SchemaPluginOptions;
type RelationsId = {
  [key:string]:Record<string,string | number>
}
type SchemaPluginOptions = {
  pluginOptions?: {
    'content-manager'?: {
      visible?: boolean;
    };
    'content-type-builder'?: {
      visible?: boolean;
    };
    i18n?: {
      localized?: true;
    };
    'import-export-entries-zg'?: {
      idField?: string;
    };
    //custom csv mapping if using different table headers than the columns in the database 
    'import-export-map'?: {
      //Establish map from CSV table headers to Strapi object fields, listing the Strapi object field name first followed by table header 
      //ie. ["item_number=Stock #", "asking_price=Price Internet"]
      k_v_pairs?: Array<string>;
      skip_field?: Array<string>;
      //If you are importing mapped entries that include RelationName of relations and you need to convert the CSV value to a relationship id
      //Identify the relationship field name as the Key followed by a dictionary of the CSV values as keys and the relationship ids as the values
      //ie. {"status":{"TRUE":3, "FALSE":4}}
      relations_id?: RelationsId;
    };
  };
};
