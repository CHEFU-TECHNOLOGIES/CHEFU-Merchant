"use client";

import { MerchantDashboard } from "./MerchantDashboard";
import { MerchantLogin } from "./MerchantLogin";
import { useMerchantAuth } from "./hooks/useMerchantAuth";
import { useCatalog } from "./hooks/useCatalog";

export default function MerchantPage() {
    const { token, request, signOut } = useMerchantAuth();
    const catalog = useCatalog(token, request);

    if (!token) return <MerchantLogin error={catalog.error} />;

    return <MerchantDashboard catalog={catalog} signOut={signOut} />;
}
