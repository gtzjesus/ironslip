import { defineField, defineType } from 'sanity';

export const legType = defineType({
  name: 'leg',
  title: 'Iron Legs',
  type: 'document',

  fields: [
    defineField({
      name: 'task',
      title: 'Task Name',
      type: 'string',
      description: 'e.g., Heavy Deadlifts, 5k Run, or Cold Plunge',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'task',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'weightRequirement',
      title: 'Weight/Intensity',
      type: 'string',
      description: 'e.g., 145lb, Bodyweight, or Max Effort',
    }),
    defineField({
      name: 'verificationMethod',
      title: 'Verification Method',
      type: 'string',
      options: {
        list: [
          { title: '🎥 Video Clip (Strict)', value: 'video' },
          { title: '📸 Photo Proof', value: 'photo' },
          { title: '⏱️ GPS/Timer Sync', value: 'gps' },
        ],
      },
      initialValue: 'video',
    }),
    defineField({
      name: 'creditReward',
      title: 'Credit Payout',
      type: 'number',
      description: 'How many Iron Credits is this leg worth?',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
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
    }),
    defineField({
      name: 'isDemon',
      title: 'Demon Leg? 😈',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'task',
      reps: 'reps',
      isDemon: 'isDemon',
    },
    prepare({ title, reps, isDemon }) {
      return {
        title: `${isDemon ? '👹 ' : ''}${title}`,
        subtitle: reps || 'No reps specified',
      };
    },
  },
});
