import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, X, Calendar, Copy } from "lucide-react";
import { useImages } from "@/hooks/useImages";
import { useToast } from "@/components/ui/use-toast";

interface Image {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string | null;
  likes: number;
  views: number;
  created_at: string;
}

interface ImageModalProps {
  image: Image | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ image, isOpen, onClose }: ImageModalProps) {
  const { incrementLikes } = useImages();
  const { toast } = useToast();

  if (!image) return null;

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      weddings: "bg-pink-100 text-pink-700",
      birthdays: "bg-yellow-100 text-yellow-700",
      couples: "bg-red-100 text-red-700",
      kids: "bg-blue-100 text-blue-700",
      babies: "bg-green-100 text-green-700",
      "pre-wedding": "bg-purple-100 text-purple-700",
      female: "bg-pink-100 text-pink-700",
      male: "bg-blue-100 text-blue-700",
      others: "bg-gray-100 text-gray-700"
    };
    return colors[cat] || colors.others;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = () => {
    incrementLikes(image.id);
  };

  const handleCopyDescription = () => {
    if (image?.description) {
      navigator.clipboard.writeText(image.description);
      toast({
        title: "Copied to clipboard!",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 flex flex-col bg-white">
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Image Section */}
          <div className="h-3/5 lg:h-full lg:flex-1 bg-black flex items-center justify-center relative">
            {/* <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button> */}
            <img
              src={image.image_url}
              alt={image.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-96 p-6 flex flex-col bg-white overflow-hidden h-2/5 lg:h-full">
            <div className="flex-1 overflow-y-auto">
              {/* Category Badge & Copy Button */}
              <div className="mb-4 flex items-center justify-between">
                <Badge className={`${getCategoryColor(image.category)} border-0 font-medium`}>
                  {image.category}
                </Badge>
                {image.description && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyDescription}
                    className="flex items-center text-gray-500 hover:text-gray-800"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Prompt 
                  </Button>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {image.title}
              </h2>

              {/* Description */}
              {image.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Image Prompt</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {image.description}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-gray-700 font-medium">{image.likes}</span>
                  <span className="text-gray-500 text-sm">likes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700 font-medium">{image.views}</span>
                  <span className="text-gray-500 text-sm">views</span>
                </div>
              </div>

              {/* Upload Date */}
              <div className="flex items-center space-x-2 mb-6 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Uploaded on {formatDate(image.created_at)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t pt-4">
              <Button
                onClick={handleLike}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                <Heart className="h-4 w-4 mr-2" />
                Like this image
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}