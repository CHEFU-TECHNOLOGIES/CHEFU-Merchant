"use client";

import { AdminDashboard } from "./AdminDashboard";
import { AdminLogin } from "./AdminLogin";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { useCatalog } from "./hooks/useCatalog";

export default function AdminPage() {
    const { token, request, signOut } = useAdminAuth();
    const catalog = useCatalog(token, request);

    if (!token) return <AdminLogin error={catalog.error} />;

    return <AdminDashboard catalog={catalog} signOut={signOut} />;
}
