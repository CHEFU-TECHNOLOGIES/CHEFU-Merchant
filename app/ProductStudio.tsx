import { Plus, Upload, X } from "lucide-react";
import { type ReactNode } from "react";
import { statusLabel, type ProductDraft, type Status } from "./admin-types";
import type { AdminRequest } from "./admin-api";
import { useProductStudio } from "./hooks/useProductStudio";

export function ProductStudio({
    initial,
    close,
    save,
    request,
}: {
    initial: ProductDraft;
    close: () => void;
    save: (draft: ProductDraft) => Promise<void>;
    request: AdminRequest;
}) {
    const studio = useProductStudio(initial, request, save);
    const {
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
    } = studio;

    return (
        <div className="overlay">
            <section className="studio">
                <header>
                    <div>
                        <p className="eyebrow">Product studio</p>
                        <h2>{draft.id ? "Edit product" : "New product"}</h2>
                    </div>
                    <button className="icon-button" onClick={close}>
                        <X />
                    </button>
                </header>
                <form onSubmit={submit}>
                    <div className="studio-grid">
                        <div className="form-section">
                            <h3>Product details</h3>
                            <Field label="Name">
                                <input
                                    required
                                    value={draft.name}
                                    onChange={(event) => {
                                        update("name", event.target.value);
                                        if (!draft.id) {
                                            update(
                                                "slug",
                                                event.target.value
                                                    .toLowerCase()
                                                    .replace(/[^a-z0-9]+/g, "-")
                                                    .replace(/^-|-$/g, ""),
                                            );
                                        }
                                    }}
                                />
                            </Field>
                            <div className="two-col">
                                <Field label="SKU">
                                    <input
                                        required
                                        value={draft.sku}
                                        onChange={(event) =>
                                            update("sku", event.target.value.toUpperCase())
                                        }
                                    />
                                </Field>
                                <Field label="Category">
                                    <input
                                        required
                                        value={draft.category}
                                        onChange={(event) =>
                                            update("category", event.target.value)
                                        }
                                    />
                                </Field>
                            </div>
                            <Field label="Slug">
                                <input
                                    required
                                    value={draft.slug}
                                    onChange={(event) => update("slug", event.target.value)}
                                />
                            </Field>
                            <Field label="Short description">
                                <input
                                    value={draft.shortDescription}
                                    onChange={(event) =>
                                        update("shortDescription", event.target.value)
                                    }
                                />
                            </Field>
                            <Field label="Description">
                                <textarea
                                    rows={5}
                                    value={draft.description}
                                    onChange={(event) =>
                                        update("description", event.target.value)
                                    }
                                />
                            </Field>
                        </div>
                        <div className="form-section">
                            <h3>Price and inventory</h3>
                            <div className="two-col">
                                <Field label="Price (cents)">
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={draft.priceMinor}
                                        onChange={(event) =>
                                            update("priceMinor", Number(event.target.value))
                                        }
                                    />
                                </Field>
                                <Field label="Compare-at (cents)">
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={draft.compareAtPriceMinor || ""}
                                        onChange={(event) =>
                                            update(
                                                "compareAtPriceMinor",
                                                event.target.value
                                                    ? Number(event.target.value)
                                                    : undefined,
                                            )
                                        }
                                    />
                                </Field>
                            </div>
                            <div className="two-col">
                                <Field label="Inventory">
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={draft.inventoryQuantity}
                                        onChange={(event) =>
                                            update(
                                                "inventoryQuantity",
                                                Number(event.target.value),
                                            )
                                        }
                                    />
                                </Field>
                                <Field label="Low-stock threshold">
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={draft.lowStockThreshold}
                                        onChange={(event) =>
                                            update(
                                                "lowStockThreshold",
                                                Number(event.target.value),
                                            )
                                        }
                                    />
                                </Field>
                            </div>
                            <div className="two-col">
                                <Field label="Status">
                                    <select
                                        value={draft.status}
                                        onChange={(event) =>
                                            update("status", event.target.value as Status)
                                        }
                                    >
                                        {Object.entries(statusLabel).map(([key, label]) => (
                                            <option key={key} value={key}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <label className="check">
                                    <input
                                        type="checkbox"
                                        checked={draft.featured}
                                        onChange={(event) =>
                                            update("featured", event.target.checked)
                                        }
                                    />
                                    Featured on homepage
                                </label>
                            </div>
                            <h3 className="subheading">Variants</h3>
                            {draft.variants.map((variant, index) => (
                                <div className="variant-row" key={variant.id}>
                                    <input
                                        placeholder="Name"
                                        value={variant.name}
                                        onChange={(event) =>
                                            updateVariant(index, { name: event.target.value })
                                        }
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        placeholder="Price cents"
                                        value={variant.priceMinor}
                                        onChange={(event) =>
                                            updateVariant(index, {
                                                priceMinor: Number(event.target.value),
                                            })
                                        }
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        placeholder="Stock"
                                        value={variant.inventoryQuantity}
                                        onChange={(event) =>
                                            updateVariant(index, {
                                                inventoryQuantity: Number(event.target.value),
                                            })
                                        }
                                    />
                                </div>
                            ))}
                            <button type="button" className="secondary" onClick={addVariant}>
                                <Plus size={15} /> Add variant
                            </button>
                            <h3 className="subheading">Product image</h3>
                            <input
                                ref={fileRef}
                                hidden
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={uploadImage}
                            />
                            <button
                                type="button"
                                className="upload-zone"
                                disabled={uploading}
                                onClick={() => fileRef.current?.click()}
                            >
                                <Upload size={20} />
                                {uploading
                                    ? "Uploading..."
                                    : draft.thumbnail
                                        ? "Replace product image"
                                        : "Upload product image"}
                                <small>PNG, JPG, or WEBP up to 5 MB</small>
                            </button>
                        </div>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <footer>
                        <button type="button" className="secondary" onClick={close}>
                            Cancel
                        </button>
                        <button className="primary" disabled={saving || uploading}>
                            {saving ? "Saving..." : "Save product"}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="field">
            <span>{label}</span>
            {children}
        </label>
    );
}
