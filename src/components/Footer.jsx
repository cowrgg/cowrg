import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="ys-container py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">ی</span>
              <span className="font-heading text-lg font-bold">یاس صفا</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground [font-family:'Vazirmatn',_ui-sans-serif,_system-ui,_sans-serif]">تولیدکننده سوهان اصیل قم و انواع شیرینی‌های سنتی با بهترین مواد اولیه و بیش از چهل سال تجربه 
ارسال به سراسر کشور
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold">دسترسی سریع</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-foreground">محصولات</Link></li>
              <li><Link to="/cart" className="hover:text-foreground">سبد خرید</Link></li>
              <li><Link to="/#about" className="hover:text-foreground">درباره ما</Link></li>
              <li><Link to="/admin" className="hover:text-foreground">پنل مدیریت</Link></li>
            </ul>
          </div>

          <div id="contact">
            <h4 className="font-heading text-sm font-bold">تماس با ما</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> ۰۲۵۳-۸۸۷۵۳۷۹</li>
              <li className="flex items-center gap-2"><Instagram className="h-4 w-4 text-primary" /> sohan_yasesafa.com@</li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> قم، بلوار امام رضا(ع)، نبش شهرک صادقیه</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Intl.NumberFormat("fa-IR").format(1404)} یاس صفا — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>);

}