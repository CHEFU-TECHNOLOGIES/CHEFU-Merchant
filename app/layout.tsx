import type { ReactNode } from 'react';
import './styles.css';
export const metadata = { title: 'CHEFU Merchant', description: 'CHEFU merchant product management.' };
export default function Layout({ children }: { children: ReactNode }) { return <html lang="en"><body>{children}</body></html>; }