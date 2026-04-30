import { type SchemaTypeDefinition } from 'sanity';
import { slipType } from './slipType';
import { legType } from './legType';
import { userType } from './userType';
import { productType } from './productType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [userType, slipType, legType, productType],
};
