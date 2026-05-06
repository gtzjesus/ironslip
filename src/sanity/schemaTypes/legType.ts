import { defineField, defineType } from 'sanity';

export const legType = defineType({
  name: 'leg',
  title: 'Iron Legs',
  type: 'document',

  fields: [
    // 1. BASIC IDENTITY
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

    // 2. THE REQUIREMENT (The Law)
    defineField({
      name: 'requirementValue',
      title: 'Requirement Value',
      type: 'string',
      description: 'The number (e.g., 145, 5, 10k)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requirementUnit',
      title: 'Unit/Label',
      type: 'string',
      description: 'e.g., Lbs, Miles, Steps, Reps',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Iron (Strength)', value: 'iron' },
          { title: 'Cardio (Move)', value: 'cardio' },
          { title: 'Lifestyle (Discipline)', value: 'lifestyle' },
          { title: 'Wildcard (Sport)', value: 'wildcard' },
        ],
      },
    }),

    // 3. THE STAKES (Gambling Logic)
    defineField({
      name: 'creditReward',
      title: 'Credit Payout',
      type: 'number',
      description: 'Payout upon successful verification.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'burnPenalty',
      title: 'Burn Penalty (Optional)',
      type: 'number',
      description: 'Credits LOST if the leg is busted. High stakes.',
    }),
    defineField({
      name: 'difficulty',
      title: 'Tier',
      type: 'string',
      options: {
        list: [
          { title: 'Recruit (Easy)', value: 'recruit' },
          { title: 'Vanguard (Mid)', value: 'vanguard' },
          { title: 'Elite (Hard)', value: 'elite' },
          { title: 'Demon (Impossible)', value: 'demon' },
        ],
      },
    }),

    // 4. THE CLOCK
    defineField({
      name: 'isDemon',
      title: 'Demon Leg? 😈',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'timeLimit',
      title: 'Time Limit (Hours)',
      type: 'number',
      description: 'Standard: 24. Demon: 12 or less.',
      initialValue: 24,
    }),

    // 5. VERIFICATION & AI
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
      name: 'motionKey',
      title: 'AI Motion Key',
      type: 'string',
      description: 'Backend tag for AI analysis (e.g., "hinge", "gait").',
    }),

    // 6. VISUALS & ANIMATION
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
      name: 'referenceImage',
      title: 'Instructional Image',
      type: 'image',
      description: 'Help the user see how to perform the leg.',
      options: { hotspot: true },
    }),
  ],

  // 7. STUDIO PREVIEW (Keep it clean)
  preview: {
    select: {
      title: 'task',
      value: 'requirementValue',
      unit: 'requirementUnit',
      isDemon: 'isDemon',
      reward: 'creditReward',
    },
    prepare({ title, value, unit, isDemon, reward }) {
      return {
        title: `${isDemon ? '👹 ' : '⚙️ '}${title}`,
        subtitle: `${value} ${unit} | +${reward} Credits`,
      };
    },
  },
});
