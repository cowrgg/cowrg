import React, { useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image } from "@/components/ui/image";
import { useToast } from "@/components/ui/use-toast";

export default function ImageUpload({ value, onChange, placeholder = "https://..." }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await base44.integrations.Core.UploadPublicFile({ file });
      onChange(res.file_url);
      toast({ title: "تصویر بارگذاری شد" });
    } catch {
      toast({ variant: "destructive", title: "بارگذاری تصویر ناموفق بود" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} dir="ltr" />
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <Button type="button" variant="outline" size="icon" onClick={() => inputRef.current?.click()} disabled={uploading} title="بارگذاری از دستگاه">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </div>
      {value && (
        <div className="relative inline-block">
          <div className="h-20 w-20 overflow-hidden rounded-lg border border-border bg-secondary">
            <Image src={value} alt="پیش‌نمایش" className="h-full w-full object-cover" fittingType="fill" />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
            title="حذف تصویر"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}