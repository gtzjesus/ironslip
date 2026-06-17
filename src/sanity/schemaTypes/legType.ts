import { defineField, defineType, defineArrayMember } from 'sanity';

export const legType = defineType({
  name: 'leg',
  title: 'iron legs',
  type: 'document',
  fields: [
    defineField({
      name: 'task',
      title: 'task name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'animationKey',
      title: 'animation key',
      type: 'string',
      initialValue: 'breathingidle',
    }),
    defineField({
      name: 'category',
      title: 'category',
      type: 'string',
      initialValue: 'lifting',
      options: {
        list: [
          { title: 'Lifting', value: 'lifting' },
          { title: 'Sports', value: 'sports' },
          { title: 'Cardio', value: 'cardio' },
          { title: 'Calisthenics', value: 'calisthenics' },
          { title: 'Outdoors', value: 'outdoors' },
          { title: 'Recovery', value: 'recovery' },
        ],
      },
    }),
    // AQUÍ ESTÁ EL CAMBIO: Las variantes
    defineField({
      name: 'variants',
      title: 'leg variants (max 5)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'variant name (ej: Cima, Fauna)' },
            { name: 'isDemon', type: 'boolean', title: 'is demon mode?', initialValue: false },
            { name: 'target', type: 'string', title: 'target description' },
            { name: 'reward', type: 'number', title: 'credit reward' },
            { name: 'aiPrompt', type: 'text', title: 'AI prompt', rows: 2 },
          ],
        }),
      ],
      validation: (Rule) => Rule.max(5).error('Puedes poner máximo 5 variantes.'),
    }),
    defineField({
      name: 'verificationMethod',
      title: 'verification method',
      type: 'string',
      initialValue: 'video',
      options: {
        list: [
          { title: 'video', value: 'video' },
          { title: 'photo', value: 'photo' },
        ],
      },
    }),
  ],
});