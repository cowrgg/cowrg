import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, Calendar, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Article.get(id).then(setArticle).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="ys-container flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!article) {
    return <div className="ys-container py-24 text-center text-muted-foreground">مقاله یافت نشد.</div>;
  }

  return (
    <article className="ys-container py-10">
      <Link to="/articles" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowRight className="h-4 w-4" /> بازگشت به مقالات
      </Link>

      <div className="mx-auto mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {article.category && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{article.category}</span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(article.created_date).toLocaleDateString("fa-IR")}
          </span>
          {article.author && <span>• {article.author}</span>}
        </div>

        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight md:text-4xl">{article.title}</h1>
        {article.excerpt && <p className="mt-3 text-base text-muted-foreground">{article.excerpt}</p>}

        {article.image_url && (
          <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-secondary">
            <Image src={article.image_url} alt={article.title} className="h-full w-full object-cover" fittingType="fill" />
          </div>
        )}

        <div
          className="mt-8 max-w-none leading-8 text-foreground/90 [&_p]:mb-4 [&_h2]:mt-6 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_img]:rounded-xl [&_a]:text-primary [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: article.content || "" }}
        />
      </div>
    </article>
  );
}