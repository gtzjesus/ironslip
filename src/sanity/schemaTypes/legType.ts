import { defineField, defineType, defineArrayMember } from 'sanity';

export const legType = defineType({
  name: 'leg',
  title: 'iron legs',
  type: 'document',
  fields: [
    defineField({ name: 'task', title: 'task name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'animationKey', title: 'avatar animation key', type: 'string', validation: (Rule) => Rule.required() }),
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
              title: 'Base Odd / Payout Multiplier (e.g., 1.5x)',
              description: 'El multiplicador base que otorga esta variante en el slip normal.',
              validation: Rule => Rule.required().min(1.0).max(10.0),
              initialValue: 1.5
            },
            { name: 'reward', type: 'number', title: 'base credit reward' },
            { 
              name: 'demonMultiplier', 
              type: 'number', 
              title: 'Demon Mode Multiplier (e.g., 2.0x)',
              description: 'Multiplicador extra que se aplica cuando se activa el modo demonio en esta variante.',
              initialValue: 2.0,
              validation: Rule => Rule.required().min(1.0).max(10.0)
            },
            { name: 'isDemonSupported', type: 'boolean', title: 'Supports Demon Mode?', initialValue: false },
            { name: 'verificationMethod', type: 'string', initialValue: 'video', options: { list: ['video', 'photo'] } },
            { name: 'aiPrompt', type: 'text', rows: 2 },
          ],
        }),
      ],
      validation: (Rule) => Rule.max(5),
    }),
  ],
});