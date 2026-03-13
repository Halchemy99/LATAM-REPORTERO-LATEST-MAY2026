'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { getMediaAssets, deleteMediaAsset } from '@/lib/supabase/cms';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Search, 
  Image as ImageIcon, 
  Video, 
  Music, 
  FileText,
  Trash2,
  Copy,
  Check,
  Loader2,
  Grid,
  List,
  X,
  ExternalLink,
  Download
} from 'lucide-react';

const FILE_TYPE_ICONS = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  document: FileText
};

const FOLDERS = [
  { value: 'general', label: 'General' },
  { value: 'articles', label: 'Articles' },
  { value: 'authors', label: 'Authors' },
  { value: 'thumbnails', label: 'Thumbnails' },
  { value: 'galleries', label: 'Galleries' }
];

export default function MediaLibraryPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { user } = useUserRole();
  
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [folderFilter, setFolderFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Upload form state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadFolder, setUploadFolder] = useState('general');
  const [uploadAltText, setUploadAltText] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadCredit, setUploadCredit] = useState('');

  useEffect(() => {
    if (user) {
      loadAssets();
    }
  }, [user, typeFilter, folderFilter]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const data = await getMediaAssets({
        type: typeFilter === 'all' ? null : typeFilter,
        folder: folderFilter === 'all' ? null : folderFilter
      });
      setAssets(data || []);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setUploadPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setUploadPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    
    try {
      setUploading(true);
      const supabase = createClient();
      
      // Upload to Supabase Storage
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `media/${uploadFolder}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cms-media')
        .upload(filePath, uploadFile);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Error uploading file. Make sure the cms-media bucket exists in Supabase Storage.');
        return;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('cms-media')
        .getPublicUrl(filePath);
      
      // Determine file type
      let fileType = 'document';
      if (uploadFile.type.startsWith('image/')) fileType = 'image';
      else if (uploadFile.type.startsWith('video/')) fileType = 'video';
      else if (uploadFile.type.startsWith('audio/')) fileType = 'audio';
      
      // Create media asset record
      const { data: assetData, error: assetError } = await supabase
        .from('media_assets')
        .insert({
          filename: fileName,
          original_filename: uploadFile.name,
          file_type: fileType,
          mime_type: uploadFile.type,
          file_size: uploadFile.size,
          file_url: urlData.publicUrl,
          folder: uploadFolder,
          alt_text_en: uploadAltText,
          caption_en: uploadCaption,
          credit: uploadCredit,
          uploaded_by: user?.id
        })
        .select()
        .single();
      
      if (assetError) {
        console.error('Database error:', assetError);
        alert('Error saving asset to database.');
        return;
      }
      
      // Reset form and reload
      setUploadFile(null);
      setUploadPreview(null);
      setUploadAltText('');
      setUploadCaption('');
      setUploadCredit('');
      setUploadDialogOpen(false);
      loadAssets();
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMediaAsset(deleteId);
      setAssets(assets.filter(a => a.id !== deleteId));
      setDeleteId(null);
      if (selectedAsset?.id === deleteId) {
        setSelectedAsset(null);
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredAssets = assets.filter(asset => {
    if (!searchTerm) return true;
    return (
      asset.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.original_filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.alt_text_en?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please log in to access the Media Library.</p>
          <Button asChild>
            <Link href="/auth/login">Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Raleway, sans-serif' }}>
              Media Library
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage images, videos, and other media assets
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-[#8c52ff] to-[#6111ff] text-white"
            onClick={() => setUploadDialogOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>
          <Select value={folderFilter} onValueChange={setFolderFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Folders</SelectItem>
              {FOLDERS.map(folder => (
                <SelectItem key={folder.value} value={folder.value}>
                  {folder.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Media Grid/List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#8c52ff]" />
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No media found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || typeFilter !== 'all' || folderFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Upload your first media file to get started'}
            </p>
            <Button 
              className="bg-gradient-to-r from-[#8c52ff] to-[#6111ff] text-white"
              onClick={() => setUploadDialogOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredAssets.map((asset) => {
              const IconComponent = FILE_TYPE_ICONS[asset.file_type] || FileText;
              return (
                <Card 
                  key={asset.id}
                  className={`cursor-pointer hover:ring-2 hover:ring-[#8c52ff]/50 transition-all ${
                    selectedAsset?.id === asset.id ? 'ring-2 ring-[#8c52ff]' : ''
                  }`}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <CardContent className="p-2">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      {asset.file_type === 'image' ? (
                        <img
                          src={asset.file_url}
                          alt={asset.alt_text_en || asset.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <IconComponent className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs mt-2 truncate" title={asset.original_filename}>
                      {asset.original_filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(asset.file_size)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="border rounded-lg divide-y">
            {filteredAssets.map((asset) => {
              const IconComponent = FILE_TYPE_ICONS[asset.file_type] || FileText;
              return (
                <div 
                  key={asset.id}
                  className={`flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer ${
                    selectedAsset?.id === asset.id ? 'bg-muted/50' : ''
                  }`}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                    {asset.file_type === 'image' ? (
                      <img
                        src={asset.file_url}
                        alt={asset.alt_text_en || asset.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <IconComponent className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{asset.original_filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {asset.file_type} • {formatFileSize(asset.file_size)} • {asset.folder}
                    </p>
                  </div>
                  <Badge variant="outline">{asset.file_type}</Badge>
                </div>
              );
            })}
          </div>
        )}

        {/* Asset Details Sidebar */}
        {selectedAsset && (
          <div className="fixed right-0 top-16 bottom-0 w-80 bg-background border-l p-4 overflow-y-auto z-40">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Details</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedAsset(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Preview */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center mb-4">
              {selectedAsset.file_type === 'image' ? (
                <img
                  src={selectedAsset.file_url}
                  alt={selectedAsset.alt_text_en || selectedAsset.filename}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center">
                  {(() => {
                    const IconComponent = FILE_TYPE_ICONS[selectedAsset.file_type] || FileText;
                    return <IconComponent className="h-16 w-16 text-muted-foreground" />;
                  })()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-3 text-sm">
              <div>
                <Label className="text-muted-foreground">Filename</Label>
                <p className="truncate">{selectedAsset.original_filename}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p className="capitalize">{selectedAsset.file_type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Size</Label>
                <p>{formatFileSize(selectedAsset.file_size)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Folder</Label>
                <p className="capitalize">{selectedAsset.folder}</p>
              </div>
              {selectedAsset.alt_text_en && (
                <div>
                  <Label className="text-muted-foreground">Alt Text</Label>
                  <p>{selectedAsset.alt_text_en}</p>
                </div>
              )}
              {selectedAsset.credit && (
                <div>
                  <Label className="text-muted-foreground">Credit</Label>
                  <p>{selectedAsset.credit}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value={selectedAsset.file_url} 
                    readOnly 
                    className="text-xs"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => copyToClipboard(selectedAsset.file_url)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open(selectedAsset.file_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setDeleteId(selectedAsset.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>
              Upload images, videos, or other media files.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* File Input */}
            <div className="space-y-2">
              <Label>File</Label>
              {uploadPreview ? (
                <div className="relative">
                  <img
                    src={uploadPreview}
                    alt="Preview"
                    className="w-full h-40 object-contain bg-muted rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setUploadFile(null);
                      setUploadPreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : uploadFile ? (
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{uploadFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(uploadFile.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setUploadFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to select or drag and drop
                  </p>
                  <Input
                    type="file"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" asChild>
                    <label className="cursor-pointer">
                      Select File
                      <input
                        type="file"
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </Button>
                </div>
              )}
            </div>

            {/* Folder */}
            <div className="space-y-2">
              <Label>Folder</Label>
              <Select value={uploadFolder} onValueChange={setUploadFolder}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FOLDERS.map(folder => (
                    <SelectItem key={folder.value} value={folder.value}>
                      {folder.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Alt Text */}
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={uploadAltText}
                onChange={(e) => setUploadAltText(e.target.value)}
                placeholder="Description for accessibility"
              />
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Label>Caption (optional)</Label>
              <Input
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="Image caption"
              />
            </div>

            {/* Credit */}
            <div className="space-y-2">
              <Label>Credit (optional)</Label>
              <Input
                value={uploadCredit}
                onChange={(e) => setUploadCredit(e.target.value)}
                placeholder="Photographer or source"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#8c52ff] to-[#6111ff] text-white"
              onClick={handleUpload}
              disabled={!uploadFile || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The file will be permanently deleted from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
