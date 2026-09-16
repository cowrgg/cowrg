import React, { useEffect, useState } from "react";
import { Loader2, Eye } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { formatToman } from "@/lib/format";
import { useToast } from "@/components/ui/use-toast";

const statusOptions = [
  { value: "pending", label: "در انتظار", color: "bg-amber-100 text-amber-800" },
  { value: "processing", label: "در حال آماده‌سازی", color: "bg-blue-100 text-blue-800" },
  { value: "shipped", label: "ارسال شده", color: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "تحویل شده", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "لغو شده", color: "bg-red-100 text-red-800" },
];

const statusMeta = (v) => statusOptions.find((s) => s.value === v) || statusOptions[0];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    base44.entities.Order.list("-created_date", 100).then(setOrders).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await base44.entities.Order.update(id, { status });
    toast({ title: "وضعیت سفارش به‌روزرسانی شد" });
    load();
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold">سفارش‌ها ({orders.length})</h2>

      {loading ? (
        <div className="mt-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">هنوز سفارشی ثبت نشده است.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-right text-muted-foreground">
              <tr>
                <th className="p-3 font-medium">کد</th>
                <th className="p-3 font-medium">مشتری</th>
                <th className="hidden p-3 font-medium sm:table-cell">شهر</th>
                <th className="p-3 font-medium">مبلغ</th>
                <th className="p-3 font-medium">وضعیت</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-secondary/30">
                  <td className="p-3 font-mono text-xs">{o.id?.slice(-6).toUpperCase()}</td>
                  <td className="p-3 font-medium">{o.customer_name}</td>
                  <td className="hidden p-3 text-muted-foreground sm:table-cell">{o.city}</td>
                  <td className="p-3 font-bold">{formatToman(o.total)}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusMeta(o.status).color}`}>{statusMeta(o.status).label}</span>
                  </td>
                  <td className="p-3">
                    <Button size="sm" variant="ghost" className="gap-1" onClick={() => setSelected(o)}><Eye className="h-4 w-4" /> جزئیات</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>جزئیات سفارش {selected.id?.slice(-6).toUpperCase()}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-secondary/30 p-4">
                  <Info label="مشتری" value={selected.customer_name} />
                  <Info label="تماس" value={selected.phone} />
                  <Info label="شهر" value={selected.city} />
                  <Info label="کد پستی" value={selected.postal_code || "—"} />
                  <div className="col-span-2"><Info label="نشانی" value={selected.address} /></div>
                  {selected.note && <div className="col-span-2"><Info label="یادداشت" value={selected.note} /></div>}
                </div>

                <div className="rounded-xl border border-border p-4">
                  <h4 className="font-bold">اقلام</h4>
                  <div className="mt-3 space-y-2">
                    {selected.items?.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-muted-foreground">{i.name} × {i.quantity}</span>
                        <span className="font-medium">{formatToman(i.price * i.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 space-y-1 border-t border-border pt-3">
                    <div className="flex justify-between text-muted-foreground"><span>ارسال</span><span>{formatToman(selected.shipping_cost)}</span></div>
                    <div className="flex justify-between font-bold"><span>مبلغ کل</span><span className="text-primary">{formatToman(selected.total)}</span></div>
                  </div>
                </div>

                <div>
                  <Label>تغییر وضعیت</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {statusOptions.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => updateStatus(selected.id, s.value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                          selected.status === s.value ? "bg-primary text-primary-foreground" : "border border-border hover:border-primary/40"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <span className="text-xs text-muted-foreground">{label}</span>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}

function Label({ children }) {
  return <span className="text-xs text-muted-foreground">{children}</span>;
}