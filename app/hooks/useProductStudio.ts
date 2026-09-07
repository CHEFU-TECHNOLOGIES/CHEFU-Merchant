"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { uploadProductImage, type MerchantRequest } from "../merchant-api";
import { minorUnitsToInput, parseMoneyInput } from "../pricing";
import type { ProductDraft } from "../merchant-types";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function useProductStudio(
    initial: ProductDraft,
    request: MerchantRequest,
    save: (draft: ProductDraft) => Promise<void>,
) {
    const [draft, setDraft] = useState(initial);
    const [priceInput, setPriceInput] = useState(minorUnitsToInput(initial.priceMinor));
    const [compareAtInput, setCompareAtInput] = useState(
        minorUnitsToInput(initial.compareAtPriceMinor),
    );
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    function update<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
        setDraft((current) => ({ ...current, [key]: value }));
    }

    function updatePrice(value: string) {
        setPriceInput(value);
        const minorUnits = parseMoneyInput(value);
        if (minorUnits !== null) update("priceMinor", minorUnits);
    }

    function updateCompareAt(value: string) {
        setCompareAtInput(value);
        if (!value.trim()) {
            update("compareAtPriceMinor", undefined);
            return;
        }
        const minorUnits = parseMoneyInput(value);
        if (minorUnits !== null) update("compareAtPriceMinor", minorUnits);
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

    function updateVariantPrice(index: number, value: string) {
        const minorUnits = parseMoneyInput(value);
        if (minorUnits !== null) updateVariant(index, { priceMinor: minorUnits });
    }

    function validate() {
        if (!draft.name.trim()) return "Enter a product name.";
        if (!draft.sku.trim()) return "Enter a SKU.";
        if (!draft.slug.trim()) return "Enter a product slug.";
        if (parseMoneyInput(priceInput) === null) {
            return "Enter a valid price, for example 199.99.";
        }
        if (
            compareAtInput.trim() &&
            parseMoneyInput(compareAtInput) === null
        ) {
            return "Enter a valid compare-at price, for example 249.99.";
        }
        if (!Number.isInteger(draft.inventoryQuantity) || draft.inventoryQuantity < 0) {
            return "Inventory must be a whole number of zero or more.";
        }
        if (!Number.isInteger(draft.lowStockThreshold) || draft.lowStockThreshold < 0) {
            return "Low-stock threshold must be a whole number of zero or more.";
        }
        if (
            draft.compareAtPriceMinor !== undefined &&
            draft.compareAtPriceMinor < draft.priceMinor
        ) {
            return "Compare-at price must be higher than the selling price.";
        }
        return "";
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        setSaving(true);
        setError("");
        try {
            await save({ ...draft, currency: "ZAR" });
        } catch {
            setError("Unable to save product. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!IMAGE_TYPES.has(file.type)) {
            setError("Upload a PNG, JPG, or WEBP image.");
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            setError("Images must be 5 MB or smaller.");
            return;
        }
        setUploading(true);
        setError("");
        try {
            const uploaded = await uploadProductImage(request, file);
            update("thumbnail", uploaded.url);
            update("images", [
                {
                    url: uploaded.url,
                    publicId: uploaded.publicId,
                    alt: file.name,
                    sortOrder: 0,
                },
            ]);
        } catch {
            setError("Unable to upload image. Please try again.");
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    }

    function removeImage() {
        update("thumbnail", undefined);
        update("images", []);
    }

    return {
        draft,
        priceInput,
        compareAtInput,
        saving,
        uploading,
        error,
        fileRef,
        update,
        updatePrice,
        updateCompareAt,
        addVariant,
        updateVariant,
        updateVariantPrice,
        submit,
        uploadImage,
        removeImage,
        isDirty: JSON.stringify(draft) !== JSON.stringify(initial),
    };
}
