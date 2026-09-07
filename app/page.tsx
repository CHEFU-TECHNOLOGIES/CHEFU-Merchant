"use client";

import { useEffect, useMemo, useState } from "react";
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
import { beginSso, clearAccessToken, getAccessToken } from "./oauth";
import { createAdminRequest, saveProduct } from "./admin-api";
import {
    blankProduct,
    statusLabel,
    type Product,
    type ProductDraft,
    type Status,
} from "./admin-types";
import { Metric } from "./Metric";
import { ProductCard } from "./ProductCard";
import { ProductTable } from "./ProductTable";
import { ProductStudio } from "./ProductStudio";

export default function AdminPage() {
    const [token, setToken] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [editing, setEditing] = useState<ProductDraft | null>(null);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState<Status | "ALL">("ALL");
    const [sort, setSort] = useState("updated");
    const [view, setView] = useState<"grid" | "table">("table");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => setToken(getAccessToken()), []);
    const request = createAdminRequest(token);
    async function load() {
        setLoading(true);
        setError("");
        try {
            setProducts((await request("/products/admin")).products as Product[]);
        } catch (reason) {
            setError(
                reason instanceof Error ? reason.message : "Unable to load products.",
            );
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (token) void load();
    }, [token]);

    const filtered = useMemo(
        () =>
            products
                .filter(
                    (product) =>
                        (status === "ALL" || product.status === status) &&
                        (!query.trim() ||
                            `${product.name} ${product.sku} ${product.category}`
                                .toLowerCase()
                                .includes(query.trim().toLowerCase())),
                )
                .sort((a, b) =>
                    sort === "name"
                        ? a.name.localeCompare(b.name)
                        : sort === "price"
                            ? b.priceMinor - a.priceMinor
                            : sort === "stock"
                                ? a.inventoryQuantity - b.inventoryQuantity
                                : b.updatedAt.localeCompare(a.updatedAt),
                ),
        [products, query, status, sort],
    );
    const metrics = {
        total: products.length,
        active: products.filter((p) => p.status === "ACTIVE").length,
        low: products.filter(
            (p) =>
                p.inventoryQuantity > 0 && p.inventoryQuantity <= p.lowStockThreshold,
        ).length,
        out: products.filter(
            (p) => p.status === "OUT_OF_STOCK" || p.inventoryQuantity === 0,
        ).length,
        featured: products.filter((p) => p.featured).length,
    };

    if (!token)
        return (
            <main className="login">
                <section className="login-card">
                    <p className="eyebrow">CHEFU TECHNOLOGIES</p>
                    <h1>Product administration</h1>
                    <p>Manage the CHEFU physical product line with your CHEFU account.</p>
                    {error && <p className="error">{error}</p>}
                    <button className="primary" onClick={() => void beginSso()}>
                        Continue
                    </button>
                </section>
            </main>
        );
    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="logo">
                    CHEFU <span>ADMIN</span>
                </div>
                <p className="sidebar-caption">Commerce operations</p>
                <nav>
                    <a className="selected" href="#catalog">
                        <Boxes size={17} /> Catalog
                    </a>
                    <a href="#activity">
                        <List size={17} /> Activity
                    </a>
                </nav>
                <button
                    className="logout"
                    onClick={() => {
                        clearAccessToken();
                        setToken(null);
                    }}
                >
                    <LogOut size={16} /> Sign out
                </button>
            </aside>
            <main className="content">
                <header className="page-header">
                    <div>
                        <p className="eyebrow">Catalog</p>
                        <h1>Products</h1>
                        <p className="muted">
                            Manage what customers see, buy, and receive.
                        </p>
                    </div>
                    <button
                        className="primary"
                        onClick={() => setEditing({ ...blankProduct })}
                    >
                        <Plus size={18} /> Add product
                    </button>
                </header>
                <section className="metrics">
                    <Metric
                        label="Total products"
                        value={metrics.total}
                        icon={<Boxes />}
                    />
                    <Metric
                        label="Active"
                        value={metrics.active}
                        icon={<Check />}
                        tone="green"
                    />
                    <Metric
                        label="Low stock"
                        value={metrics.low}
                        icon={<PackagePlus />}
                        tone="amber"
                    />
                    <Metric
                        label="Out of stock"
                        value={metrics.out}
                        icon={<Archive />}
                        tone="red"
                    />
                    <Metric
                        label="Featured"
                        value={metrics.featured}
                        icon={<Star />}
                        tone="cyan"
                    />
                </section>
                <section className="catalog-panel">
                    <div className="toolbar">
                        <label className="search">
                            <Search size={17} />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search name, SKU, or category"
                            />
                        </label>
                        <div className="toolbar-actions">
                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value as Status | "ALL")
                                }
                            >
                                <option value="ALL">All statuses</option>
                                {Object.entries(statusLabel).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={sort}
                                onChange={(event) => setSort(event.target.value)}
                            >
                                <option value="updated">Recently updated</option>
                                <option value="name">Name</option>
                                <option value="price">Highest price</option>
                                <option value="stock">Lowest stock</option>
                            </select>
                            <div className="view-toggle">
                                <button
                                    className={view === "table" ? "active" : ""}
                                    title="Table view"
                                    onClick={() => setView("table")}
                                >
                                    <List size={17} />
                                </button>
                                <button
                                    className={view === "grid" ? "active" : ""}
                                    title="Grid view"
                                    onClick={() => setView("grid")}
                                >
                                    <Grid2X2 size={17} />
                                </button>
                            </div>
                        </div>
                    </div>
                    {error && <p className="error">{error}</p>}
                    {loading ? (
                        <div className="empty">Loading catalog...</div>
                    ) : filtered.length === 0 ? (
                        <div className="empty">
                            <Boxes size={28} />
                            <p>No products match this view.</p>
                            <button
                                className="secondary"
                                onClick={() => setEditing({ ...blankProduct })}
                            >
                                Add your first product
                            </button>
                        </div>
                    ) : view === "table" ? (
                        <ProductTable
                            products={filtered}
                            edit={setEditing}
                            archive={async (product) => {
                                if (!confirm(`Archive ${product.name}?`)) return;
                                await request(`/products/${product.id}`, { method: "DELETE" });
                                await load();
                            }}
                        />
                    ) : (
                        <div className="product-grid">
                            {filtered.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    edit={setEditing}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
            {editing && (
                <ProductStudio
                    initial={editing}
                    close={() => setEditing(null)}
                    request={request}
                    save={async (draft) => {
                        await saveProduct(request, draft);
                        setEditing(null);
                        await load();
                    }}
                />
            )}
        </div>
    );
}
