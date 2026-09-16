import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cartContext";
import { formatToman } from "@/lib/format";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <Link to={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-secondary">
        <Image
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          fittingType="fill"
        />
        {product.badge && (
          <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground shadow-sm">
            {product.badge}
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-heading text-base font-bold text-foreground line-clamp-1 hover:text-primary">{product.name}</h3>
        </Link>
        {product.weight && <p className="mt-1 text-xs text-muted-foreground">{product.weight}</p>}
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">{product.description}</p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="font-heading text-sm font-bold text-foreground">{formatToman(product.price)}</span>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => addItem(product, 1)}
          >
            <ShoppingBag className="h-4 w-4" />
            افزودن
          </Button>
        </div>
      </div>
    </div>
  );
}