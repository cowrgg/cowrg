import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Image } from "@/components/ui/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const empty = {
  title: "",
  excerpt: "",
  content: "",
  image_url: "",
  author: "",
  category: "",
  published: false,
};

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    base44.entities.Article.list("-created_date", 100).then(setArticles).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };
  const openEdit = (a) => {
    setEditing(a);
    setForm({ ...empty, ...a });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await base44.entities.Article.update(editing.id, form);
        toast({ title: "مقاله ویرایش شد" });
      } else {
        await base44.entities.Article.create(form);
        toast({ title: "مقاله افزوده شد" });
      }
      setOpen(false);
      load();
    } catch {
      toast({ variant: "destructive", title: "خطا در ذخیره‌سازی" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a) => {
    if (!confirm(`حذف «${a.title}»؟`)) return;
    await base44.entities.Article.delete(a.id);
    toast({ title: "مقاله حذف شد" });
    load();
  };

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">مقالات ({articles.length})</h2>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> مقاله جدید
        </Button>
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : articles.length === 0 ? (
        <div className="mt-10 text-center text-sm text-muted-foreground">هنوز مقاله‌ای وجود ندارد.</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <div key={a.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                {a.image_url && (
                  <Image src={a.image_url} alt={a.title} className="h-full w-full object-cover" fittingType="fill" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold line-clamp-1">{a.title}</h3>
                  {a.published ? (
                    <Badge className="text-[10px] bg-primary">منتشر</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">پیش‌نویس</Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{a.category || "—"}</span>
                <div className="mt-auto flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => openEdit(a)}>
                    <Pencil className="h-3.5 w-3.5" /> ویرایش
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(a)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش مقاله" : "مقاله جدید"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="عنوان" required>
                <Input value={form.title} onChange={set("title")} required />
              </Field>
              <Field label="دسته">
                <Input value={form.category} onChange={set("category")} placeholder="مثلاً دستورپخت" />
              </Field>
            </div>
            <Field label="خلاصه">
              <Input value={form.excerpt} onChange={set("excerpt")} placeholder="توضیح کوتاه برای کارت مقاله" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="آدرس تصویر">
                <Input value={form.image_url} onChange={set("image_url")} placeholder="https://..." />
              </Field>
              <Field label="نویسنده">
                <Input value={form.author} onChange={set("author")} placeholder="نام نویسنده" />
              </Field>
            </div>
            <Field label="متن مقاله">
              <div className="overflow-hidden rounded-md border">
                <ReactQuill
                  theme="snow"
                  value={form.content}
                  onChange={(v) => setForm((f) => ({ ...f, content: v }))}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "blockquote"],
                      ["clean"],
                    ],
                  }}
                />
              </div>
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={set("published")} className="h-4 w-4 accent-primary" />
              منتشر شود
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">انصراف</Button>
              </DialogClose>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "ذخیره"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      {children}
    </div>
  );
}