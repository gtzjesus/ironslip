import { defineField, defineType } from 'sanity';

const ironNames = [
  'Iron Work',
  'Iron Demon',
  'Iron Pulse',
  'Iron Grip',
  'Iron Vault',
  'Iron Fuel',
  'Iron Forge',
  'Iron Circuit',
  'Iron Will',
  'Iron Slip',
];

export const slipType = defineType({
  name: 'slip',
  title: 'Iron Slips',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Slip Name',
      type: 'string',
      initialValue: () =>
        ironNames[Math.floor(Math.random() * ironNames.length)],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slipNumber',
      title: 'Slip ID / Number',
      type: 'string',
      initialValue: () => `SLIP-${Math.floor(1000 + Math.random() * 9000)}`,
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      // This ensures that when the random title is picked,
      // the slug is also ready to go immediately.
      initialValue: (props) => {
        const title = props?.title || '';
        return {
          _type: 'slug',
          current: title.toLowerCase().replace(/\s+/g, '-'),
        };
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'legs',
      title: 'Parlay Legs (Requirements)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'leg',
          fields: [
            {
              name: 'task',
              title: 'Task',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            { name: 'reps', title: 'Reps/Set or Duration', type: 'string' },
            {
              name: 'avatarAction',
              title: 'Avatar Animation',
              type: 'string',
              options: {
                list: [
                  { title: '🏃 Running', value: 'running' },
                  { title: '🏊 Swimming', value: 'swimming' },
                  { title: '🏋️ Lifting', value: 'lifting' },
                  { title: '🧘 Mobility', value: 'mobility' },
                  { title: '👹 Demon Mode', value: 'demon' },
                ],
              },
            },
            {
              name: 'isDemon',
              title: 'Demon Leg? 😈',
              type: 'boolean',
              initialValue: false,
            },
          ],
        },
      ],
      validation: (Rule) =>
        Rule.min(1).error('A parlay must have at least one leg.'),
    }),

    defineField({
      name: 'stakeAmount',
      title: 'Stake (Risk)',
      type: 'number',
      description: 'How many Iron Credits it costs to "play" this slip.',
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: 'creditValue',
      title: 'Payout (Reward)',
      type: 'number',
      description: 'Total Iron Credits earned if the user hits the slip.',
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Open / Active', value: 'active' },
          { title: 'Hit (Completed)', value: 'hit' },
          { title: 'Missed', value: 'missed' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      slipNumber: 'slipNumber',
      status: 'status',
    },
    prepare({ title, slipNumber, status }) {
      const statusEmoji =
        status === 'hit' ? '✅' : status === 'missed' ? '❌' : '🔥';
      return {
        title: `${title} (${slipNumber})`,
        subtitle: `${statusEmoji} STATUS: ${status?.toUpperCase() || 'ACTIVE'}`,
      };
    },
  },
});
