import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Article.filter({ published: true }, "-created_date", 50).
    then(setArticles).
    finally(() => setLoading(false));
  }, []);

  return (
    <div className="ys-container py-12">
      <div className="text-center">
        <span className="text-sm font-medium text-primary">مقالات</span>
        <h1 className="mt-1 font-heading text-3xl font-bold md:text-4xl">مقالات یاس صفا</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          داستان‌ها، دستورپخت‌ها و نکته‌های پیرامون سوهان و شیرینی سنتی.
        </p>
      </div>

      {loading ?
      <div className="mt-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div> :
      articles.length === 0 ?
      <div className="mt-16 text-center text-muted-foreground">هنوز مقاله‌ای منتشر نشده است.</div> :

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) =>
        <Link
          key={a.id}
          to={`/articles/${a.id}`}
          className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
          
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                {a.image_url &&
            <Image
              src={a.image_url}
              alt={a.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              fittingType="fill" />

            }
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {a.category &&
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{a.category}</span>
              }
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(a.created_date).toLocaleDateString("fa-IR")}
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-lg font-bold line-clamp-2">{a.title}</h3>
                {a.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{a.excerpt}</p>}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  ادامه مطلب <ArrowLeft className="h-4 w-4" />
                </span>
              </div>
            </Link>
        )}
        </div>
      }
    </div>);

}