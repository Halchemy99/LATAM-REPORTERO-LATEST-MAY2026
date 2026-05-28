import { defineType, defineField } from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Spanish', value: 'es' },
          { title: 'Portuguese', value: 'pt' },
        ],
        layout: 'radio',
      },
      initialValue: 'en',
    }),
    defineField({
      name: 'standfirst',
      title: 'Standfirst (summary)',
      type: 'text',
      rows: 3,
      description: 'One or two sentences summarising the story. Shown on article cards.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
        {
          type: 'object',
          name: 'videoEmbed',
          title: 'Video (YouTube / Vimeo)',
          fields: [
            {
              name: 'url',
              title: 'Video URL',
              type: 'url',
              description: 'Paste a YouTube or Vimeo URL',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
          preview: {
            select: { title: 'url' },
            prepare({ title }) {
              return { title: '▶ Video', subtitle: title }
            },
          },
        },
        {
          type: 'object',
          name: 'chartEmbed',
          title: 'Chart (Datawrapper / Flourish / any iframe)',
          fields: [
            {
              name: 'embedCode',
              title: 'Embed code or iframe URL',
              type: 'text',
              rows: 4,
              description: 'Paste the full <iframe> embed code from Datawrapper, Flourish, etc.',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
          preview: {
            select: { title: 'caption' },
            prepare({ title }) {
              return { title: '📊 Chart', subtitle: title || 'No caption' }
            },
          },
        },
        {
          type: 'object',
          name: 'pullQuote',
          title: 'Pull Quote',
          fields: [
            {
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 3,
            },
            {
              name: 'attribution',
              title: 'Attribution (who said it)',
              type: 'string',
            },
          ],
          preview: {
            select: { title: 'quote' },
            prepare({ title }) {
              return { title: '❝ Pull Quote', subtitle: title }
            },
          },
        },
        {
          type: 'object',
          name: 'imageCarousel',
          title: 'Image Carousel / Gallery',
          fields: [
            {
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
                    { name: 'caption', title: 'Caption', type: 'string' },
                    { name: 'credit', title: 'Photo credit', type: 'string' },
                  ],
                  preview: {
                    select: { media: 'image', title: 'caption' },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'images' },
            prepare({ title }) {
              const count = Array.isArray(title) ? title.length : 0
              return { title: `🖼 Carousel (${count} images)` }
            },
          },
        },
        {
          type: 'object',
          name: 'tweetEmbed',
          title: 'Tweet / X Post',
          fields: [
            {
              name: 'url',
              title: 'Tweet URL',
              type: 'url',
              description: 'e.g. https://x.com/user/status/123456789',
            },
          ],
          preview: {
            select: { title: 'url' },
            prepare({ title }) {
              return { title: '𝕏 Tweet', subtitle: title }
            },
          },
        },
        {
          type: 'object',
          name: 'keyFactsBox',
          title: 'Key Facts Box',
          fields: [
            {
              name: 'heading',
              title: 'Heading',
              type: 'string',
              initialValue: 'What you need to know',
            },
            {
              name: 'facts',
              title: 'Facts',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Each item becomes a bullet point',
            },
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: '📋 Key Facts: ' + title }
            },
          },
        },
        {
          type: 'object',
          name: 'documentEmbed',
          title: 'Document / Official Source',
          fields: [
            {
              name: 'title',
              title: 'Document title',
              type: 'string',
            },
            {
              name: 'file',
              title: 'Upload PDF',
              type: 'file',
            },
            {
              name: 'sourceUrl',
              title: 'Or link to source URL',
              type: 'url',
              description: 'If the document is hosted externally',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
            },
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }) {
              return { title: '📄 Document: ' + (title || 'Untitled') }
            },
          },
        },
        {
          type: 'object',
          name: 'notebookLM',
          title: 'NotebookLM Audio Overview',
          fields: [
            {
              name: 'embedUrl',
              title: 'NotebookLM Share URL',
              type: 'url',
              description: 'In NotebookLM: Audio Overview → Share → copy the link',
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              initialValue: 'Listen: AI Audio Overview',
            },
            {
              name: 'description',
              title: 'Description (optional)',
              type: 'string',
              description: 'e.g. "An AI-generated audio summary of this story"',
            },
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }) {
              return { title: '🎙 NotebookLM: ' + (title || 'Audio Overview') }
            },
          },
        },
        {
          type: 'object',
          name: 'audioEmbed',
          title: 'Podcast / Audio',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Spotify', value: 'spotify' },
                  { title: 'Apple Podcasts', value: 'apple' },
                  { title: 'SoundCloud', value: 'soundcloud' },
                  { title: 'Anchor / Spotify for Podcasters', value: 'anchor' },
                  { title: 'Direct audio file', value: 'direct' },
                  { title: 'Other (iframe embed)', value: 'other' },
                ],
                layout: 'radio',
              },
            },
            {
              name: 'embedCode',
              title: 'Embed code or URL',
              type: 'text',
              rows: 3,
              description: 'Paste the <iframe> embed code from Spotify/SoundCloud, or a direct .mp3 URL',
            },
            {
              name: 'title',
              title: 'Episode title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description (optional)',
              type: 'string',
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'platform' },
            prepare({ title, subtitle }) {
              return { title: '🎧 Audio: ' + (title || 'Untitled'), subtitle }
            },
          },
        },
        {
          type: 'object',
          name: 'mapEmbed',
          title: 'Map (Google Maps / Earth / any)',
          fields: [
            {
              name: 'embedCode',
              title: 'Embed code or iframe URL',
              type: 'text',
              rows: 4,
              description: 'Google Maps: Share → Embed a map → copy <iframe>. Google Earth: File → Share → Embed.',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'e.g. "Locations of reported incidents in Guerrero state"',
            },
            {
              name: 'height',
              title: 'Height (px)',
              type: 'number',
              initialValue: 450,
              description: 'How tall the map appears on the page',
            },
          ],
          preview: {
            select: { title: 'caption' },
            prepare({ title }) {
              return { title: '🗺 Map', subtitle: title || 'No caption' }
            },
          },
        },
        {
          type: 'object',
          name: 'relatedArticles',
          title: 'Related Articles',
          fields: [
            {
              name: 'heading',
              title: 'Section heading',
              type: 'string',
              initialValue: 'Read more',
            },
            {
              name: 'articles',
              title: 'Articles',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'article' }] }],
              validation: Rule => Rule.max(4),
              description: 'Pick up to 4 related stories',
            },
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: '🔗 Related: ' + (title || 'Read more') }
            },
          },
        },
        {
          type: 'object',
          name: 'correctionNotice',
          title: 'Correction / Editor\'s Note',
          fields: [
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Correction', value: 'correction' },
                  { title: "Editor's Note", value: 'editors-note' },
                  { title: 'Update', value: 'update' },
                ],
                layout: 'radio',
              },
              initialValue: 'correction',
            },
            {
              name: 'text',
              title: 'Text',
              type: 'text',
              rows: 3,
            },
          ],
          preview: {
            select: { title: 'type', subtitle: 'text' },
            prepare({ title, subtitle }) {
              return { title: '⚠ ' + (title || 'Correction'), subtitle }
            },
          },
        },
        {
          type: 'object',
          name: 'instagramEmbed',
          title: 'Instagram Post',
          fields: [
            {
              name: 'url',
              title: 'Instagram Post URL',
              type: 'url',
              description: 'e.g. https://www.instagram.com/p/ABC123/',
            },
            {
              name: 'caption',
              title: 'Caption (optional)',
              type: 'string',
            },
          ],
          preview: {
            select: { title: 'url' },
            prepare({ title }) {
              return { title: '📸 Instagram', subtitle: title }
            },
          },
        },
        {
          type: 'object',
          name: 'tiktokEmbed',
          title: 'TikTok / YouTube Short',
          fields: [
            {
              name: 'url',
              title: 'TikTok or YouTube Shorts URL',
              type: 'url',
              description: 'e.g. https://www.tiktok.com/@user/video/123 or https://youtube.com/shorts/ABC',
            },
            {
              name: 'caption',
              title: 'Caption (optional)',
              type: 'string',
            },
          ],
          preview: {
            select: { title: 'url' },
            prepare({ title }) {
              return { title: '🎵 TikTok / Short', subtitle: title }
            },
          },
        },
        {
          type: 'object',
          name: 'substackLink',
          title: 'Substack Post Link',
          fields: [
            {
              name: 'url',
              title: 'Substack Post URL',
              type: 'url',
              description: 'e.g. https://example.substack.com/p/post-title',
            },
            {
              name: 'headline',
              title: 'Headline',
              type: 'string',
              description: 'Title of the Substack post',
            },
            {
              name: 'description',
              title: 'Description (optional)',
              type: 'string',
            },
          ],
          preview: {
            select: { title: 'headline', subtitle: 'url' },
            prepare({ title, subtitle }) {
              return { title: '📧 Substack: ' + (title || 'Untitled'), subtitle }
            },
          },
        },
        {
          type: 'object',
          name: 'newsletterCta',
          title: 'Newsletter Signup (inline CTA)',
          fields: [
            {
              name: 'heading',
              title: 'Heading',
              type: 'string',
              initialValue: 'Get LATAM news before your coffee.',
            },
            {
              name: 'subtext',
              title: 'Subtext',
              type: 'string',
              initialValue: 'Free daily brief. No spam. Cancel anytime.',
            },
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: '✉ Newsletter CTA', subtitle: title }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Politics', value: 'politics' },
          { title: 'Economy', value: 'economy' },
          { title: 'Security', value: 'security' },
          { title: 'Environment', value: 'environment' },
          { title: 'Human Rights', value: 'human-rights' },
          { title: 'Culture', value: 'culture' },
          { title: 'Migration', value: 'migration' },
          { title: 'Technology', value: 'technology' },
        ],
      },
    }),
    defineField({
      name: 'region',
      title: 'Region / Country',
      type: 'string',
      description: 'e.g. mexico, brazil, colombia, argentina',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'isAiGenerated',
      title: 'AI Assisted',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'aiDisclosure',
      title: 'AI Disclosure (optional)',
      type: 'string',
      description: 'e.g. "AI-assisted translation" or "AI-summarised from wire reports"',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
    }),
    defineField({
      name: 'sourceFeed',
      title: 'Source Feed',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'status',
      media: 'featuredImage',
    },
  },
})
