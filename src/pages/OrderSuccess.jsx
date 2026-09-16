import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Package } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { formatToman } from "@/lib/format";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Order.get(id).then(setOrder).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="ys-container py-20 text-center text-muted-foreground">در حال بارگذاری...</div>;

  return (
    <div className="ys-container py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-5 font-heading text-2xl font-bold">سفارش شما ثبت شد!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          از خرید شما سپاسگزاریم. همکاران ما به‌زودی برای تأیید و هماهنگی ارسال با شما تماس می‌گیرند.
        </p>

        {order && (
          <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-5 text-right">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">شماره سفارش</span>
              <span className="font-mono font-bold">{order.id?.slice(-8).toUpperCase()}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">گیرنده</span>
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">تعداد اقلام</span>
              <span className="font-medium">{order.items?.reduce((s, i) => s + i.quantity, 0)} عدد</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="font-bold">مبلغ کل</span>
              <span className="font-heading text-lg font-bold text-primary">{formatToman(order.total)}</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <Package className="h-4 w-4 text-primary" /> آماده‌سازی و ارسال در کوتاه‌ترین زمان
        </div>

        <Button asChild className="mt-6"><Link to="/products">ادامه خرید</Link></Button>
      </div>
    </div>
  );
}