import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { SiInstagram, SiPinterest, SiFacebook, SiX, SiTiktok } from "react-icons/si";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  url?: string;
  description?: string;
}

export function SocialShare({ title, url, description }: SocialShareProps) {
  const { language } = useAppStore();
  const t = getTranslations(language);
  const { toast } = useToast();

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || "");

  const socialLinks = [
    {
      name: "Pinterest",
      icon: SiPinterest,
      color: "hover:bg-[#E60023] hover:text-white",
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    },
    {
      name: "TikTok",
      icon: SiTiktok,
      color: "hover:bg-black hover:text-white",
      onClick: () => {
        window.open("https://www.tiktok.com/@noreal51", "_blank");
        toast({
          title: "Visit our TikTok!",
          description: "Check out @noreal51 on TikTok",
        });
      },
    },
    {
      name: "Instagram",
      icon: SiInstagram,
      color: "hover:bg-gradient-to-tr hover:from-[#fd5] hover:via-[#f77] hover:to-[#c3f]",
      onClick: () => {
        window.open("https://www.instagram.com/noreen.nageh/", "_blank");
        toast({
          title: "Visit our Instagram!",
          description: "Check out @noreen.nageh on Instagram",
        });
      },
    },
    {
      name: "Facebook",
      icon: SiFacebook,
      color: "hover:bg-[#1877F2] hover:text-white",
      onClick: () => {
        window.open("https://www.facebook.com/profile.php?id=100072971241062", "_blank");
        toast({
          title: "Visit our Facebook!",
          description: "Follow us on Facebook",
        });
      },
    },
    {
      name: "X",
      icon: SiX,
      color: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
      url: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  const handleShare = (link: typeof socialLinks[0]) => {
    if (link.onClick) {
      link.onClick();
    } else if (link.url) {
      window.open(link.url, "_blank", "width=600,height=400");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          data-testid="button-share"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <div className="flex gap-1">
          {socialLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-10 transition-colors ${link.color}`}
                onClick={() => handleShare(link)}
                data-testid={`button-share-${link.name.toLowerCase()}`}
              >
                <link.icon className="h-5 w-5" />
              </Button>
            </motion.div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
