'use client';

import { useTranslation } from '@/lib/providers';
import {
  ParagraphBlock,
  HeadingBlock,
  SubheadingBlock,
  PullQuoteBlock,
  CalloutBoxBlock,
  FactBoxBlock,
  KeyTakeawaysBlock,
  ImageBlock,
  ImageGalleryBlock,
  VideoEmbedBlock,
  AudioClipBlock,
  PodcastEmbedBlock,
  ChartBlock,
  InfographicBlock,
  TimelineBlock,
  DataTableBlock,
  MapEmbedBlock,
  DividerBlock,
  SectionBreakBlock,
  TwoColumnBlock,
  HighlightSectionBlock,
  NewsletterSignupBlock,
  CallToActionBlock,
  RelatedArticlesBlock,
  SourcesListBlock
} from './blocks';

// Map block types to components
const BLOCK_COMPONENTS = {
  // Text Blocks
  paragraph: ParagraphBlock,
  heading: HeadingBlock,
  subheading: SubheadingBlock,
  pull_quote: PullQuoteBlock,
  callout_box: CalloutBoxBlock,
  fact_box: FactBoxBlock,
  key_takeaways: KeyTakeawaysBlock,
  
  // Media Blocks
  image: ImageBlock,
  image_gallery: ImageGalleryBlock,
  carousel: ImageGalleryBlock, // Uses same component with different layout
  video_embed: VideoEmbedBlock,
  audio_clip: AudioClipBlock,
  podcast_embed: PodcastEmbedBlock,
  
  // Visual / Data Blocks
  chart: ChartBlock,
  infographic: InfographicBlock,
  timeline: TimelineBlock,
  data_table: DataTableBlock,
  map_embed: MapEmbedBlock,
  
  // Layout Blocks
  divider: DividerBlock,
  section_break: SectionBreakBlock,
  two_column: TwoColumnBlock,
  highlight_section: HighlightSectionBlock,
  
  // Engagement Blocks
  newsletter_signup: NewsletterSignupBlock,
  call_to_action: CallToActionBlock,
  related_articles: RelatedArticlesBlock,
  sources_list: SourcesListBlock
};

/**
 * Renders a single content block
 */
export function BlockRenderer({ block, locale = 'en' }) {
  const Component = BLOCK_COMPONENTS[block.block_type];
  
  if (!Component) {
    console.warn(`Unknown block type: ${block.block_type}`);
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg my-4">
        <p className="text-amber-700 text-sm">Unknown block type: {block.block_type}</p>
      </div>
    );
  }
  
  return <Component content={block} locale={locale} />;
}

/**
 * Renders all content blocks for an article
 */
export function ArticleContent({ blocks = [], locale = 'en' }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No content available.</p>
      </div>
    );
  }
  
  return (
    <div className="article-content">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} locale={locale} />
      ))}
    </div>
  );
}

/**
 * Block type definitions for the editor
 */
export const BLOCK_TYPES = [
  {
    category: 'Text',
    blocks: [
      { type: 'paragraph', label: 'Paragraph', icon: 'AlignLeft' },
      { type: 'heading', label: 'Heading', icon: 'Heading' },
      { type: 'subheading', label: 'Subheading', icon: 'Type' },
      { type: 'pull_quote', label: 'Pull Quote', icon: 'Quote' },
      { type: 'callout_box', label: 'Callout Box', icon: 'AlertCircle' },
      { type: 'fact_box', label: 'Fact Box', icon: 'List' },
      { type: 'key_takeaways', label: 'Key Takeaways', icon: 'CheckSquare' }
    ]
  },
  {
    category: 'Media',
    blocks: [
      { type: 'image', label: 'Image', icon: 'Image' },
      { type: 'image_gallery', label: 'Image Gallery', icon: 'Images' },
      { type: 'video_embed', label: 'Video Embed', icon: 'Video' },
      { type: 'audio_clip', label: 'Audio Clip', icon: 'Headphones' },
      { type: 'podcast_embed', label: 'Podcast Embed', icon: 'Mic' }
    ]
  },
  {
    category: 'Data & Visuals',
    blocks: [
      { type: 'chart', label: 'Chart', icon: 'BarChart' },
      { type: 'infographic', label: 'Infographic', icon: 'PieChart' },
      { type: 'timeline', label: 'Timeline', icon: 'Clock' },
      { type: 'data_table', label: 'Data Table', icon: 'Table' },
      { type: 'map_embed', label: 'Map', icon: 'Map' }
    ]
  },
  {
    category: 'Layout',
    blocks: [
      { type: 'divider', label: 'Divider', icon: 'Minus' },
      { type: 'section_break', label: 'Section Break', icon: 'MoreHorizontal' },
      { type: 'two_column', label: 'Two Column', icon: 'Columns' },
      { type: 'highlight_section', label: 'Highlight Section', icon: 'Highlighter' }
    ]
  },
  {
    category: 'Engagement',
    blocks: [
      { type: 'newsletter_signup', label: 'Newsletter Signup', icon: 'Mail' },
      { type: 'call_to_action', label: 'Call to Action', icon: 'MousePointer' },
      { type: 'related_articles', label: 'Related Articles', icon: 'FileText' },
      { type: 'sources_list', label: 'Sources List', icon: 'Link' }
    ]
  }
];

/**
 * Get default content structure for a block type
 */
export function getDefaultBlockContent(blockType) {
  const defaults = {
    paragraph: { text: '' },
    heading: { text: '', level: 2 },
    subheading: { text: '' },
    pull_quote: { quote: '', attribution: '', title: '' },
    callout_box: { type: 'info', title: '', text: '' },
    fact_box: { title: 'Key Facts', facts: [''] },
    key_takeaways: { takeaways: [''] },
    image: { src: '', alt: '', caption: '', credit: '', width: 'full' },
    image_gallery: { images: [], layout: 'grid' },
    video_embed: { platform: 'youtube', videoId: '', caption: '' },
    audio_clip: { src: '', caption: '' },
    podcast_embed: { platform: 'spotify', episodeUrl: '' },
    chart: { title: '', imageUrl: '', caption: '' },
    infographic: { src: '', alt: '', caption: '' },
    timeline: { events: [{ date: '', title: '', description: '' }] },
    data_table: { headers: ['Column 1', 'Column 2'], rows: [['', '']], caption: '' },
    map_embed: { lat: '', lng: '', zoom: 15, caption: '' },
    divider: {},
    section_break: {},
    two_column: { leftContent: '', rightContent: '' },
    highlight_section: { title: '', text: '' },
    newsletter_signup: { title: 'Subscribe to our newsletter', description: '' },
    call_to_action: { title: '', description: '', buttonText: 'Learn More', buttonUrl: '', style: 'primary' },
    related_articles: { articles: [] },
    sources_list: { sources: [{ name: '', url: '' }] }
  };
  
  return defaults[blockType] || {};
}

export default BlockRenderer;
