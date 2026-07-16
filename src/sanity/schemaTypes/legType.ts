import { defineField, defineType, defineArrayMember } from 'sanity';

export const legType = defineType({
  name: 'leg',
  title: 'iron legs',
  type: 'document',
  fields: [
    defineField({ name: 'task', title: 'task name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'category', title: 'category', type: 'string', options: { list: ['lifting', 'sports', 'cardio', 'calisthenics', 'outdoors', 'recovery'] } }),
    defineField({
      name: 'variants',
      title: 'leg variants',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'variant name' },
            { name: 'target', type: 'string', title: 'target description' },
            { 
              name: 'probabilityWeight', 
              type: 'number', 
              title: 'base probability weight (0.1 to 3.0)',
              validation: Rule => Rule.required().min(0.1).max(3.0)
            },
            { name: 'isDemonSupported', type: 'boolean', initialValue: false },
            { name: 'verificationMethod', type: 'string', initialValue: 'video', options: { list: ['video', 'photo'] } },
            { name: 'aiPrompt', type: 'text', rows: 2 },
          ],
        }),
      ],
      validation: (Rule) => Rule.max(5),
    }),
  ],
});