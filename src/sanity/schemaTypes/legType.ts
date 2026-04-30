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
      name: 'reps',
      title: 'Default Reps/Duration',
      type: 'string',
      description: 'The standard requirement (e.g., 5x5 or 30 mins)',
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
