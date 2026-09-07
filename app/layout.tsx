import type { ReactNode } from "react";
import "./styles.css";
import "./product-studio.css";
import "./design-system.css";
export const metadata = {
    title: "Merchant",
    description: "CHEFU merchant product management.",
};
export default function Layout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `try { var t = localStorage.getItem('chefu-merchant-theme'); if (!t && window.matchMedia('(prefers-color-scheme: dark)').matches) t = 'dark'; if (t) document.documentElement.dataset.theme = t; } catch (e) {}`,
                    }}
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
