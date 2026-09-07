import type { ReactNode } from 'react';
import './styles.css';
export const metadata = { title: 'CHEFU Product Admin', description: 'CHEFU Technologies product administration.' };
export default function Layout({ children }: { children: ReactNode }) { return <html lang="en"><body>{children}</body></html>; }