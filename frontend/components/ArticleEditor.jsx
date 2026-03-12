'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading2, 
  Heading3,
  Image as ImageIcon,
  Youtube,
  Music,
  Link as LinkIcon,
  Clock,
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Code,
  FileText,
  Video
} from 'lucide-react';

// Block types for the CMS
const BLOCK_TYPES = {
  PARAGRAPH: 'paragraph',
  HEADING: 'heading',
  QUOTE: 'quote',
  IMAGE: 'image',
  GALLERY: 'gallery',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  TIMELINE: 'timeline',
  EXPANDABLE: 'expandable',
  DIVIDER: 'divider',
  LIST: 'list',
  EMBED: 'embed'
};

/**
 * ArticleEditor - Notion/Ghost-like flexible CMS for journalism
 */
export default function ArticleEditor({ 
  initialBlocks = [], 
  onChange, 
  readOnly = false 
}) {
  const [blocks, setBlocks] = useState(initialBlocks.length > 0 ? initialBlocks : [
    { id: '1', type: BLOCK_TYPES.PARAGRAPH, content: '' }
  ]);
  const [activeBlock, setActiveBlock] = useState(null);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const menuRef = useRef(null);

  const updateBlock = useCallback((id, updates) => {
    setBlocks(prev => {
      const newBlocks = prev.map(block => 
        block.id === id ? { ...block, ...updates } : block
      );
      onChange?.(newBlocks);
      return newBlocks;
    });
  }, [onChange]);

  const addBlock = useCallback((type, afterId = null) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      ...(type === BLOCK_TYPES.TIMELINE ? { items: [] } : {}),
      ...(type === BLOCK_TYPES.GALLERY ? { images: [] } : {}),
      ...(type === BLOCK_TYPES.LIST ? { items: [''], ordered: false } : {}),
    };

    setBlocks(prev => {
      let newBlocks;
      if (afterId) {
        const index = prev.findIndex(b => b.id === afterId);
        newBlocks = [...prev.slice(0, index + 1), newBlock, ...prev.slice(index + 1)];
      } else {
        newBlocks = [...prev, newBlock];
      }
      onChange?.(newBlocks);
      return newBlocks;
    });
    setShowBlockMenu(false);
    setActiveBlock(newBlock.id);
  }, [onChange]);

  const removeBlock = useCallback((id) => {
    setBlocks(prev => {
      const newBlocks = prev.filter(b => b.id !== id);
      onChange?.(newBlocks);
      return newBlocks;
    });
  }, [onChange]);

  const moveBlock = useCallback((id, direction) => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === prev.length - 1)) {
        return prev;
      }
      const newBlocks = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      onChange?.(newBlocks);
      return newBlocks;
    });
  }, [onChange]);

  if (readOnly || previewMode) {
    return (
      <div className="article-content">
        {!readOnly && (
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPreviewMode(false)}
              data-testid="exit-preview"
            >
              <Code className="h-4 w-4 mr-2" />
              Exit Preview
            </Button>
          </div>
        )}
        {blocks.map(block => (
          <BlockPreview key={block.id} block={block} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="article-editor">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(true)}
            data-testid="preview-btn"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
        <AddBlockButton onSelect={(type) => addBlock(type)} />
      </div>

      {/* Blocks */}
      <div className="space-y-2">
        {blocks.map((block, index) => (
          <BlockEditor
            key={block.id}
            block={block}
            isActive={activeBlock === block.id}
            onFocus={() => setActiveBlock(block.id)}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            onRemove={() => removeBlock(block.id)}
            onMoveUp={() => moveBlock(block.id, 'up')}
            onMoveDown={() => moveBlock(block.id, 'down')}
            onAddAfter={(type) => addBlock(type, block.id)}
            isFirst={index === 0}
            isLast={index === blocks.length - 1}
          />
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Start writing your article</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => addBlock(BLOCK_TYPES.PARAGRAPH)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add first block
          </Button>
        </div>
      )}
    </div>
  );
}

// Add Block Button with menu
function AddBlockButton({ onSelect }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="add-block-btn">
          <Plus className="h-4 w-4 mr-2" />
          Add Block
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Content Block</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
          <BlockTypeButton 
            icon={FileText} 
            label="Paragraph" 
            onClick={() => onSelect(BLOCK_TYPES.PARAGRAPH)} 
          />
          <BlockTypeButton 
            icon={Heading2} 
            label="Heading" 
            onClick={() => onSelect(BLOCK_TYPES.HEADING)} 
          />
          <BlockTypeButton 
            icon={Quote} 
            label="Quote Block" 
            onClick={() => onSelect(BLOCK_TYPES.QUOTE)} 
          />
          <BlockTypeButton 
            icon={ImageIcon} 
            label="Image" 
            onClick={() => onSelect(BLOCK_TYPES.IMAGE)} 
          />
          <BlockTypeButton 
            icon={ImageIcon} 
            label="Image Gallery" 
            onClick={() => onSelect(BLOCK_TYPES.GALLERY)} 
          />
          <BlockTypeButton 
            icon={Youtube} 
            label="YouTube Embed" 
            onClick={() => onSelect(BLOCK_TYPES.YOUTUBE)} 
          />
          <BlockTypeButton 
            icon={Video} 
            label="TikTok Embed" 
            onClick={() => onSelect(BLOCK_TYPES.TIKTOK)} 
          />
          <BlockTypeButton 
            icon={Clock} 
            label="Timeline" 
            onClick={() => onSelect(BLOCK_TYPES.TIMELINE)} 
          />
          <BlockTypeButton 
            icon={ChevronDown} 
            label="Expandable Section" 
            onClick={() => onSelect(BLOCK_TYPES.EXPANDABLE)} 
          />
          <BlockTypeButton 
            icon={List} 
            label="List" 
            onClick={() => onSelect(BLOCK_TYPES.LIST)} 
          />
          <BlockTypeButton 
            icon={Code} 
            label="Custom Embed" 
            onClick={() => onSelect(BLOCK_TYPES.EMBED)} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BlockTypeButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors"
      data-testid={`block-type-${label.toLowerCase().replace(' ', '-')}`}
    >
      <Icon className="h-6 w-6" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// Individual Block Editor
function BlockEditor({ 
  block, 
  isActive, 
  onFocus, 
  onUpdate, 
  onRemove, 
  onMoveUp, 
  onMoveDown,
  onAddAfter,
  isFirst,
  isLast 
}) {
  const renderBlockContent = () => {
    switch (block.type) {
      case BLOCK_TYPES.PARAGRAPH:
        return (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onFocus={onFocus}
            placeholder="Write your paragraph..."
            className="min-h-[100px] resize-none border-0 focus-visible:ring-0 text-lg leading-relaxed"
            data-testid="paragraph-input"
          />
        );

      case BLOCK_TYPES.HEADING:
        return (
          <div className="space-y-2">
            <Select 
              value={block.level || 'h2'} 
              onValueChange={(v) => onUpdate({ level: v })}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h2">H2</SelectItem>
                <SelectItem value="h3">H3</SelectItem>
                <SelectItem value="h4">H4</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              onFocus={onFocus}
              placeholder="Heading text..."
              className="text-2xl font-bold border-0 focus-visible:ring-0"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              data-testid="heading-input"
            />
          </div>
        );

      case BLOCK_TYPES.QUOTE:
        return (
          <div className="border-l-4 border-primary pl-4 space-y-2">
            <Textarea
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              onFocus={onFocus}
              placeholder="Enter quote..."
              className="min-h-[80px] resize-none border-0 focus-visible:ring-0 text-xl italic"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              data-testid="quote-input"
            />
            <Input
              value={block.attribution || ''}
              onChange={(e) => onUpdate({ attribution: e.target.value })}
              placeholder="— Attribution"
              className="text-sm text-muted-foreground border-0 focus-visible:ring-0"
              data-testid="quote-attribution"
            />
          </div>
        );

      case BLOCK_TYPES.IMAGE:
        return (
          <div className="space-y-2">
            <Input
              value={block.url || ''}
              onChange={(e) => onUpdate({ url: e.target.value })}
              onFocus={onFocus}
              placeholder="Image URL..."
              data-testid="image-url-input"
            />
            {block.url && (
              <img 
                src={block.url} 
                alt={block.caption || ''} 
                className="max-h-64 object-cover rounded"
              />
            )}
            <Input
              value={block.caption || ''}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Image caption..."
              className="text-sm"
              data-testid="image-caption-input"
            />
          </div>
        );

      case BLOCK_TYPES.YOUTUBE:
        return (
          <div className="space-y-2">
            <Input
              value={block.url || ''}
              onChange={(e) => onUpdate({ url: e.target.value })}
              onFocus={onFocus}
              placeholder="YouTube URL (e.g., https://youtube.com/watch?v=...)"
              data-testid="youtube-url-input"
            />
            {block.url && extractYouTubeId(block.url) && (
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(block.url)}`}
                  className="w-full h-full rounded"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        );

      case BLOCK_TYPES.TIKTOK:
        return (
          <div className="space-y-2">
            <Input
              value={block.url || ''}
              onChange={(e) => onUpdate({ url: e.target.value })}
              onFocus={onFocus}
              placeholder="TikTok URL..."
              data-testid="tiktok-url-input"
            />
            <p className="text-sm text-muted-foreground">
              TikTok embed will appear in preview mode
            </p>
          </div>
        );

      case BLOCK_TYPES.TIMELINE:
        return (
          <TimelineEditor 
            items={block.items || []} 
            onChange={(items) => onUpdate({ items })}
            onFocus={onFocus}
          />
        );

      case BLOCK_TYPES.EXPANDABLE:
        return (
          <div className="space-y-2 border rounded-lg p-4">
            <Input
              value={block.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              onFocus={onFocus}
              placeholder="Section title (click to expand)"
              className="font-semibold"
              data-testid="expandable-title"
            />
            <Textarea
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Hidden content..."
              className="min-h-[100px]"
              data-testid="expandable-content"
            />
          </div>
        );

      case BLOCK_TYPES.LIST:
        return (
          <ListEditor
            items={block.items || ['']}
            ordered={block.ordered || false}
            onChange={(items) => onUpdate({ items })}
            onOrderedChange={(ordered) => onUpdate({ ordered })}
            onFocus={onFocus}
          />
        );

      case BLOCK_TYPES.EMBED:
        return (
          <div className="space-y-2">
            <Textarea
              value={block.code || ''}
              onChange={(e) => onUpdate({ code: e.target.value })}
              onFocus={onFocus}
              placeholder="Paste embed code (iframe, script, etc.)..."
              className="font-mono text-sm min-h-[100px]"
              data-testid="embed-code-input"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={`transition-all ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex gap-2">
          {/* Drag handle and controls */}
          <div className="flex flex-col gap-1 pt-2">
            <button 
              className="p-1 text-muted-foreground hover:text-foreground cursor-grab"
              data-testid="drag-handle"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
              data-testid="move-up"
            >
              ▲
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
              data-testid="move-down"
            >
              ▼
            </button>
          </div>

          {/* Block content */}
          <div className="flex-1">
            {renderBlockContent()}
          </div>

          {/* Delete button */}
          <button
            onClick={onRemove}
            className="p-2 text-muted-foreground hover:text-destructive"
            data-testid="delete-block"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// Timeline Editor Component
function TimelineEditor({ items, onChange, onFocus }) {
  const addItem = () => {
    onChange([...items, { date: '', title: '', description: '' }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3" data-testid="timeline-editor">
      <Label className="text-sm font-medium">Investigation Timeline</Label>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-start border-l-2 border-primary pl-4">
          <div className="flex-1 space-y-2">
            <Input
              value={item.date}
              onChange={(e) => updateItem(index, 'date', e.target.value)}
              onFocus={onFocus}
              placeholder="Date (e.g., Jan 2025)"
              className="text-sm"
            />
            <Input
              value={item.title}
              onChange={(e) => updateItem(index, 'title', e.target.value)}
              placeholder="Event title"
              className="font-medium"
            />
            <Textarea
              value={item.description}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
              placeholder="Description..."
              className="text-sm min-h-[60px]"
            />
          </div>
          <button
            onClick={() => removeItem(index)}
            className="p-2 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4 mr-2" />
        Add Timeline Event
      </Button>
    </div>
  );
}

// List Editor Component
function ListEditor({ items, ordered, onChange, onOrderedChange, onFocus }) {
  const addItem = () => {
    onChange([...items, '']);
  };

  const updateItem = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      onChange(items.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-2" data-testid="list-editor">
      <div className="flex items-center gap-2">
        <Button
          variant={ordered ? 'outline' : 'default'}
          size="sm"
          onClick={() => onOrderedChange(false)}
        >
          <List className="h-4 w-4 mr-1" />
          Bullets
        </Button>
        <Button
          variant={ordered ? 'default' : 'outline'}
          size="sm"
          onClick={() => onOrderedChange(true)}
        >
          <ListOrdered className="h-4 w-4 mr-1" />
          Numbered
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <span className="text-muted-foreground w-6">
            {ordered ? `${index + 1}.` : '•'}
          </span>
          <Input
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            onFocus={onFocus}
            placeholder="List item..."
            className="flex-1"
          />
          <button
            onClick={() => removeItem(index)}
            className="p-1 text-muted-foreground hover:text-destructive"
            disabled={items.length <= 1}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4 mr-2" />
        Add item
      </Button>
    </div>
  );
}

// Block Preview Component
function BlockPreview({ block }) {
  switch (block.type) {
    case BLOCK_TYPES.PARAGRAPH:
      return <p className="mb-6 text-lg leading-relaxed">{block.content}</p>;

    case BLOCK_TYPES.HEADING:
      const HeadingTag = block.level || 'h2';
      return <HeadingTag className="headline-section my-8">{block.content}</HeadingTag>;

    case BLOCK_TYPES.QUOTE:
      return (
        <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic text-xl">
          <p style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>{block.content}</p>
          {block.attribution && (
            <cite className="block mt-2 text-sm text-muted-foreground not-italic">
              — {block.attribution}
            </cite>
          )}
        </blockquote>
      );

    case BLOCK_TYPES.IMAGE:
      return (
        <figure className="my-8">
          <img src={block.url} alt={block.caption || ''} className="w-full rounded" />
          {block.caption && (
            <figcaption className="mt-2 text-sm text-muted-foreground text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case BLOCK_TYPES.YOUTUBE:
      const videoId = extractYouTubeId(block.url);
      if (!videoId) return null;
      return (
        <div className="aspect-video my-8">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full rounded"
            allowFullScreen
          />
        </div>
      );

    case BLOCK_TYPES.TIKTOK:
      return (
        <div className="my-8 text-center p-8 border rounded bg-muted/20">
          <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">TikTok Video</p>
          <a href={block.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            View on TikTok
          </a>
        </div>
      );

    case BLOCK_TYPES.TIMELINE:
      return (
        <div className="my-8 space-y-4">
          {(block.items || []).map((item, i) => (
            <div key={i} className="flex gap-4 border-l-2 border-primary pl-4">
              <div className="flex-shrink-0 text-sm font-medium text-primary">{item.date}</div>
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case BLOCK_TYPES.EXPANDABLE:
      return (
        <details className="my-6 border rounded-lg">
          <summary className="p-4 cursor-pointer font-semibold hover:bg-muted/50">
            {block.title || 'Click to expand'}
          </summary>
          <div className="p-4 pt-0 text-muted-foreground">
            {block.content}
          </div>
        </details>
      );

    case BLOCK_TYPES.LIST:
      const ListTag = block.ordered ? 'ol' : 'ul';
      return (
        <ListTag className={`my-6 ${block.ordered ? 'list-decimal' : 'list-disc'} pl-6 space-y-2`}>
          {(block.items || []).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ListTag>
      );

    case BLOCK_TYPES.EMBED:
      return (
        <div 
          className="my-8" 
          dangerouslySetInnerHTML={{ __html: block.code || '' }} 
        />
      );

    default:
      return null;
  }
}

// Utility function to extract YouTube video ID
function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
  return match ? match[1] : null;
}

// Export block types for external use
export { BLOCK_TYPES };
