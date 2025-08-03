import { Upload, Sparkles, FileText } from "lucide-react";
import React from "react";

interface FeatureIconProps {
  type: "upload" | "generate" | "export";
}

const FeatureIcon = ({ type }: FeatureIconProps) => {
  const iconConfig = {
    upload: {
      Icon: Upload,
      gradient: "from-primary to-primary/70",
      description: "Upload your PDF",
    },
    generate: {
      Icon: Sparkles,
      gradient: "from-secondary to-secondary/70",
      description: "AI Magic Generation",
    },
    export: {
      Icon: FileText,
      gradient: "from-primary/80 to-secondary/80",
      description: "Export & Learn",
    },
  };

  // Add a check to prevent the app from crashing if the type is undefined
  if (!iconConfig[type]) {
    console.error(`Invalid FeatureIcon type: ${type}`);
    return null;
  }

  const { Icon, gradient } = iconConfig[type];

  return (
    <div className="group cursor-pointer">
      <div
        className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} 
                      flex items-center justify-center 
                      transition-all duration-300 
                      group-hover:scale-110 group-hover:rotate-12
                      shadow-lg group-hover:shadow-2xl
                      border border-white/10 group-hover:border-white/30`}
      >
        <Icon size={20} className="text-white drop-shadow-lg" />
      </div>
    </div>
  );
};

export default FeatureIcon;
