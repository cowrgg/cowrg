import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Truck, ShieldCheck, Heart } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";

const categories = [
{ key: "سوهان", label: "سوهان", desc: "اصیل و دست‌پخت" },
{ key: "شیرینی", label: "شیرینی", desc: "سنتی و خشک" },
{ key: "هدیه", label: "جعبه هدیه", desc: "بسته‌بندی ویژه" }];


export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.list("-created_date", 50).
    then(setProducts).
    finally(() => setLoading(false));
  }, []);

  const featured = products.filter((p) => p.featured).slice(0, 8);
  const showcase = featured.length ? featured : products.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/60 to-background">
        <div className="ys-container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="order-2 md:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" /> دست‌پخت اصیل قم از سال 1364
            </span>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
              طعمی که از قلب قم<br />
              <span className="text-primary">به خانه شما می‌رسد</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-8 text-muted-foreground">
              سوهان اصیل، شیرینی‌های سنتی و بسته‌بندی‌های هدیه یاس صفا را آنلاین سفارش دهید و در سراسر کشور تحویل بگیرید.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/products">مشاهده محصولات <ArrowLeft className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/#about">داستان ما</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              <Feature icon={<Truck className="h-5 w-5" />} text="ارسال به سراسر کشور" />
              <Feature icon={<ShieldCheck className="h-5 w-5" />} text="ضمانت کیفیت" />
              <Feature icon={<Heart className="h-5 w-5" />} text="مواد طبیعی" />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] border border-border shadow-xl shadow-primary/10">
              <Image
                src="https://media.base44.com/images/public/user_6aaaef99b908cff29f362be6/617defdb5_photo_29632432335_x.jpg"
                alt="سوهان یاس صفا"
                className="h-full w-full object-cover"
                fittingType="fill" />
              
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="ys-container py-14">
        <SectionTitle small="دسته‌بندی‌ها" title="از چه چیزی خوشتان می‌آید؟" />
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {categories.map((c) =>
          <Link
            key={c.key}
            to={`/products?category=${encodeURIComponent(c.key)}`}
            className="group flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
            
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Sparkles className="h-6 w-6" />
              </span>
              <h3 className="mt-2 font-heading text-lg font-bold">{c.label}</h3>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </Link>
          )}
        </div>
      </section>

      {/* Featured products */}
      <section className="ys-container py-6">
        <div className="flex items-end justify-between">
          <SectionTitle small="ویترین" title="محصول‌های منتخب" />
          <Button asChild variant="ghost" className="gap-1">
            <Link to="/products">همه محصولات <ArrowLeft className="h-4 w-4" /></Link>
          </Button>
        </div>

        {loading ?
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) =>
          <div key={i} className="aspect-square animate-pulse rounded-2xl bg-secondary" />
          )}
          </div> :

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {showcase.map((p) =>
          <ProductCard key={p.id} product={p} />
          )}
          </div>
        }
      </section>

      {/* About */}
      <section id="about" className="ys-container scroll-mt-24 py-16">
        <div className="grid items-center gap-10 rounded-3xl border border-border bg-secondary/30 p-8 md:grid-cols-2 md:p-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="https://media.base44.com/images/public/user_6aaaef99b908cff29f362be6/dae91e227_5803378244811081534.jpg"
              alt="کارگاه یاس صفا"
              className="h-full w-full object-cover"
              fittingType="fill" />
            
          </div>
          <div>
            <SectionTitle small="داستان ما" title="از یک کارگاه کوچک خانگی تا برند محبوب شما" />
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              یاس صفا از سال ۱۳۸۴ با هدف معرفی طعم اصیل سوهان قم آغاز به کار کرد. ما با استفاده از کره محلی، زعفران، پسته و شکر مرغوب، سوهانی ترد و خوش‌طعم تولید می‌کنیم که هر بار یادآور خاطره‌های شیرین خانه است.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-foreground/80">
              <li>• بدون افزودنی و نگه‌دارنده صنعتی</li>
              <li>• بسته‌بندی بهداشتی و مقاوم برای ارسال</li>
              <li>• امکان سفارش عمده و هدیه سازمانی</li>
            </ul>
          </div>
        </div>
      </section>
    </div>);

}

function Feature({ icon, text }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/60 px-2 py-3">
      <span className="text-primary">{icon}</span>
      <span className="text-xs font-medium text-foreground/80">{text}</span>
    </div>);

}

function SectionTitle({ small, title }) {
  return (
    <div>
      {small && <span className="text-sm font-medium text-primary">{small}</span>}
      <h2 className="mt-1 font-heading text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
    </div>);

}