"use client";

import { useState } from "react";
import {
    Archive,
    Boxes,
    Check,
    Grid2X2,
    List,
    LogOut,
    PackagePlus,
    Plus,
    Search,
    Star,
} from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { Metric } from "./Metric";
import { ProductCard } from "./ProductCard";
import { ProductTable } from "./ProductTable";
import { ProductStudio } from "./ProductStudio";
import { ThemeToggle } from "./ThemeToggle";
import { statusLabel, type Product, type Status } from "./merchant-types";
import type { useCatalog } from "./hooks/useCatalog";

export function MerchantDashboard({
    catalog,
    signOut,
}: {
    catalog: ReturnType<typeof useCatalog>;
    signOut: () => void;
}) {
    const [archiving, setArchiving] = useState<Product | null>(null);
    const {
        filtered,
        metrics,
        editing,
        setEditing,
        query,
        setQuery,
        status,
        setStatus,
        sort,
        setSort,
        view,
        setView,
        loading,
        error,
        startCreating,
        archive,
        save,
        request,
    } = catalog;

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="logo">CHEFU <span>MERCHANT</span></div>
                <p className="sidebar-caption">Commerce operations</p>
                <nav>
                    <a className="selected" href="#catalog"><Boxes size={17} /> Catalog</a>
                    <a href="#activity"><List size={17} /> Activity</a>
                </nav>
                <button className="logout" onClick={signOut}><LogOut size={16} /> Sign out</button>
            </aside>
            <main className="content">
                <header className="page-header">
                    <div>
                        <p className="eyebrow">Catalog</p>
                        <h1>Products</h1>
                        <p className="muted">Manage what customers see, buy, and receive.</p>
                    </div>
                    <div className="page-tools">
                        <ThemeToggle />
                        <button className="primary" onClick={startCreating}><Plus size={18} /> Add product</button>
                    </div>
                </header>
                <section className="metrics">
                    <Metric label="Total products" value={metrics.total} icon={<Boxes />} />
                    <Metric label="Active" value={metrics.active} icon={<Check />} tone="green" />
                    <Metric label="Low stock" value={metrics.low} icon={<PackagePlus />} tone="amber" />
                    <Metric label="Out of stock" value={metrics.out} icon={<Archive />} tone="red" />
                    <Metric label="Featured" value={metrics.featured} icon={<Star />} tone="cyan" />
                </section>
                <section className="catalog-panel">
                    <div className="toolbar">
                        <label className="search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, SKU, or category" /></label>
                        <div className="toolbar-actions">
                            <select value={status} onChange={(event) => setStatus(event.target.value as Status | "ALL")}>
                                <option value="ALL">All statuses</option>
                                {Object.entries(statusLabel).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                            </select>
                            <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
                                <option value="updated">Recently updated</option>
                                <option value="name">Name</option>
                                <option value="price">Highest price</option>
                                <option value="stock">Lowest stock</option>
                            </select>
                            <div className="view-toggle">
                                <button className={view === "table" ? "active" : ""} title="Table view" aria-label="Table view" onClick={() => setView("table")}><List size={17} /></button>
                                <button className={view === "grid" ? "active" : ""} title="Grid view" aria-label="Grid view" onClick={() => setView("grid")}><Grid2X2 size={17} /></button>
                            </div>
                        </div>
                    </div>
                    {error && <p className="error">{error}</p>}
                    {loading ? <div className="empty loading-state"><span className="skeleton-line" /><span className="skeleton-line short" /><span className="skeleton-line" /></div> : filtered.length === 0 ? (
                        <div className="empty"><Boxes size={28} /><strong>No products yet</strong><p>Create your first product to start managing your CHEFU catalog.</p><button className="secondary" onClick={startCreating}>Create product</button></div>
                    ) : view === "table" ? (
                        <ProductTable products={filtered} edit={setEditing} archive={async (product) => setArchiving(product)} />
                    ) : (
                        <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} edit={setEditing} />)}</div>
                    )}
                </section>
            </main>
            {editing && <ProductStudio initial={editing} close={() => setEditing(null)} request={request} save={save} />}
            {archiving && <ConfirmDialog title={`Archive ${archiving.name}?`} description="This product will be removed from the active catalog. You can restore it later if supported by your workflow." confirmLabel="Archive product" onCancel={() => setArchiving(null)} onConfirm={() => { const product = archiving; setArchiving(null); void archive(product); }} />}
        </div>
    );
}
