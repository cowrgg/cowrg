import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminOrders from "@/components/admin/AdminOrders";

const ADMIN_PIN = "yasadmin1404";
const AUTH_KEY = "yas_admin_auth";

export default function Admin() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === "ok");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const login = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      localStorage.setItem(AUTH_KEY, "ok");
      setAuthed(true);
    } else {
      setError(true);
    }
  };

  if (!authed) {
    return (
      <div className="ys-container flex min-h-[60vh] items-center justify-center py-16">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl border border-border bg-card p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-center font-heading text-2xl font-bold">پنل مدیریت</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">برای ورود کلمه عبور مدیریت را وارد کنید.</p>
          <div className="mt-6 space-y-1.5">
            <Label>کلمه عبور</Label>
            <Input type="password" value={pin} onChange={(e) => { setPin(e.target.value); setError(false); }} placeholder="••••••••" />
          </div>
          {error && <p className="mt-2 text-sm text-destructive">کلمه عبور نادرست است.</p>}
          <Button type="submit" className="mt-5 w-full">ورود</Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">کلمه عبور پیش‌فرض: yasadmin1404</p>
        </form>
      </div>
    );
  }

  return (
    <div className="ys-container py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">پنل مدیریت یاس صفا</h1>
          <p className="mt-1 text-sm text-muted-foreground">مدیریت محصولات و سفارش‌ها</p>
        </div>
        <Button variant="outline" onClick={() => { localStorage.removeItem(AUTH_KEY); setAuthed(false); }}>خروج</Button>
      </div>

      <Tabs defaultValue="orders" className="mt-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="orders">سفارش‌ها</TabsTrigger>
          <TabsTrigger value="products">محصولات</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-6"><AdminOrders /></TabsContent>
        <TabsContent value="products" className="mt-6"><AdminProducts /></TabsContent>
      </Tabs>
    </div>
  );
}