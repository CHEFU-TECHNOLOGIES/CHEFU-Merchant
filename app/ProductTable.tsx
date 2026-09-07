"use client";

import { Archive, Edit3, MoreHorizontal, PackagePlus } from "lucide-react";
import { useState } from "react";
import { statusLabel, type Product } from "./merchant-types";
import { formatZAR } from "./pricing";

export function ProductTable({
    products,
    edit,
    archive,
}: {
    products: Product[];
    edit: (product: Product) => void;
    archive: (product: Product) => Promise<void>;
}) {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    return (
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Updated</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        const image = product.thumbnail || product.images[0]?.url;
                        return (
                            <tr key={product.id}>
                                <td>
                                    <div className="product-name">
                                        <div className="thumb">
                                            {image ? (
                                                <img src={image} alt="" />
                                            ) : (
                                                <PackagePlus size={17} />
                                            )}
                                        </div>
                                        <div>
                                            <strong>{product.name}</strong>
                                            <small>{product.category}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>{product.sku}</td>
                                <td>{formatZAR(product.priceMinor)}</td>
                                <td
                                    className={
                                        product.inventoryQuantity <= product.lowStockThreshold
                                            ? "stock-warning"
                                            : ""
                                    }
                                >
                                    {product.inventoryQuantity}
                                </td>
                                <td>
                                    <span className={`status ${product.status.toLowerCase()}`}>
                                        {statusLabel[product.status]}
                                    </span>
                                </td>
                                <td>
                                    {new Date(product.updatedAt).toLocaleDateString("en-ZA")}
                                </td>
                                <td>
                                    <div className="row-actions row-menu-wrap">
                                        <button
                                            title="Product actions"
                                            aria-label={`Actions for ${product.name}`}
                                            aria-expanded={openMenu === product.id}
                                            onClick={() => setOpenMenu(openMenu === product.id ? null : product.id)}
                                        >
                                            <MoreHorizontal size={17} />
                                        </button>
                                        {openMenu === product.id && (
                                            <div className="row-menu" role="menu">
                                                <button role="menuitem" onClick={() => { setOpenMenu(null); edit(product); }}><Edit3 size={15} /> Edit product</button>
                                                <button role="menuitem" className="menu-danger" onClick={() => { setOpenMenu(null); void archive(product); }}><Archive size={15} /> Archive product</button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
