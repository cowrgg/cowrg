import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Image } from "@/components/ui/image";
import ProductCardItem from "@/components/ProductCard";

const categoryTabs = ["همه", "سوهان", "شیرینی", "هدیه"];

const DEFAULT_CATEGORY_IMAGE =
  "https://media.base44.com/images/public/6aaaf01300921c790a2a6565/6a698d115_generated_image.png";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [descs, setDescs] = useState({});

  const activeCategory = searchParams.get("category") || "همه";
  const catData = descs[activeCategory];

  useEffect(() => {
    base44.entities.Product.list("-created_date", 100)
      .then(setProducts)
      .finally(() => setLoading(false));
    base44.entities.CategoryDescription.list("-created_date", 50).then((list) => {
      const map = {};
      list.forEach((d) => {
        map[d.category] = d;
      });
      setDescs(map);
    });
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === "همه" || p.category === activeCategory;
      const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || (p.description || "").includes(query);
      return matchCat && matchQuery;
    });
  }, [products, activeCategory, query]);

  const setCategory = (c) => {
    if (c === "همه") setSearchParams({});
    else setSearchParams({ category: c });
  };

  return (
    <div className="ys-container py-10">
      <div className="text-center">
        <span className="text-sm font-medium text-primary">ویترین فروشگاه</span>
        <h1 className="mt-1 font-heading text-3xl font-bold md:text-4xl">محصولات یاس صفا</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          از میان انواع سوهان و شیرینی‌های سنتی انتخاب کنید و به سبد خود اضافه نمایید.
        </p>
      </div>

      {activeCategory !== "همه" && (
        <section className="mt-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 min-h-[220px] rounded-2xl border border-border bg-card p-6">
              <p className="text-sm leading-8 text-muted-foreground">
                {catData?.description || "در حال آماده‌سازی توضیحات این دسته هستیم."}
              </p>
            </div>
            <div className="min-h-[220px] overflow-hidden border border-border bg-secondary">
              <Image
                src={catData?.image_url || DEFAULT_CATEGORY_IMAGE}
                alt={activeCategory}
                className="h-full w-full object-cover"
                fittingType="fill"
              />
            </div>
          </div>
        </section>
      )}

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categoryTabs.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی محصول..."
            className="pr-9"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-2xl bg-secondary" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-16 text-center text-muted-foreground">محصولی یافت نشد.</div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCardItem key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}