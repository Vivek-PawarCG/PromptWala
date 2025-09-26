import ImageCard from "./ImageCard";
import ImageModal from "./ImageModal";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Grid3X3, RefreshCw } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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

interface ImageGridProps {
  images: Image[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  incrementViews: (id: string) => void;
  onImageClick?: (image: Image) => void;
}

export default function ImageGrid({ 
  images,
  loading,
  error,
  refetch,
  incrementViews,
  onImageClick = () => {} 
}: ImageGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "weddings", label: "Weddings" },
    { value: "birthdays", label: "Birthdays" },
    { value: "couples", label: "Couples" },
    { value: "kids", label: "Kids" },
    { value: "babies", label: "Babies" },
    { value: "pre-wedding", label: "Pre-Wedding" },
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "others", label: "Others" }
  ];

  const filteredImages = images.filter(image => 
    selectedCategory === "all" || image.category === selectedCategory
  );

  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === "popular") {
      return b.likes - a.likes;
    }
    return 0;
  });

  const handleImageClick = (image: Image) => {
    incrementViews(image.id);
    setSelectedImage(image);
    setIsModalOpen(true);
    onImageClick(image);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading images..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading images</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50">
        {/* Filter Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Grid3X3 className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {sortedImages.length} images
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" onClick={refetch}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto p-6">
          {sortedImages.length === 0 ? (
            <div className="text-center py-12">
              <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
              <p className="text-gray-500">
                {selectedCategory === "all" 
                  ? "Be the first to upload an image!" 
                  : "No images in this category yet. Try a different filter or upload some images."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedImages.map((image) => (
                <ImageCard
                  key={image.id}
                  id={image.id}
                  title={image.title}
                  category={image.category}
                  imageUrl={image.image_url}
                  description={image.description || ""}
                  likes={image.likes}
                  views={image.views}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
