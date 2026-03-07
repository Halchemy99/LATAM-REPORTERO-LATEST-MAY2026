'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation, useUserRole } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, Image, X, Check, AlertCircle, FileImage } from 'lucide-react';
import { toast } from 'sonner';

export default function UploadPage() {
  const { t } = useTranslation();
  const { user, role, isLoading } = useUserRole();
  const router = useRouter();
  
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const canUpload = role === 'contributor' || role === 'editor' || role === 'admin';

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, []);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type.startsWith('image/')
    );
    if (selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles) => {
    const fileObjects = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...fileObjects]);
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('No files to upload');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    // Simulate upload completion
    setTimeout(() => {
      setFiles(prev => prev.map(f => ({ ...f, status: 'uploaded' })));
      setUploading(false);
      toast.success('Files uploaded successfully!');
    }, 2500);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  if (!canUpload) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-bold mb-2">Contributors Only</h2>
              <p className="text-muted-foreground mb-4">
                File upload is available for contributors, editors, and admins.
              </p>
              <Button onClick={() => router.push('/submit')}>Apply as Contributor</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <Upload className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Upload Files</h1>
              <p className="text-muted-foreground">Upload images for your articles</p>
            </div>
          </div>

          {/* Drop Zone */}
          <Card className="mb-6">
            <CardContent className="p-0">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`p-12 border-2 border-dashed rounded-lg text-center transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
              >
                <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Drop images here</h3>
                <p className="text-muted-foreground mb-4">or click to browse</p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-input"
                />
                <Label htmlFor="file-input">
                  <Button variant="outline" asChild>
                    <span>Select Files</span>
                  </Button>
                </Label>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: JPG, PNG, GIF, WebP (max 10MB each)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* File List */}
          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Files ({files.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="h-16 w-16 rounded overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'uploaded' && (
                        <div className="p-1 bg-green-100 rounded-full">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Upload Progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setFiles([])}
                    disabled={uploading}
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || files.every(f => f.status === 'uploaded')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Files'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
