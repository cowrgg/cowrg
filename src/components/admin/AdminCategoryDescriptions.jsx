import React, { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ImageUpload from "@/components/admin/ImageUpload";

const CATEGORIES = ["سوهان", "شیرینی", "هدیه"];

export default function AdminCategoryDescriptions() {
  const [descs, setDescs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.CategoryDescription.list("-created_date", 50);
      const map = {};
      list.forEach((d) => {
        map[d.category] = d;
      });
      setDescs(map);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const update = (cat, field, value) =>
    setDescs((d) => ({ ...d, [cat]: { ...(d[cat] || {}), category: cat, [field]: value } }));

  const saveOne = async (cat) => {
    setSaving(cat);
    const item = descs[cat] || { category: cat, description: "", image_url: "" };
    try {
      if (item.id) {
        await base44.entities.CategoryDescription.update(item.id, { description: item.description, image_url: item.image_url || "" });
      } else {
        await base44.entities.CategoryDescription.create({ category: cat, description: item.description, image_url: item.image_url || "" });
      }
      toast({ title: "توضیحات ذخیره شد" });
      load();
    } catch {
      toast({ variant: "destructive", title: "خطا در ذخیره‌سازی" });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading text-xl font-bold">توضیحات دسته‌بندی‌ها</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        متن زیر هنگام انتخاب هر دسته، بالای صفحه محصولات نمایش داده می‌شود.
      </p>
      <div className="mt-6 space-y-5">
        {CATEGORIES.map((cat) => (
          <div key={cat} className="rounded-2xl border border-border bg-card p-4">
            <Label className="font-bold">{cat}</Label>
            <Textarea
              className="mt-2"
              rows={3}
              value={descs[cat]?.description || ""}
              onChange={(e) => update(cat, "description", e.target.value)}
              placeholder={`توضیحات دسته ${cat}...`}
            />
            <div className="mt-3">
              <ImageUpload value={descs[cat]?.image_url || ""} onChange={(v) => update(cat, "image_url", v)} placeholder="آدرس عکس دسته (https://...)" />
            </div>
            <div className="mt-2 flex justify-end">
              <Button size="sm" className="gap-1.5" onClick={() => saveOne(cat)} disabled={saving === cat}>
                {saving === cat ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                ذخیره
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}