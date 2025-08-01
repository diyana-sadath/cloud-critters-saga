import { Upload, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useRef } from "react";

interface CloudUploadProps {
  onImageUpload: (file: File) => void;
  isProcessing?: boolean;
}

export const CloudUpload = ({ onImageUpload, isProcessing = false }: CloudUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold magic-gradient">
          What magical creature lives in your clouds?
        </h2>
        <p className="text-xl text-muted-foreground">
          Upload a photo of clouds and let our AI discover the hidden critters! ✨
        </p>
      </div>

      <Card 
        className={`
          relative border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer
          ${dragActive 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-border hover:border-primary/50 hover:bg-primary/5'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />
        
        {isProcessing ? (
          <div className="space-y-4">
            <Sparkles className="w-16 h-16 mx-auto text-magic-pink sparkle" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold magic-gradient">
                🔮 Finding magical creatures...
              </h3>
              <p className="text-muted-foreground">
                Our AI is scanning the clouds for hidden friends!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <Upload className="w-12 h-12 text-primary/60 cloud-float" />
              <Camera className="w-12 h-12 text-accent cloud-float-delayed" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Drop your cloud photo here
              </h3>
              <p className="text-muted-foreground">
                Or click to browse your files
              </p>
            </div>

            <Button className="cloud-button" size="lg">
              <Upload className="w-5 h-5 mr-2" />
              Choose Photo
            </Button>
          </div>
        )}
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>💡 <strong>Pro tip:</strong> Photos with fluffy, white clouds work best!</p>
      </div>
    </div>
  );
};