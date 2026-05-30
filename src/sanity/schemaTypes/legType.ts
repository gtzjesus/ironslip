import { defineField, defineType } from 'sanity';

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
      name: 'category',
      title: 'category',
      type: 'string',
      initialValue: 'lifting',
      options: {
        list: [{ title: '🏋️‍♂️ Lifting', value: 'lifting' }],
      },
      validation: (Rule) => Rule.required(),
    }),

    // 🟢 CONFIGURACIÓN REGULAR (PRINCIPIANTE / INTERMEDIO)
    defineField({
      name: 'regularTarget',
      title: 'regular target description',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'regularReward',
      title: 'regular credit reward',
      type: 'number',
      initialValue: 100,
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'regularAiPrompt',
      title: 'regular AI prompt',
      type: 'text',
      rows: 3,
      description: 'Instrucciones para la IA en modo normal.',
    }),

    // 👹 CONFIGURACIÓN DEMON (SÓLO PARA ELITE ATHLETES)
    defineField({
      name: 'demonTarget',
      title: '👹demon target description',
      type: 'string',
      description: 'Ej: "1RM @ 2x Bodyweight" o "AMRAP al fallo absoluto"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'demonReward',
      title: '👹 demon credit reward',
      type: 'number',
      initialValue: 350,
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'demonAiPrompt',
      title: '👹 demon AI prompt',
      type: 'text',
      rows: 3,
      description: 'Instrucciones despiadadas para la IA. Exige ver intensidad máxima.',
    }),

    // CONTROL GLOBAL
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