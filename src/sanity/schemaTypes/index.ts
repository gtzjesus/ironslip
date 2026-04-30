import { type SchemaTypeDefinition } from 'sanity';
import { slipType } from './slipType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [slipType],
};
