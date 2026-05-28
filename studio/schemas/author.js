import { defineType, defineField } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'isVerified',
      title: 'Verified',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'verificationLevel',
      title: 'Verification Level',
      type: 'string',
      options: {
        list: [
          { title: 'Staff', value: 'staff' },
          { title: 'Contributor', value: 'contributor' },
          { title: 'Stringer', value: 'stringer' },
        ],
      },
    }),
  ],
})
