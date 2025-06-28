
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface DocumentUpload {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export const useDocumentProcessing = () => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<DocumentUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadAndProcessDocument = useCallback(async (file: File) => {
    if (!user) {
      toast.error('Please log in to upload documents');
      return;
    }

    const uploadId = Math.random().toString(36).substr(2, 9);
    const fileName = `${user.id}/${uploadId}_${file.name}`;

    // Add to uploads state
    const newUpload: DocumentUpload = {
      file,
      id: uploadId,
      progress: 0,
      status: 'uploading'
    };

    setUploads(prev => [...prev, newUpload]);
    setIsUploading(true);

    try {
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Update progress
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, progress: 50, status: 'processing' }
          : upload
      ));

      // Create document record
      const { data: document, error: docError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          filename: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: fileName,
          processing_status: 'pending'
        })
        .select()
        .single();

      if (docError) {
        throw docError;
      }

      // Trigger processing
      const { error: processError } = await supabase.functions
        .invoke('process-document', {
          body: {
            documentId: document.id,
            userId: user.id
          }
        });

      if (processError) {
        throw processError;
      }

      // Update progress
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, progress: 100, status: 'completed' }
          : upload
      ));

      toast.success(`Document "${file.name}" processed successfully`);

    } catch (error: any) {
      console.error('Error processing document:', error);
      
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, status: 'error', error: error.message }
          : upload
      ));

      toast.error(`Failed to process "${file.name}": ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }, [user]);

  const clearUploads = useCallback(() => {
    setUploads([]);
  }, []);

  const removeUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  }, []);

  return {
    uploads,
    isUploading,
    uploadAndProcessDocument,
    clearUploads,
    removeUpload
  };
};
