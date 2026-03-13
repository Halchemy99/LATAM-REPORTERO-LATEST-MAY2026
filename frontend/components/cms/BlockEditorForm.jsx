'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Upload } from 'lucide-react';

// Generic multilingual text input
function MultilingualInput({ label, field, block, onChange, multiline = false }) {
  const [activeTab, setActiveTab] = useState('en');
  
  const handleChange = (locale, value) => {
    const contentKey = `content_${locale}`;
    const currentContent = block[contentKey] || {};
    onChange({
      [contentKey]: {
        ...currentContent,
        [field]: value
      }
    });
  };

  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[200px]">
          <TabsTrigger value="en">EN</TabsTrigger>
          <TabsTrigger value="es">ES</TabsTrigger>
          <TabsTrigger value="pt">PT</TabsTrigger>
        </TabsList>
        {['en', 'es', 'pt'].map(locale => (
          <TabsContent key={locale} value={locale} className="mt-2">
            <InputComponent
              value={block[`content_${locale}`]?.[field] || ''}
              onChange={(e) => handleChange(locale, e.target.value)}
              placeholder={`${label} (${locale.toUpperCase()})`}
              rows={multiline ? 4 : undefined}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Paragraph Block Form
function ParagraphForm({ block, onChange }) {
  return (
    <MultilingualInput
      label="Text"
      field="text"
      block={block}
      onChange={onChange}
      multiline
    />
  );
}

// Heading Block Form
function HeadingForm({ block, onChange }) {
  const handleLevelChange = (level) => {
    ['en', 'es', 'pt'].forEach(locale => {
      const contentKey = `content_${locale}`;
      onChange({
        [contentKey]: {
          ...block[contentKey],
          level: parseInt(level)
        }
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Level</Label>
        <Select
          value={String(block.content_en?.level || 2)}
          onValueChange={handleLevelChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">Heading 2</SelectItem>
            <SelectItem value="3">Heading 3</SelectItem>
            <SelectItem value="4">Heading 4</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <MultilingualInput
        label="Heading Text"
        field="text"
        block={block}
        onChange={onChange}
      />
    </div>
  );
}

// Pull Quote Form
function PullQuoteForm({ block, onChange }) {
  return (
    <div className="space-y-4">
      <MultilingualInput
        label="Quote"
        field="quote"
        block={block}
        onChange={onChange}
        multiline
      />
      <MultilingualInput
        label="Attribution"
        field="attribution"
        block={block}
        onChange={onChange}
      />
      <MultilingualInput
        label="Title/Role"
        field="title"
        block={block}
        onChange={onChange}
      />
    </div>
  );
}

// Callout Box Form
function CalloutBoxForm({ block, onChange }) {
  const handleTypeChange = (type) => {
    ['en', 'es', 'pt'].forEach(locale => {
      const contentKey = `content_${locale}`;
      onChange({
        [contentKey]: {
          ...block[contentKey],
          type
        }
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={block.content_en?.type || 'info'}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <MultilingualInput
        label="Title"
        field="title"
        block={block}
        onChange={onChange}
      />
      <MultilingualInput
        label="Content"
        field="text"
        block={block}
        onChange={onChange}
        multiline
      />
    </div>
  );
}

// Fact Box Form
function FactBoxForm({ block, onChange }) {
  const [activeTab, setActiveTab] = useState('en');
  
  const addFact = (locale) => {
    const contentKey = `content_${locale}`;
    const facts = [...(block[contentKey]?.facts || []), ''];
    onChange({
      [contentKey]: {
        ...block[contentKey],
        facts
      }
    });
  };

  const updateFact = (locale, index, value) => {
    const contentKey = `content_${locale}`;
    const facts = [...(block[contentKey]?.facts || [])];
    facts[index] = value;
    onChange({
      [contentKey]: {
        ...block[contentKey],
        facts
      }
    });
  };

  const removeFact = (locale, index) => {
    const contentKey = `content_${locale}`;
    const facts = [...(block[contentKey]?.facts || [])];
    facts.splice(index, 1);
    onChange({
      [contentKey]: {
        ...block[contentKey],
        facts
      }
    });
  };

  return (
    <div className="space-y-4">
      <MultilingualInput
        label="Title"
        field="title"
        block={block}
        onChange={onChange}
      />
      <div className="space-y-2">
        <Label>Facts</Label>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-[200px]">
            <TabsTrigger value="en">EN</TabsTrigger>
            <TabsTrigger value="es">ES</TabsTrigger>
            <TabsTrigger value="pt">PT</TabsTrigger>
          </TabsList>
          {['en', 'es', 'pt'].map(locale => (
            <TabsContent key={locale} value={locale} className="space-y-2 mt-2">
              {(block[`content_${locale}`]?.facts || []).map((fact, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={fact}
                    onChange={(e) => updateFact(locale, index, e.target.value)}
                    placeholder={`Fact ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFact(locale, index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addFact(locale)}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Fact
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

// Image Block Form
function ImageForm({ block, onChange }) {
  const handleSettingChange = (field, value) => {
    ['en', 'es', 'pt'].forEach(locale => {
      const contentKey = `content_${locale}`;
      onChange({
        [contentKey]: {
          ...block[contentKey],
          [field]: value
        }
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input
          value={block.content_en?.src || ''}
          onChange={(e) => handleSettingChange('src', e.target.value)}
          placeholder="https://..."
        />
      </div>
      <MultilingualInput
        label="Alt Text"
        field="alt"
        block={block}
        onChange={onChange}
      />
      <MultilingualInput
        label="Caption"
        field="caption"
        block={block}
        onChange={onChange}
      />
      <div className="space-y-2">
        <Label>Credit</Label>
        <Input
          value={block.content_en?.credit || ''}
          onChange={(e) => handleSettingChange('credit', e.target.value)}
          placeholder="Photographer name"
        />
      </div>
      <div className="space-y-2">
        <Label>Width</Label>
        <Select
          value={block.content_en?.width || 'full'}
          onValueChange={(v) => handleSettingChange('width', v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Width</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="small">Small</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Video Embed Form
function VideoEmbedForm({ block, onChange }) {
  const handleSettingChange = (field, value) => {
    ['en', 'es', 'pt'].forEach(locale => {
      const contentKey = `content_${locale}`;
      onChange({
        [contentKey]: {
          ...block[contentKey],
          [field]: value
        }
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Platform</Label>
        <Select
          value={block.content_en?.platform || 'youtube'}
          onValueChange={(v) => handleSettingChange('platform', v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="vimeo">Vimeo</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Video ID</Label>
        <Input
          value={block.content_en?.videoId || ''}
          onChange={(e) => handleSettingChange('videoId', e.target.value)}
          placeholder="e.g., dQw4w9WgXcQ"
        />
        <p className="text-xs text-muted-foreground">
          YouTube: The ID after "v=" in the URL
        </p>
      </div>
      <MultilingualInput
        label="Caption"
        field="caption"
        block={block}
        onChange={onChange}
      />
    </div>
  );
}

// Timeline Form
function TimelineForm({ block, onChange }) {
  const [activeTab, setActiveTab] = useState('en');

  const addEvent = (locale) => {
    const contentKey = `content_${locale}`;
    const events = [...(block[contentKey]?.events || []), { date: '', title: '', description: '' }];
    onChange({
      [contentKey]: {
        ...block[contentKey],
        events
      }
    });
  };

  const updateEvent = (locale, index, field, value) => {
    const contentKey = `content_${locale}`;
    const events = [...(block[contentKey]?.events || [])];
    events[index] = { ...events[index], [field]: value };
    onChange({
      [contentKey]: {
        ...block[contentKey],
        events
      }
    });
  };

  const removeEvent = (locale, index) => {
    const contentKey = `content_${locale}`;
    const events = [...(block[contentKey]?.events || [])];
    events.splice(index, 1);
    onChange({
      [contentKey]: {
        ...block[contentKey],
        events
      }
    });
  };

  return (
    <div className="space-y-4">
      <Label>Timeline Events</Label>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[200px]">
          <TabsTrigger value="en">EN</TabsTrigger>
          <TabsTrigger value="es">ES</TabsTrigger>
          <TabsTrigger value="pt">PT</TabsTrigger>
        </TabsList>
        {['en', 'es', 'pt'].map(locale => (
          <TabsContent key={locale} value={locale} className="space-y-4 mt-2">
            {(block[`content_${locale}`]?.events || []).map((event, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Event {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEvent(locale, index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={event.date || ''}
                  onChange={(e) => updateEvent(locale, index, 'date', e.target.value)}
                  placeholder="Date (e.g., January 2024)"
                />
                <Input
                  value={event.title || ''}
                  onChange={(e) => updateEvent(locale, index, 'title', e.target.value)}
                  placeholder="Event Title"
                />
                <Textarea
                  value={event.description || ''}
                  onChange={(e) => updateEvent(locale, index, 'description', e.target.value)}
                  placeholder="Description"
                  rows={2}
                />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addEvent(locale)}>
              <Plus className="h-4 w-4 mr-1" /> Add Event
            </Button>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Data Table Form
function DataTableForm({ block, onChange }) {
  const [activeTab, setActiveTab] = useState('en');

  const handleHeaderChange = (locale, index, value) => {
    const contentKey = `content_${locale}`;
    const headers = [...(block[contentKey]?.headers || [])];
    headers[index] = value;
    onChange({
      [contentKey]: {
        ...block[contentKey],
        headers
      }
    });
  };

  const handleCellChange = (locale, rowIndex, colIndex, value) => {
    const contentKey = `content_${locale}`;
    const rows = [...(block[contentKey]?.rows || [])];
    if (!rows[rowIndex]) rows[rowIndex] = [];
    rows[rowIndex][colIndex] = value;
    onChange({
      [contentKey]: {
        ...block[contentKey],
        rows
      }
    });
  };

  const addColumn = (locale) => {
    const contentKey = `content_${locale}`;
    const headers = [...(block[contentKey]?.headers || []), 'New Column'];
    const rows = (block[contentKey]?.rows || []).map(row => [...row, '']);
    onChange({
      [contentKey]: {
        ...block[contentKey],
        headers,
        rows
      }
    });
  };

  const addRow = (locale) => {
    const contentKey = `content_${locale}`;
    const headers = block[contentKey]?.headers || [];
    const rows = [...(block[contentKey]?.rows || []), new Array(headers.length).fill('')];
    onChange({
      [contentKey]: {
        ...block[contentKey],
        rows
      }
    });
  };

  return (
    <div className="space-y-4">
      <Label>Data Table</Label>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[200px]">
          <TabsTrigger value="en">EN</TabsTrigger>
          <TabsTrigger value="es">ES</TabsTrigger>
          <TabsTrigger value="pt">PT</TabsTrigger>
        </TabsList>
        {['en', 'es', 'pt'].map(locale => {
          const content = block[`content_${locale}`] || {};
          const headers = content.headers || ['Column 1', 'Column 2'];
          const rows = content.rows || [['', '']];
          
          return (
            <TabsContent key={locale} value={locale} className="space-y-4 mt-2">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {headers.map((header, i) => (
                        <th key={i} className="border p-2">
                          <Input
                            value={header}
                            onChange={(e) => handleHeaderChange(locale, i, e.target.value)}
                            className="font-semibold"
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {headers.map((_, colIndex) => (
                          <td key={colIndex} className="border p-2">
                            <Input
                              value={row[colIndex] || ''}
                              onChange={(e) => handleCellChange(locale, rowIndex, colIndex, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => addColumn(locale)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Column
                </Button>
                <Button variant="outline" size="sm" onClick={() => addRow(locale)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Row
                </Button>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
      <MultilingualInput
        label="Caption"
        field="caption"
        block={block}
        onChange={onChange}
      />
    </div>
  );
}

// Call to Action Form
function CallToActionForm({ block, onChange }) {
  const handleSettingChange = (field, value) => {
    ['en', 'es', 'pt'].forEach(locale => {
      const contentKey = `content_${locale}`;
      onChange({
        [contentKey]: {
          ...block[contentKey],
          [field]: value
        }
      });
    });
  };

  return (
    <div className="space-y-4">
      <MultilingualInput
        label="Title"
        field="title"
        block={block}
        onChange={onChange}
      />
      <MultilingualInput
        label="Description"
        field="description"
        block={block}
        onChange={onChange}
        multiline
      />
      <MultilingualInput
        label="Button Text"
        field="buttonText"
        block={block}
        onChange={onChange}
      />
      <div className="space-y-2">
        <Label>Button URL</Label>
        <Input
          value={block.content_en?.buttonUrl || ''}
          onChange={(e) => handleSettingChange('buttonUrl', e.target.value)}
          placeholder="/pricing or https://..."
        />
      </div>
      <div className="space-y-2">
        <Label>Style</Label>
        <Select
          value={block.content_en?.style || 'primary'}
          onValueChange={(v) => handleSettingChange('style', v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary (Purple)</SelectItem>
            <SelectItem value="secondary">Secondary (Beige)</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Sources List Form
function SourcesListForm({ block, onChange }) {
  const [activeTab, setActiveTab] = useState('en');

  const addSource = (locale) => {
    const contentKey = `content_${locale}`;
    const sources = [...(block[contentKey]?.sources || []), { name: '', url: '', accessed: '' }];
    onChange({
      [contentKey]: {
        ...block[contentKey],
        sources
      }
    });
  };

  const updateSource = (locale, index, field, value) => {
    const contentKey = `content_${locale}`;
    const sources = [...(block[contentKey]?.sources || [])];
    sources[index] = { ...sources[index], [field]: value };
    onChange({
      [contentKey]: {
        ...block[contentKey],
        sources
      }
    });
  };

  const removeSource = (locale, index) => {
    const contentKey = `content_${locale}`;
    const sources = [...(block[contentKey]?.sources || [])];
    sources.splice(index, 1);
    onChange({
      [contentKey]: {
        ...block[contentKey],
        sources
      }
    });
  };

  return (
    <div className="space-y-4">
      <Label>Sources</Label>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[200px]">
          <TabsTrigger value="en">EN</TabsTrigger>
          <TabsTrigger value="es">ES</TabsTrigger>
          <TabsTrigger value="pt">PT</TabsTrigger>
        </TabsList>
        {['en', 'es', 'pt'].map(locale => (
          <TabsContent key={locale} value={locale} className="space-y-4 mt-2">
            {(block[`content_${locale}`]?.sources || []).map((source, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Source {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSource(locale, index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={source.name || ''}
                  onChange={(e) => updateSource(locale, index, 'name', e.target.value)}
                  placeholder="Source Name"
                />
                <Input
                  value={source.url || ''}
                  onChange={(e) => updateSource(locale, index, 'url', e.target.value)}
                  placeholder="URL"
                />
                <Input
                  value={source.accessed || ''}
                  onChange={(e) => updateSource(locale, index, 'accessed', e.target.value)}
                  placeholder="Accessed Date (optional)"
                />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addSource(locale)}>
              <Plus className="h-4 w-4 mr-1" /> Add Source
            </Button>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Simple text-only form for basic blocks
function SimpleTextForm({ block, onChange, label = 'Text' }) {
  return (
    <MultilingualInput
      label={label}
      field="text"
      block={block}
      onChange={onChange}
      multiline
    />
  );
}

// Empty form for layout blocks
function EmptyForm() {
  return (
    <p className="text-sm text-muted-foreground">
      This block has no editable content.
    </p>
  );
}

// Main Block Editor Form
export default function BlockEditorForm({ block, locale, onChange }) {
  const FORMS = {
    paragraph: ParagraphForm,
    heading: HeadingForm,
    subheading: (props) => <SimpleTextForm {...props} label="Subheading Text" />,
    pull_quote: PullQuoteForm,
    callout_box: CalloutBoxForm,
    fact_box: FactBoxForm,
    key_takeaways: FactBoxForm, // Similar structure
    image: ImageForm,
    image_gallery: ImageForm, // Extend later
    video_embed: VideoEmbedForm,
    audio_clip: ImageForm, // Similar - just needs src
    podcast_embed: VideoEmbedForm, // Similar
    chart: ImageForm, // Similar
    infographic: ImageForm,
    timeline: TimelineForm,
    data_table: DataTableForm,
    map_embed: ImageForm, // Similar
    divider: EmptyForm,
    section_break: EmptyForm,
    two_column: (props) => <SimpleTextForm {...props} label="Left Content" />,
    highlight_section: (props) => (
      <div className="space-y-4">
        <MultilingualInput label="Title" field="title" {...props} />
        <MultilingualInput label="Text" field="text" {...props} multiline />
      </div>
    ),
    newsletter_signup: (props) => (
      <div className="space-y-4">
        <MultilingualInput label="Title" field="title" {...props} />
        <MultilingualInput label="Description" field="description" {...props} multiline />
      </div>
    ),
    call_to_action: CallToActionForm,
    related_articles: EmptyForm, // Complex - handled separately
    sources_list: SourcesListForm
  };

  const FormComponent = FORMS[block.block_type] || EmptyForm;

  return <FormComponent block={block} locale={locale} onChange={onChange} />;
}
