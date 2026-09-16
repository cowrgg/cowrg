import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useCart } from "@/lib/cartContext";

const navLinks = [
  { label: "خانه", to: "/" },
  { label: "محصولات", to: "/products" },
  { label: "درباره ما", to: "/#about" },
  { label: "تماس", to: "/#contact" },
];

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="ys-container flex h-16 items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">ی</span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-lg font-bold text-foreground">یاس صفا</span>
            <span className="text-[11px] text-muted-foreground">سوهان و شیرینی</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="ys-link-underline text-sm font-medium text-foreground/80 hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            onClick={() => navigate("/products")}
            aria-label="جستجو"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/cart")} aria-label="سبد خرید">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -left-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="منو">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="font-heading text-lg font-bold">یاس صفا</span>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon"><X className="h-5 w-5" /></Button>
                </SheetClose>
              </div>
              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <SheetClose asChild key={l.to}>
                    <Link to={l.to} className="rounded-lg px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground">
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}