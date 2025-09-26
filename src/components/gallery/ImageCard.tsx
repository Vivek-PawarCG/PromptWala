import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye } from "lucide-react";

interface ImageCardProps {
  id?: string;
  title?: string;
  category?: string;
  imageUrl?: string;
  description?: string;
  likes?: number;
  views?: number;
  onClick?: () => void;
}

export default function ImageCard({
  id = "1",
  title = "Beautiful Sunset Wedding",
  category = "weddings",
  imageUrl = "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
  description = "A magical moment captured during golden hour",
  likes = 24,
  views = 156,
  onClick = () => {},
}: ImageCardProps) {
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
      others: "bg-gray-100 text-gray-700",
    };
    return colors[cat] || colors.others;
  };

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-0 bg-white"
      onClick={onClick}
    >
      <div className="relative overflow-hidden aspect-square bg-gray-100/50"> 
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <Badge
            className={`${getCategoryColor(category)} border-0 font-medium`}
          >
            {category}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{views}</span>
            </div>
          </div>
          <span className="text-xs text-gray-400">2 hours ago</span>
        </div>
      </CardContent>
    </Card>
  );
}
