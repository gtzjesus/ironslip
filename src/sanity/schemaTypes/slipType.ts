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
  title: 'Iron Slips (Templates)',
  type: 'document',

  fields: [
    // 1. IDENTITY & GENERATION
    defineField({
      name: 'title',
      title: 'Slip Template Name',
      type: 'string',
      initialValue: () =>
        ironNames[Math.floor(Math.random() * ironNames.length)],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slipNumber',
      title: 'Slip Blueprint ID',
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
      initialValue: (props) => {
        const title = props?.title || '';
        return {
          _type: 'slug',
          current: title.toLowerCase().replace(/\s+/g, '-'),
        };
      },
      validation: (Rule) => Rule.required(),
    }),

    // 2. THE CORE PARLAY BUILDER
    defineField({
      name: 'legs',
      title: 'Parlay Legs (Requirements)',
      type: 'array',
      description: 'Link the specific workout or discipline challenges required for this slip.',
      of: [{ type: 'reference', to: [{ type: 'leg' }] }],
      validation: (Rule) =>
        Rule.min(1).error('A parlay blueprint must reference at least one leg.'),
    }),

    // 3. THE ECONOMY ENGINE (Global Rules)
    defineField({
      name: 'stakeAmount',
      title: 'Stake Amount (Cost to Play)',
      type: 'number',
      description: 'How many Iron Credits it costs a user to buy into this slip.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'creditValue',
      title: 'Payout Amount (Reward)',
      type: 'number',
      description: 'Total Iron Credits returned to the user if they hit all legs.',
      validation: (Rule) => Rule.required().min(0),
    }),

    // 4. UI STYLING ACCENTS (For Dark Mode Polish)
    defineField({
      name: 'cardVariant',
      title: 'UI Visual Variant',
      type: 'string',
      description: 'Determines the card styling, neon glows, or borders in Next.js.',
      options: {
        list: [
          { title: '⚡ Standard Cyberpunk (Amber/Black)', value: 'standard' },
          { title: '🔥 High Voltage (Neon Cyan/Blue)', value: 'voltage' },
          { title: '😈 Demon Core (Blood Red/Charked)', value: 'demon' },
        ],
      },
      initialValue: 'standard',
    }),
  ],

  // 5. STUDIO PREVIEW (Keep it clean & functional)
  preview: {
    select: {
      title: 'title',
      slipNumber: 'slipNumber',
      legs: 'legs',
      stake: 'stakeAmount',
      payout: 'creditValue',
    },
    prepare({ title, slipNumber, legs, stake, payout }) {
      const legsCount = legs ? legs.length : 0;
      return {
        title: `${title} (${slipNumber})`,
        subtitle: `⛓️ ${legsCount} Leg${legsCount === 1 ? '' : 's'} | Risk: ${stake} 🪙 | Win: ${payout} 🪙`,
      };
    },
  },
});