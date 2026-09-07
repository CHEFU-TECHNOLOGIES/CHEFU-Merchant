"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { uploadProductImage, type MerchantRequest } from "../merchant-api";
import type { ProductDraft } from "../merchant-types";

export function useProductStudio(
    initial: ProductDraft,
    request: MerchantRequest,
    save: (draft: ProductDraft) => Promise<void>,
) {
    const [draft, setDraft] = useState(initial);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    function update<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
        setDraft((current) => ({ ...current, [key]: value }));
    }

    function addVariant() {
        update("variants", [
            ...draft.variants,
            {
                id: crypto.randomUUID(),
                name: "Option",
                sku: `${draft.sku}-OPTION`,
                priceMinor: draft.priceMinor,
                inventoryQuantity: 0,
                options: {},
            },
        ]);
    }

    function updateVariant(
        index: number,
        patch: Partial<ProductDraft["variants"][number]>,
    ) {
        update(
            "variants",
            draft.variants.map((item, itemIndex) =>
                itemIndex === index ? { ...item, ...patch } : item,
            ),
        );
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            await save(draft);
        } catch (reason) {
            setError(
                reason instanceof Error ? reason.message : "Unable to save product.",
            );
        } finally {
            setSaving(false);
        }
    }

    async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            const url = await uploadProductImage(request, file);
            update("thumbnail", url);
            update("images", [{ url, alt: file.name, sortOrder: 0 }]);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Upload failed.");
        } finally {
            setUploading(false);
        }
    }

    return {
        draft,
        saving,
        uploading,
        error,
        fileRef,
        update,
        addVariant,
        updateVariant,
        submit,
        uploadImage,
    };
}
