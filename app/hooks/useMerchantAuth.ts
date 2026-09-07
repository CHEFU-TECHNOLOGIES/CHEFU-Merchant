"use client";

import { useEffect, useMemo, useState } from "react";
import { clearAccessToken, getAccessToken } from "../oauth";
import { createMerchantRequest } from "../merchant-api";

export function useMerchantAuth() {
    const [token, setToken] = useState<string | null>(null);
    const request = useMemo(() => createMerchantRequest(token), [token]);

    useEffect(() => {
        setToken(getAccessToken());
    }, []);

    function signOut() {
        clearAccessToken();
        setToken(null);
    }

    return { token, request, signOut };
}
