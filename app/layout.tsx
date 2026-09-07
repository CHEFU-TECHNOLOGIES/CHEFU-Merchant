import type { ReactNode } from "react";
import "./styles.css";
import './product-studio.css';
export const metadata = {
    title: "Merchant",
    description: "CHEFU merchant product management.",
};
export default function Layout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
