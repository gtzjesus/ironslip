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
    defineField({
      name: 'variants',
      title: 'leg variants (max 5)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'variant name' },
            { name: 'target', type: 'string', title: 'target description' },
            { 
              name: 'reward', 
              type: 'number', 
              title: 'base reward' 
            },
            // Aquí movemos la verificación a la variante
            { 
              name: 'verificationMethod', 
              type: 'string', 
              title: 'verification method',
              initialValue: 'video',
              options: { list: [{title: 'video', value: 'video'}, {title: 'photo', value: 'photo'}] }
            },
            { name: 'aiPrompt', type: 'text', title: 'AI prompt', rows: 2 },
            // Configuración Demon integrada en la variante
            { name: 'isDemonSupported', type: 'boolean', title: 'allow demon mode?', initialValue: false },
            { name: 'demonMultiplier', type: 'number', title: 'demon reward multiplier', initialValue: 1.5, description: 'Ej: 1.5 significa 50% extra' },
          ],
        }),
      ],
      validation: (Rule) => Rule.max(5),
    }),
  ],
});