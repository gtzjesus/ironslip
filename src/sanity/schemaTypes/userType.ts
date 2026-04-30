import { UserIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const userType = defineType({
  name: 'userProfile',
  title: 'User Profiles',
  type: 'document',
  icon: UserIcon,

  fields: [
    defineField({
      name: 'username',
      title: 'Username',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'balance',
      title: 'Iron Credit Balance',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'inventory',
      title: 'Unlocked Gear (Skins)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'The digital gear this user owns.',
    }),
    defineField({
      name: 'equippedSkin',
      title: 'Currently Wearing',
      type: 'reference',
      to: [{ type: 'product' }],
      options: {
        // Advanced: only allow selecting products the user actually owns
        filter: ({ document }) => {
          return {
            filter: 'category == "digital" || category == "physical"',
          };
        },
      },
    }),
  ],

  preview: {
    select: {
      title: 'username',
      balance: 'balance',
    },
    prepare({ title, balance }) {
      return {
        title,
        subtitle: `💰 ${balance || 0} Credits`,
      };
    },
  },
});
