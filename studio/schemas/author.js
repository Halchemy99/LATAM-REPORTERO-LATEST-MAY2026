import { defineType, defineField } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'avatar',
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'avatar',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'title',
      title: 'Title / Role',
      type: 'string',
      placeholder: 'e.g. Investigative Reporter, Mexico City',
    }),
    defineField({
      name: 'location',
      title: 'Based In',
      type: 'string',
      placeholder: 'e.g. Mexico City, Mexico',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'specialties',
      title: 'Specialties / Beats',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      placeholder: 'e.g. Politics, Environment, Economy',
    }),

    // Verification & Trust
    defineField({
      name: 'isVerified',
      title: 'Verified Journalist',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'verificationLevel',
      title: 'Verification Level',
      type: 'string',
      options: {
        list: [
          { title: '⭐ Staff Reporter', value: 'staff' },
          { title: '✅ ID Verified', value: 'id-verified' },
          { title: '🎓 Expert Contributor', value: 'expert' },
          { title: '📝 Contributor', value: 'contributor' },
          { title: '📡 Stringer', value: 'stringer' },
        ],
      },
    }),
    defineField({
      name: 'pressCredentials',
      title: 'Press Credentials',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      placeholder: 'e.g. CPJ Member, FNPI Fellow',
    }),

    // Social Links
    defineField({
      name: 'twitter',
      title: 'X / Twitter',
      type: 'url',
      placeholder: 'https://x.com/username',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
      placeholder: 'https://instagram.com/username',
    }),
    defineField({
      name: 'tiktok',
      title: 'TikTok',
      type: 'url',
      placeholder: 'https://tiktok.com/@username',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
      placeholder: 'https://linkedin.com/in/username',
    }),
    defineField({
      name: 'youtube',
      title: 'YouTube',
      type: 'url',
      placeholder: 'https://youtube.com/@username',
    }),
    defineField({
      name: 'website',
      title: 'Personal Website',
      type: 'url',
    }),
    defineField({
      name: 'email',
      title: 'Secure Contact Email',
      type: 'string',
      placeholder: 'journalist@latamreportero.com',
    }),
  ],
})
