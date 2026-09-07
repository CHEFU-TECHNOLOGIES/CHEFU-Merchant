"use client";

import { useEffect, useMemo, useState } from "react";
import { saveProduct } from "../merchant-api";
import { blankProduct, type Product, type ProductDraft, type Status } from "../merchant-types";
import type { MerchantRequest } from "../merchant-api";

export type CatalogSort = "updated" | "name" | "price" | "stock";

export function useCatalog(token: string | null, request: MerchantRequest) {
    const [products, setProducts] = useState<Product[]>([]);
    const [editing, setEditing] = useState<ProductDraft | null>(null);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState<Status | "ALL">("ALL");
    const [sort, setSort] = useState<CatalogSort>("updated");
    const [view, setView] = useState<"grid" | "table">("table");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    const filtered = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return products
            .filter(
                (product) =>
                    (status === "ALL" || product.status === status) &&
                    (!normalizedQuery ||
                        `${product.name} ${product.sku} ${product.category}`
                            .toLowerCase()
                            .includes(normalizedQuery)),
            )
            .sort((a, b) =>
                sort === "name"
                    ? a.name.localeCompare(b.name)
                    : sort === "price"
                        ? b.priceMinor - a.priceMinor
                        : sort === "stock"
                            ? a.inventoryQuantity - b.inventoryQuantity
                            : b.updatedAt.localeCompare(a.updatedAt),
            );
    }, [products, query, status, sort]);

    const metrics = useMemo(
        () => ({
            total: products.length,
            active: products.filter((product) => product.status === "ACTIVE").length,
            low: products.filter(
                (product) =>
                    product.inventoryQuantity > 0 &&
                    product.inventoryQuantity <= product.lowStockThreshold,
            ).length,
            out: products.filter(
                (product) =>
                    product.status === "OUT_OF_STOCK" ||
                    product.inventoryQuantity === 0,
            ).length,
            featured: products.filter((product) => product.featured).length,
        }),
        [products],
    );

    function startCreating() {
        setEditing({ ...blankProduct });
    }

    async function archive(product: Product) {
        try {
            await request(`/products/${product.id}`, { method: "DELETE" });
            await load();
        } catch {
            setError("Unable to archive product. Please try again.");
        }
    }

    async function save(draft: ProductDraft) {
        await saveProduct(request, draft);
        setEditing(null);
        await load();
    }

    return {
        products,
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
    };
}
