'use client';

import { useState, useCallback } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
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
  Link
} from 'lucide-react';

// Icon map for block types
const ICONS = {
  AlignLeft, Heading, Type, Quote, AlertCircle, List, CheckSquare,
  Image, Images, Video, Headphones, Mic, BarChart, PieChart, Clock,
  Table, Map, Minus, MoreHorizontal, Columns, Highlighter, Mail,
  MousePointer, FileText, Link
};

// Sortable Block Item
function SortableBlock({ block, index, locale, onEdit, onDelete, onDuplicate, isEditing, setEditingBlock }) {
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
    opacity: isDragging ? 0.5 : 1
  };

  const blockInfo = BLOCK_TYPES
    .flatMap(cat => cat.blocks)
    .find(b => b.type === block.block_type);

  const IconComponent = blockInfo ? ICONS[blockInfo.icon] : AlignLeft;

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
    <div
      ref={setNodeRef}
      style={style}
      className={`group border rounded-lg mb-2 bg-card transition-shadow ${
        isDragging ? 'shadow-lg ring-2 ring-[#8c52ff]' : ''
      } ${isEditing ? 'ring-2 ring-[#8c52ff]' : ''}`}
    >
      {/* Block Header */}
      <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-[#8c52ff] transition-colors"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Block Type Icon & Label */}
        <div className="flex items-center gap-2 flex-1">
          <IconComponent className="h-4 w-4 text-[#8c52ff]" />
          <span className="text-sm font-medium" style={{ fontFamily: 'Raleway, sans-serif' }}>
            {blockInfo?.label || block.block_type}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[300px]">
            — {getBlockPreview()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setEditingBlock(isEditing ? null : block.id)}
          >
            {isEditing ? <EyeOff className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDuplicate(block)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(block.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Block Editor Form (when editing) */}
      {isEditing && (
        <div className="p-4">
          <BlockEditorForm
            block={block}
            locale={locale}
            onChange={(updates) => onEdit(block.id, updates)}
          />
        </div>
      )}
    </div>
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
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add Block Button */}
      <AddBlockButton onAddBlock={handleAddBlock} />

      {/* Empty State */}
      {blocks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="mb-2">No content blocks yet.</p>
          <p className="text-sm">Click "Add Block" to start building your article.</p>
        </div>
      )}
    </div>
  );
}
