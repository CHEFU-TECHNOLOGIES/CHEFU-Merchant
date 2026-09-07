import { apiBase } from "./oauth";
import type { Product, ProductDraft } from "./merchant-types";

export function createMerchantRequest(token: string | null) {
    return async function request(path: string, init: RequestInit = {}) {
        if (!token) throw new Error("Sign-in required.");
        const response = await fetch(`${apiBase}${path}`, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "x-chefu-app": "merchant",
                ...(init.headers || {}),
            },
        });
        if (!response.ok) {
            const body = (await response.json().catch(() => null)) as {
                message?: string;
            } | null;
            throw new Error(body?.message || "Request failed.");
        }
        return response.json();
    };
}

export type MerchantRequest = ReturnType<typeof createMerchantRequest>;

export async function saveProduct(
    request: MerchantRequest,
    draft: ProductDraft,
) {
    return request(draft.id ? `/products/${draft.id}` : "/products", {
        method: draft.id ? "PUT" : "POST",
        body: JSON.stringify(draft),
    }) as Promise<Product>;
}

export async function uploadProductImage(
    request: MerchantRequest,
    file: File,
) {
    const imageBase64 = await toDataUrl(file);
    const response = await request("/products/upload-image", {
        method: "POST",
        body: JSON.stringify({ imageBase64, contentType: file.type, alt: file.name }),
    });
    return response as { url: string; publicId?: string };
}

function toDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Could not read image."));
        reader.readAsDataURL(file);
    });
}
