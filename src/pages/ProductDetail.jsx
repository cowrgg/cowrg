import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Minus, Plus, ChevronLeft, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cartContext";
import { formatToman } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setLoading(true);
    base44.entities.Product.get(id)
      .then(async (p) => {
        setProduct(p);
        const all = await base44.entities.Product.list("-created_date", 100);
        setRelated(all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="ys-container py-20"><div className="aspect-square w-full max-w-md animate-pulse rounded-2xl bg-secondary" /></div>;
  }

  if (!product) {
    return (
      <div className="ys-container py-20 text-center">
        <p className="text-muted-foreground">محصول یافت نشد.</p>
        <Button asChild className="mt-4"><Link to="/products">بازگشت به محصولات</Link></Button>
      </div>
    );
  }

  const addToCart = () => {
    addItem(product, qty);
    toast({ title: "به سبد اضافه شد", description: `${qty} عدد ${product.name}` });
  };

  return (
    <div className="ys-container py-10">
      {/* breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">خانه</Link>
        <ChevronLeft className="h-4 w-4" />
        <Link to="/products" className="hover:text-foreground">محصولات</Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-secondary">
          <Image src={product.image_url} alt={product.name} className="h-full w-full object-cover" fittingType="fill" />
          {product.badge && <Badge className="absolute right-4 top-4 bg-primary text-primary-foreground">{product.badge}</Badge>}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-primary">{product.category}</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-foreground">{product.name}</h1>
          {product.weight && <p className="mt-2 text-sm text-muted-foreground">وزن: {product.weight}</p>}

          <div className="mt-4 flex items-center gap-3">
            <span className="font-heading text-2xl font-bold text-foreground">{formatToman(product.price)}</span>
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs text-green-700"><Check className="h-4 w-4" /> موجود</span>
            ) : (
              <span className="text-xs text-destructive">ناموجود</span>
            )}
          </div>

          <p className="mt-5 text-base leading-8 text-muted-foreground">{product.description}</p>

          {/* quantity */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-border">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQty((q) => q + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
            <Button size="lg" className="flex-1 gap-2" onClick={addToCart} disabled={product.stock <= 0}>
              <ShoppingBag className="h-5 w-5" /> افزودن به سبد
            </Button>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => { addToCart(); navigate("/cart"); }}>خرید و تسویه</Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-bold">محصول‌های مشابه</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}