import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ProductImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export default function ProductImageUpload({ images, onImagesChange }: ProductImageUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
        });
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} exceeds 5MB limit`,
        });
        continue;
      }

      try {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          onImagesChange([...images, result]);
          toast({
            title: "Success",
            description: `Image uploaded successfully`,
          });
        };
        reader.onerror = () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to read image file",
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload image",
        });
      }
    }

    setIsUploading(false);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="grid gap-4">
      <div>
        <Label>Product Images *</Label>
        <p className="text-sm text-muted-foreground mt-1 mb-3">
          Upload high-quality product images (JPG, PNG). Max 5MB per image.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2 py-4">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <p className="font-medium text-foreground">
              {isUploading ? "Uploading..." : "Click to upload images"}
            </p>
            <p className="text-sm text-muted-foreground">
              or drag and drop
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">
            {images.length} image{images.length !== 1 ? "s" : ""} uploaded
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden border border-border">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
