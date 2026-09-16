import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cartContext";
import { formatToman, SHIPPING_COST } from "@/lib/format";
import { useToast } from "@/components/ui/use-toast";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ customer_name: "", phone: "", address: "", city: "", postal_code: "", note: "" });

  const total = subtotal + SHIPPING_COST;

  if (items.length === 0) {
    return (
      <div className="ys-container py-24 text-center">
        <p className="text-muted-foreground">سبد خرید شما خالی است.</p>
        <Button asChild className="mt-4"><a href="/products">مشاهده محصولات</a></Button>
      </div>
    );
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.phone || !form.address || !form.city) {
      toast({ variant: "destructive", title: "لطفاً همه فیلدهای ضروری را پر کنید" });
      return;
    }
    setSubmitting(true);
    try {
      const order = await base44.entities.Order.create({
        ...form,
        items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, image_url: i.image_url })),
        subtotal,
        shipping_cost: SHIPPING_COST,
        total,
        status: "pending",
        payment_status: "unpaid",
      });
      clear();
      navigate(`/order-success/${order.id}`);
    } catch (err) {
      toast({ variant: "destructive", title: "ثبت سفارش ناموفق بود", description: "لطفاً دوباره تلاش کنید" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ys-container py-10">
      <h1 className="font-heading text-3xl font-bold">تسویه حساب</h1>
      <p className="mt-2 text-sm text-muted-foreground">اطبق پستی خود را وارد کنید تا سفارش ثبت شود.</p>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* form */}
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام و نام خانوادگی" required>
              <Input value={form.customer_name} onChange={set("customer_name")} placeholder="مثلاً مریم رضایی" />
            </Field>
            <Field label="شماره تماس" required>
              <Input value={form.phone} onChange={set("phone")} placeholder="۰۹۱۲۳۴۵۶۷۸۹" inputMode="tel" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="استان / شهر" required>
              <Input value={form.city} onChange={set("city")} placeholder="مثلاً تهران" />
            </Field>
            <Field label="کد پستی">
              <Input value={form.postal_code} onChange={set("postal_code")} placeholder="کد ۱۰ رقمی" inputMode="numeric" />
            </Field>
          </div>
          <Field label="نشانی کامل" required>
            <Textarea value={form.address} onChange={set("address")} placeholder="خیابان، کوچه، پلاک، واحد..." rows={3} />
          </Field>
          <Field label="توضیحات سفارش (اختیاری)">
            <Textarea value={form.note} onChange={set("note")} placeholder="هر نکته‌ای که لازم است بدانیم..." rows={2} />
          </Field>
        </div>

        {/* summary */}
        <div className="h-fit rounded-2xl border border-border bg-secondary/30 p-6">
          <h2 className="font-heading text-lg font-bold">خلاصه سفارش</h2>
          <div className="mt-4 max-h-56 space-y-3 overflow-auto pl-1">
            {items.map((i) => (
              <div key={i.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{i.name} × {i.quantity}</span>
                <span className="font-medium">{formatToman(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">جمع کالاها</span><span>{formatToman(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">هزینه ارسال</span><span>{formatToman(SHIPPING_COST)}</span></div>
            <div className="flex justify-between border-t border-border pt-2"><span className="font-bold">مبلغ کل</span><span className="font-heading text-lg font-bold text-primary">{formatToman(total)}</span></div>
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full gap-2" disabled={submitting}>
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ArrowLeft className="h-4 w-4" /> ثبت سفارش</>}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">با ثبت سفارش، همکاران ما برای تأیید و پرداخت با شما تماس می‌گیرند.</p>
        </div>
      </form>
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