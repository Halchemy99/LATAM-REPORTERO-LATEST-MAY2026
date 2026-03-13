'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { BLOCK_TYPES, getDefaultBlockContent } from './BlockRenderer';
import BlockEditorForm from './BlockEditorForm';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown,
  Edit,
  Eye,
  EyeOff,
  AlignLeft,
  Heading,
  Type,
  Quote,
  AlertCircle,
  List,
  CheckSquare,
  Image,
  Images,
  Video,
  Headphones,
  Mic,
  BarChart,
  PieChart,
  Clock,
  Table,
  Map,
  Minus,
  MoreHorizontal,
  Columns,
  Highlighter,
  Mail,
  MousePointer,
  FileText,
  Link,
  Check,
  X,
  Settings
} from 'lucide-react';

// Icon map for block types
const ICONS = {
  AlignLeft, Heading, Type, Quote, AlertCircle, List, CheckSquare,
  Image, Images, Video, Headphones, Mic, BarChart, PieChart, Clock,
  Table, Map, Minus, MoreHorizontal, Columns, Highlighter, Mail,
  MousePointer, FileText, Link
};

// Check if block type supports inline editing
const INLINE_EDITABLE_TYPES = ['paragraph', 'heading', 'subheading', 'pull_quote'];

// Sortable Block Item with Inline Editing
function SortableBlock({ block, index, locale, onEdit, onDelete, onDuplicate, isEditing, setEditingBlock, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [inlineText, setInlineText] = useState('');
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const textareaRef = useRef(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto'
  };

  const blockInfo = BLOCK_TYPES
    .flatMap(cat => cat.blocks)
    .find(b => b.type === block.block_type);

  const IconComponent = blockInfo ? ICONS[blockInfo.icon] : AlignLeft;
  
  const isInlineEditable = INLINE_EDITABLE_TYPES.includes(block.block_type);
  
  // Get current text content
  const getTextContent = () => {
    const content = block[`content_${locale}`] || block.content_en || {};
    if (block.block_type === 'pull_quote') {
      return content.quote || '';
    }
    return content.text || '';
  };
  
  // Start inline editing
  const startInlineEdit = () => {
    if (!isInlineEditable) return;
    setInlineText(getTextContent());
    setIsInlineEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };
  
  // Save inline edit
  const saveInlineEdit = () => {
    const contentKey = `content_${locale}`;
    const currentContent = block[contentKey] || block.content_en || {};
    
    if (block.block_type === 'pull_quote') {
      onEdit(block.id, {
        [contentKey]: { ...currentContent, quote: inlineText }
      });
    } else {
      onEdit(block.id, {
        [contentKey]: { ...currentContent, text: inlineText }
      });
    }
    setIsInlineEditing(false);
  };
  
  // Cancel inline edit
  const cancelInlineEdit = () => {
    setIsInlineEditing(false);
    setInlineText('');
  };
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      cancelInlineEdit();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      saveInlineEdit();
    }
  };

  const getBlockPreview = () => {
    const content = block[`content_${locale}`] || block.content_en || {};
    switch (block.block_type) {
      case 'paragraph':
        return content.text?.substring(0, 100) + (content.text?.length > 100 ? '...' : '') || 'Empty paragraph';
      case 'heading':
        return content.text || 'Empty heading';
      case 'subheading':
        return content.text || 'Empty subheading';
      case 'pull_quote':
        return `"${content.quote?.substring(0, 80)}..."` || 'Empty quote';
      case 'image':
        return content.src ? `Image: ${content.alt || 'No alt text'}` : 'No image selected';
      case 'video_embed':
        return `${content.platform || 'Video'}: ${content.videoId || 'No ID'}`;
      case 'timeline':
        return `Timeline: ${content.events?.length || 0} events`;
      case 'data_table':
        return `Table: ${content.headers?.length || 0} columns`;
      default:
        return blockInfo?.label || block.block_type;
    }
  };

  return (
    <TooltipProvider>
      <div
        ref={setNodeRef}
        style={style}
        className={`group border rounded-lg mb-3 bg-card transition-all duration-200 ${
          isDragging ? 'shadow-xl ring-2 ring-[#8c52ff] scale-[1.02]' : 'hover:shadow-md'
        } ${isEditing ? 'ring-2 ring-[#8c52ff]' : ''} ${isInlineEditing ? 'ring-2 ring-blue-500' : ''}`}
      >
        {/* Block Header */}
        <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
          {/* Drag Handle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing hover:text-[#8c52ff] transition-colors p-1 rounded hover:bg-muted"
              >
                <GripVertical className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Drag to reorder</TooltipContent>
          </Tooltip>

          {/* Block Type Icon & Label */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="p-1.5 rounded bg-[#8c52ff]/10">
              <IconComponent className="h-4 w-4 text-[#8c52ff]" />
            </div>
            <span className="text-sm font-medium" style={{ fontFamily: 'Raleway, sans-serif' }}>
              {blockInfo?.label || block.block_type}
            </span>
            {!isInlineEditing && !isEditing && (
              <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                — {getBlockPreview()}
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Move Up/Down */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onMoveUp}
                  disabled={isFirst}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move up</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onMoveDown}
                  disabled={isLast}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move down</TooltipContent>
            </Tooltip>
            
            <div className="w-px h-5 bg-border mx-1" />
            
            {/* Inline Edit (for text blocks) */}
            {isInlineEditable && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={startInlineEdit}
                  >
                    <Type className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quick edit text</TooltipContent>
              </Tooltip>
            )}
            
            {/* Full Edit */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setEditingBlock(isEditing ? null : block.id)}
                >
                  {isEditing ? <EyeOff className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isEditing ? 'Close settings' : 'Block settings'}</TooltipContent>
            </Tooltip>
            
            {/* Duplicate */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onDuplicate(block)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Duplicate block</TooltipContent>
            </Tooltip>
            
            {/* Delete */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => onDelete(block.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete block</TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        {/* Inline Editing Area */}
        {isInlineEditing && (
          <div className="p-4 border-b bg-blue-50/50">
            <div className="space-y-3">
              <Textarea
                ref={textareaRef}
                value={inlineText}
                onChange={(e) => setInlineText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Enter ${block.block_type} text...`}
                className="min-h-[100px] resize-y"
                style={{ 
                  fontFamily: block.block_type === 'heading' || block.block_type === 'subheading' 
                    ? 'Playfair Display, serif' 
                    : 'Source Serif 4, serif',
                  fontSize: block.block_type === 'heading' ? '1.5rem' : block.block_type === 'subheading' ? '1.25rem' : '1rem'
                }}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Ctrl+Enter to save, Escape to cancel
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={cancelInlineEdit}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveInlineEdit}>
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Block Editor Form (when editing full settings) */}
        {isEditing && !isInlineEditing && (
          <div className="p-4 bg-muted/10">
            <BlockEditorForm
              block={block}
              locale={locale}
              onChange={(updates) => onEdit(block.id, updates)}
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

// Add Block Button
function AddBlockButton({ onAddBlock }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-dashed border-2 h-12 hover:border-[#8c52ff] hover:text-[#8c52ff]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Block
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {BLOCK_TYPES.map((category) => (
          <DropdownMenuSub key={category.category}>
            <DropdownMenuSubTrigger>
              {category.category}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {category.blocks.map((block) => {
                const IconComponent = ICONS[block.icon];
                return (
                  <DropdownMenuItem
                    key={block.type}
                    onClick={() => onAddBlock(block.type)}
                  >
                    <IconComponent className="h-4 w-4 mr-2 text-[#8c52ff]" />
                    {block.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Main Block Editor Component
export default function BlockEditor({ 
  blocks = [], 
  onChange, 
  locale = 'en' 
}) {
  const [editingBlock, setEditingBlock] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over.id);
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      onChange(newBlocks);
    }
  }, [blocks, onChange]);

  const handleAddBlock = useCallback((blockType) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      block_type: blockType,
      content_en: getDefaultBlockContent(blockType),
      content_es: getDefaultBlockContent(blockType),
      content_pt: getDefaultBlockContent(blockType),
      settings: {}
    };
    onChange([...blocks, newBlock]);
    setEditingBlock(newBlock.id);
  }, [blocks, onChange]);

  const handleEditBlock = useCallback((blockId, updates) => {
    const newBlocks = blocks.map(block => {
      if (block.id === blockId) {
        return { ...block, ...updates };
      }
      return block;
    });
    onChange(newBlocks);
  }, [blocks, onChange]);

  const handleDeleteBlock = useCallback((blockId) => {
    onChange(blocks.filter(b => b.id !== blockId));
    if (editingBlock === blockId) {
      setEditingBlock(null);
    }
  }, [blocks, onChange, editingBlock]);

  const handleDuplicateBlock = useCallback((block) => {
    const newBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    const index = blocks.findIndex(b => b.id === block.id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange(newBlocks);
  }, [blocks, onChange]);
  
  const handleMoveUp = useCallback((blockId) => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index > 0) {
      const newBlocks = arrayMove(blocks, index, index - 1);
      onChange(newBlocks);
    }
  }, [blocks, onChange]);
  
  const handleMoveDown = useCallback((blockId) => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index < blocks.length - 1) {
      const newBlocks = arrayMove(blocks, index, index + 1);
      onChange(newBlocks);
    }
  }, [blocks, onChange]);

  return (
    <div className="space-y-4">
      {/* Block List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block, index) => (
            <SortableBlock
              key={block.id}
              block={block}
              index={index}
              locale={locale}
              onEdit={handleEditBlock}
              onDelete={handleDeleteBlock}
              onDuplicate={handleDuplicateBlock}
              isEditing={editingBlock === block.id}
              setEditingBlock={setEditingBlock}
              onMoveUp={() => handleMoveUp(block.id)}
              onMoveDown={() => handleMoveDown(block.id)}
              isFirst={index === 0}
              isLast={index === blocks.length - 1}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add Block Button */}
      <AddBlockButton onAddBlock={handleAddBlock} />

      {/* Empty State */}
      {blocks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <Type className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="mb-2 font-medium">No content blocks yet</p>
          <p className="text-sm">Click "Add Block" to start building your article.</p>
        </div>
      )}
    </div>
  );
}
