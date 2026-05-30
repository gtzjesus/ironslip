import { type SchemaTypeDefinition } from 'sanity';
// ⚡️ Agregamos las llaves para llamar exactamente a la constante legType
import { legType } from './legType'; 

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [legType],
};