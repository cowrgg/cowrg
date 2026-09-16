import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cartContext";
import { formatToman, SHIPPING_COST } from "@/lib/format";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, clear } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="ys-container flex flex-col items-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <ShoppingBag className="h-9 w-9" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold">سبد خرید شما خالی است</h1>
        <p className="mt-2 text-muted-foreground">هنوز محصولی به سبد اضافه نکرده‌اید.</p>
        <Button asChild className="mt-6 gap-2"><Link to="/products">مشاهده محصولات <ArrowLeft className="h-4 w-4" /></Link></Button>
      </div>
    );
  }

  const total = subtotal + SHIPPING_COST;

  return (
    <div className="ys-container py-10">
      <h1 className="font-heading text-3xl font-bold">سبد خرید</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* items */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4">
                <Link to={`/products/${item.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                  <Image src={item.image_url} alt={item.name} className="h-full w-full object-cover" fittingType="fill" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/products/${item.id}`} className="font-heading font-bold hover:text-primary">{item.name}</Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatToman(item.price)}</span>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-border">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3.5 w-3.5" /></Button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3.5 w-3.5" /></Button>
                    </div>
                    <span className="font-heading font-bold">{formatToman(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="mt-3 text-muted-foreground" onClick={clear}>پاک کردن سبد</Button>
        </div>

        {/* summary */}
        <div className="h-fit rounded-2xl border border-border bg-secondary/30 p-6">
          <h2 className="font-heading text-lg font-bold">خلاصه سفارش</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Row label="جمع کالاها" value={formatToman(subtotal)} />
            <Row label="هزینه ارسال" value={formatToman(SHIPPING_COST)} />
            <div className="border-t border-border pt-3">
              <Row label="مبلغ قابل پرداخت" value={formatToman(total)} bold />
            </div>
          </div>
          <Button size="lg" className="mt-6 w-full gap-2" onClick={() => navigate("/checkout")}>
            ادامه و تسویه حساب <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">ارسال به سراسر کشور با هزینه ثابت</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-bold text-foreground" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "font-heading text-lg font-bold text-primary" : "font-medium text-foreground"}>{value}</span>
    </div>
  );
}