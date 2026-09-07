export type Status = "ACTIVE" | "DRAFT" | "ARCHIVED" | "OUT_OF_STOCK";

export type Variant = {
    id: string;
    name: string;
    sku: string;
    priceMinor: number;
    inventoryQuantity: number;
    options: Record<string, string>;
};

export type ProductImage = {
    url: string;
    publicId?: string;
    alt: string;
    sortOrder: number;
};

export type Product = {
    id: string;
    name: string;
    slug: string;
    sku: string;
    category: string;
    priceMinor: number;
    compareAtPriceMinor?: number;
    currency: "ZAR";
    inventoryQuantity: number;
    lowStockThreshold: number;
    status: Status;
    featured: boolean;
    shortDescription: string;
    description: string;
    images: ProductImage[];
    thumbnail?: string;
    variants: Variant[];
    tags: string[];
    updatedAt: string;
};

export type ProductDraft = Omit<Product, "id" | "updatedAt" | "currency"> & {
    id?: string;
    currency?: "ZAR";
};

export const blankProduct: ProductDraft = {
    name: "",
    slug: "",
    sku: "",
    category: "Desk Accessories",
    priceMinor: 0,
    inventoryQuantity: 0,
    lowStockThreshold: 5,
    status: "ACTIVE",
    featured: false,
    shortDescription: "",
    description: "",
    images: [],
    variants: [],
    tags: [],
};

export const statusLabel: Record<Status, string> = {
    ACTIVE: "Active",
    DRAFT: "Draft",
    ARCHIVED: "Archived",
    OUT_OF_STOCK: "Out of stock",
};

export { formatZAR as money } from "./pricing";
