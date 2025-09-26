import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Upload } from "lucide-react";
import ImageGrid from "@/components/gallery/ImageGrid";
import ImageUploadForm from "@/components/gallery/ImageUploadForm";
import { useImages } from "@/hooks/useImages";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { uploadImage } = useImages();
  const { toast } = useToast();

  const handleUploadSubmit = async (data: any) => {
    try {
      await uploadImage(data.file, {
        title: data.title,
        description: data.description,
        category: data.category
      });
      
      toast({
        title: "Success!",
        description: "Your image has been uploaded successfully.",
      });
      
      setIsUploadOpen(false);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-purple-600" />
            <h1 className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            PromptWala
            </h1>
          </div>
          
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 rounded-full px-6">
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
              <ImageUploadForm 
                onSubmit={handleUploadSubmit}
                onCancel={() => setIsUploadOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Gallery */}
      <main>
        <ImageGrid />
      </main>
    </div>
  );
}