"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

type Toast = { id: number; title: string; description?: string; tone?: "success" | "error" };
type ToastContextValue = { toast: (toast: Omit<Toast, "id">) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Toast[]>([]);
    function toast(item: Omit<Toast, "id">) {
        const id = Date.now() + Math.random();
        setItems((current) => [...current, { ...item, id }]);
        window.setTimeout(() => setItems((current) => current.filter((entry) => entry.id !== id)), 4200);
    }
    return <ToastContext.Provider value={{ toast }}>{children}<div className="ui-toaster" aria-live="polite" aria-atomic="true">{items.map((item) => <div className={`ui-toast ui-toast-${item.tone || "default"}`} key={item.id}><div><strong>{item.title}</strong>{item.description && <p>{item.description}</p>}</div><Button variant="ghost" size="icon" aria-label="Dismiss notification" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}><X size={15} /></Button></div>)}</div></ToastContext.Provider>;
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used inside ToastProvider");
    return context;
}
