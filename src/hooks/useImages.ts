import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabase';
import { Database } from '@/types/supabase';

type Image = Database['public']['Tables']['images']['Row'];
type ImageInsert = Database['public']['Tables']['images']['Insert'];

export function useImages() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, imageData: Omit<ImageInsert, 'image_url'>) => {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Insert image record
      const { data, error: insertError } = await supabase
        .from('images')
        .insert({
          ...imageData,
          image_url: publicUrl
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Add to local state
      setImages(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Upload failed');
    }
  };

  const incrementViews = async (id: string) => {
    try {
      const { data: currentImage } = await supabase
        .from('images')
        .select('views')
        .eq('id', id)
        .single();

      if (currentImage) {
        const { error } = await supabase
          .from('images')
          .update({ views: currentImage.views + 1 })
          .eq('id', id);

        if (error) throw error;

        // Update local state
        setImages(prev => prev.map(img => 
          img.id === id ? { ...img, views: img.views + 1 } : img
        ));
      }
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  const incrementLikes = async (id: string) => {
    try {
      const { data: currentImage } = await supabase
        .from('images')
        .select('likes')
        .eq('id', id)
        .single();

      if (currentImage) {
        const { error } = await supabase
          .from('images')
          .update({ likes: currentImage.likes + 1 })
          .eq('id', id);

        if (error) throw error;

        // Update local state
        setImages(prev => prev.map(img => 
          img.id === id ? { ...img, likes: img.likes + 1 } : img
        ));
      }
    } catch (err) {
      console.error('Error incrementing likes:', err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    loading,
    error,
    uploadImage,
    incrementViews,
    incrementLikes,
    refetch: fetchImages
  };
}