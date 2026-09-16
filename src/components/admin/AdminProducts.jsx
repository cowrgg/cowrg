import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Image } from "@/components/ui/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { formatToman } from "@/lib/format";
import { useToast } from "@/components/ui/use-toast";

const empty = { name: "", description: "", price: "", image_url: "", category: "سوهان", weight: "", stock: "", featured: false, badge: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    base44.entities.Product.list("-created_date", 100).then(setProducts).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...empty, ...p, price: p.price ?? "", stock: p.stock ?? "" }); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      featured: !!form.featured,
    };
    try {
      if (editing) {
        await base44.entities.Product.update(editing.id, payload);
        toast({ title: "محصول ویرایش شد" });
      } else {
        await base44.entities.Product.create(payload);
        toast({ title: "محصول افزوده شد" });
      }
      setOpen(false);
      load();
    } catch (err) {
      toast({ variant: "destructive", title: "خطا در ذخیره‌سازی" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!confirm(`حذف «${p.name}»؟`)) return;
    await base44.entities.Product.delete(p.id);
    toast({ title: "محصول حذف شد" });
    load();
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">محصولات ({products.length})</h2>
        <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> محصول جدید</Button>
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                <Image src={p.image_url} alt={p.name} className="h-full w-full object-cover" fittingType="fill" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold line-clamp-1">{p.name}</h3>
                  {p.featured && <Badge variant="secondary" className="text-[10px]">منتخب</Badge>}
                </div>
                <span className="text-xs text-muted-foreground">{p.category} • {formatToman(p.price)}</span>
                <div className="mt-auto flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /> ویرایش</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(p)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش محصول" : "محصول جدید"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="نام محصول" required><Input value={form.name} onChange={set("name")} required /></Field>
              <Field label="دسته‌بندی">
                <select value={form.category} onChange={set("category")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="سوهان">سوهان</option>
                  <option value="شیرینی">شیرینی</option>
                  <option value="هدیه">هدیه</option>
                </select>
              </Field>
            </div>
            <Field label="توضیحات"><Textarea value={form.description} onChange={set("description")} rows={3} /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="قیمت (تومان)" required><Input type="number" value={form.price} onChange={set("price")} required /></Field>
              <Field label="وزن"><Input value={form.weight} onChange={set("weight")} placeholder="مثلاً ۴۰۰ گرم" /></Field>
              <Field label="موجودی"><Input type="number" value={form.stock} onChange={set("stock")} /></Field>
            </div>
            <Field label="آدرس تصویر (URL)"><Input value={form.image_url} onChange={set("image_url")} placeholder="https://..." /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="برچسب (badge)"><Input value={form.badge} onChange={set("badge")} placeholder="پرفروش / ویژه" /></Field>
              <label className="flex items-center gap-2 pt-7 text-sm">
                <input type="checkbox" checked={form.featured} onChange={set("featured")} className="h-4 w-4 accent-primary" />
                محصول منتخب
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild><Button type="button" variant="outline">انصراف</Button></DialogClose>
              <Button type="submit" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "ذخیره"}</Button>
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