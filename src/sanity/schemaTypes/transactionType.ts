import { BillIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const transactionType = defineType({
  name: 'ironTransaction',
  title: 'Iron Transactions',
  type: 'document',
  icon: BillIcon,
  fields: [
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'userProfile' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'number',
      description: 'Positive for earnings, negative for purchases.',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Slip Hit (Earning)', value: 'earning' },
          { title: 'Store Purchase (Spending)', value: 'spending' },
          { title: 'Admin Adjustment', value: 'adjustment' },
        ],
      },
    }),
    defineField({
      name: 'reference',
      title: 'Related Slip/Product',
      type: 'string',
      description: 'ID of the slip hit or product bought.',
    }),
  ],
});
