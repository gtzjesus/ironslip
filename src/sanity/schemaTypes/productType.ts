import { TrolleyIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const productType = defineType({
  name: 'product',
  title: 'Iron Gear',
  type: 'document',
  icon: TrolleyIcon,

  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      // Matches the logic we used in slipType for instant generation
      initialValue: (props) => {
        const name = props?.name || '';
        return {
          _type: 'slug',
          current: name.toLowerCase().replace(/\s+/g, '-'),
        };
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (Iron Credits)',
      type: 'number',
      description: 'How many credits this costs to redeem.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'category',
      title: 'Product Category',
      type: 'string',
      options: {
        list: [
          { title: '👕 Physical Gear', value: 'physical' },
          { title: '✨ Digital Skin', value: 'digital' },
          { title: '🧪 Supplements', value: 'supps' },
        ],
      },
    }),
    defineField({
      name: 'skinIdentifier',
      title: 'Digital Skin ID',
      type: 'string',
      description: 'The code that unlocks the avatar skin (e.g., "neon_glow")',
      // Only visible if it's actually a skin or gear to keep it clean
      hidden: ({ document }) =>
        document?.category !== 'digital' && document?.category !== 'physical',
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'stock',
      title: 'Stock Amount',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
  ],

  preview: {
    select: {
      title: 'name',
      price: 'price',
      media: 'image',
    },
    prepare({ title, price, media }) {
      return {
        title,
        subtitle: price ? `${price} Credits` : 'Price not set',
        media,
      };
    },
  },
});
