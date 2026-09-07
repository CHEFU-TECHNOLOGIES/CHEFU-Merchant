"use client";

import { useState, type ReactNode } from "react";
import { ImagePlus, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";
import { statusLabel, type ProductDraft, type Status } from "./merchant-types";
import type { MerchantRequest } from "./merchant-api";
import { formatZAR } from "./pricing";
import { useProductStudio } from "./hooks/useProductStudio";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

export function ProductStudio({ initial, close, save, request }: { initial: ProductDraft; close: () => void; save: (draft: ProductDraft) => Promise<void>; request: MerchantRequest }) {
    const studio = useProductStudio(initial, request, async (draft) => {
        await save(draft);
        toast.success(initial.id ? "Product updated" : "Product created");
    });
    const [discarding, setDiscarding] = useState(false);
    const image = studio.draft.thumbnail || studio.draft.images[0]?.url;
    const closeStudio = () => studio.isDirty ? setDiscarding(true) : close();

    return <div className="overlay" role="presentation">
        <section className="studio" role="dialog" aria-modal="true" aria-labelledby="studio-title">
            <header className="studio-header">
                <div><p className="eyebrow">Product Studio</p><h2 id="studio-title">{studio.draft.id ? "Edit product" : "Create product"}</h2><p className="studio-subtitle">Build a complete, customer-ready listing.</p></div>
                <Button variant="ghost" size="icon" type="button" onClick={closeStudio} aria-label="Close product studio"><X /></Button>
            </header>
            <form onSubmit={studio.submit}>
                <div className="studio-body">
                    <section className="studio-section"><SectionHeading title="Basic information" hint="Required details for your catalog" /><div className="studio-fields">
                        <Field label="Product name" required hint="Shown to customers"><Input required autoFocus value={studio.draft.name} onChange={(event) => { const name = event.target.value; studio.update("name", name); if (!studio.draft.id) studio.update("slug", name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }} /></Field>
                        <div className="two-col"><Field label="SKU" required hint="Unique stock keeping unit"><Input required value={studio.draft.sku} onChange={(event) => studio.update("sku", event.target.value.toUpperCase())} /></Field><Field label="Category" required><Input required value={studio.draft.category} onChange={(event) => studio.update("category", event.target.value)} /></Field></div>
                        <Field label="Slug" required hint="Lowercase letters, numbers, and hyphens"><Input required value={studio.draft.slug} onChange={(event) => studio.update("slug", event.target.value.toLowerCase())} /></Field>
                        <Field label="Short description" hint="Optional summary for product cards"><Input value={studio.draft.shortDescription} onChange={(event) => studio.update("shortDescription", event.target.value)} /></Field>
                        <Field label="Description" hint="Optional detail about the product"><Textarea rows={5} value={studio.draft.description} onChange={(event) => studio.update("description", event.target.value)} /></Field>
                    </div></section>
                    <section className="studio-section"><SectionHeading title="Product media" hint="Add a clear primary image" />{image ? <div className="media-preview"><img src={image} alt={studio.draft.images[0]?.alt || studio.draft.name || "Product preview"} /><div className="media-actions"><Button variant="secondary" type="button" disabled={studio.uploading} onClick={() => studio.fileRef.current?.click()}><Upload size={15} /> Replace image</Button><Button variant="ghost" type="button" className="quiet-danger" onClick={studio.removeImage}><Trash2 size={15} /> Remove</Button></div></div> : <Button variant="outline" type="button" className="upload-zone" disabled={studio.uploading} onClick={() => studio.fileRef.current?.click()}>{studio.uploading ? <Upload className="spin" size={22} /> : <ImagePlus size={22} />}<strong>{studio.uploading ? "Uploading image..." : "Upload product image"}</strong><small>PNG, JPG, or WEBP, up to 5 MB</small></Button>}<input ref={studio.fileRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={studio.uploadImage} /></section>
                    <section className="studio-section"><SectionHeading title="Pricing" hint="Prices are stored precisely in ZAR minor units" /><div className="two-col"><MoneyField label="Selling price" required value={studio.priceInput} onChange={studio.updatePrice} hint={studio.priceInput ? `Customer price: ${formatZAR(studio.draft.priceMinor)}` : "Enter an amount such as 199.99"} /><MoneyField label="Compare-at price" value={studio.compareAtInput} onChange={studio.updateCompareAt} hint="Optional original price" /></div></section>
                    <section className="studio-section"><SectionHeading title="Inventory" hint="Track stock and low-stock warnings" /><div className="two-col"><Field label="Stock quantity" required><Input required type="number" min="0" step="1" value={studio.draft.inventoryQuantity} onChange={(event) => studio.update("inventoryQuantity", Number(event.target.value))} /></Field><Field label="Low-stock threshold" required hint="Warn when stock reaches this number"><Input required type="number" min="0" step="1" value={studio.draft.lowStockThreshold} onChange={(event) => studio.update("lowStockThreshold", Number(event.target.value))} /></Field></div></section>
                    <section className="studio-section"><SectionHeading title="Variants" hint="Optional variations with their own pricing and stock" />{studio.draft.variants.length > 0 && <div className="variant-list">{studio.draft.variants.map((variant, index) => <div className="variant-row" key={variant.id}><Input aria-label={`Variant ${index + 1} name`} placeholder="Variant name" value={variant.name} onChange={(event) => studio.updateVariant(index, { name: event.target.value })} /><MoneyField label="" compact value={formatMinorInput(variant.priceMinor)} onChange={(value) => studio.updateVariantPrice(index, value)} /><Input aria-label={`Variant ${index + 1} stock`} type="number" min="0" step="1" placeholder="Stock" value={variant.inventoryQuantity} onChange={(event) => studio.updateVariant(index, { inventoryQuantity: Number(event.target.value) })} /></div>)}</div>}<Button variant="secondary" type="button" onClick={studio.addVariant}><Plus size={15} /> Add variant</Button></section>
                    <section className="studio-section studio-section-last"><SectionHeading title="Publishing" hint="Control how this product appears in your store" /><div className="two-col"><Field label="Product status" required><Select value={studio.draft.status} onValueChange={(value) => studio.update("status", value as Status)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(statusLabel).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent></Select></Field><label className="check"><Checkbox checked={studio.draft.featured} onCheckedChange={(checked) => studio.update("featured", checked === true)} /><span><strong>Featured product</strong><small>Highlight on the storefront</small></span></label></div></section>
                </div>
                <div className="studio-footer"><div aria-live="polite">{studio.error && <p className="error">{studio.error}</p>}</div><div className="footer-actions"><Button variant="secondary" type="button" onClick={closeStudio}>Cancel</Button><Button type="submit" disabled={studio.saving || studio.uploading}>{studio.saving ? "Saving product..." : "Save product"}</Button></div></div>
            </form>
        </section>
        {discarding && <ConfirmDialog title="Discard unsaved changes?" description="Your changes will be lost if you leave the Product Studio now." confirmLabel="Discard changes" onCancel={() => setDiscarding(false)} onConfirm={close} />}
    </div>;
}

function formatMinorInput(minor: number) { return (minor / 100).toFixed(2); }
function SectionHeading({ title, hint }: { title: string; hint: string }) { return <div className="section-heading"><div><h3>{title}</h3><p>{hint}</p></div><span className="section-rule" /></div>; }
function MoneyField({ label, value, onChange, hint, required = false, compact = false }: { label: string; value: string; onChange: (value: string) => void; hint?: string; required?: boolean; compact?: boolean }) { return <Field label={label} required={required} hint={hint} compact={compact}><div className="money-input"><span>R</span><Input aria-label={label || "Variant price"} required={required} inputMode="decimal" placeholder="0.00" value={value} onChange={(event) => onChange(event.target.value)} /></div></Field>; }
function Field({ label, children, required = false, hint, compact = false }: { label: string; children: ReactNode; required?: boolean; hint?: string; compact?: boolean }) { return <Label className={`field${compact ? " field-compact" : ""}`}><span className="field-label">{label}{required && <b aria-hidden="true"> *</b>}</span>{children}{hint && <small className="field-hint">{hint}</small>}</Label>; }
