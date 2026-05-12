import { useLanguage } from "@/lib/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];

  return (
    <div className="flex items-center gap-2">
      <Globe size={18} className="text-gray-600" />
      <div className="flex gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
              language === lang.code
                ? "bg-secondary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title={lang.label}
          >
            {lang.flag}
          </button>
        ))}
      </div>
    </div>
  );
}
