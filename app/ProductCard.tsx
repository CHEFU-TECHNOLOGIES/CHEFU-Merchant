import { Edit3, PackagePlus } from "lucide-react";
import { statusLabel, type Product } from "./merchant-types";
import { formatZAR } from "./pricing";

export function ProductCard({ product, edit }: { product: Product; edit: (product: Product) => void }) {
    const image = product.thumbnail || product.images[0]?.url;
    return <article className="product-card"><div className="card-image">{image ? <img src={image} alt={product.name} /> : <PackagePlus size={34} />}</div><div className="card-body"><span className={`status ${product.status.toLowerCase()}`}>{statusLabel[product.status]}</span><h3>{product.name}</h3><p>{product.category}</p><div className="card-meta"><strong>{formatZAR(product.priceMinor)}</strong><span>{product.inventoryQuantity} in stock</span></div><button className="secondary full" onClick={() => edit(product)}><Edit3 size={15} /> Edit product</button></div></article>;
}
