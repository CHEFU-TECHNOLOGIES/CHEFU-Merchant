"use client";

import { useEffect, useMemo, useState } from "react";
import { clearAccessToken, getAccessToken } from "../oauth";
import { createAdminRequest } from "../admin-api";

export function useAdminAuth() {
    const [token, setToken] = useState<string | null>(null);
    const request = useMemo(() => createAdminRequest(token), [token]);

    useEffect(() => {
        setToken(getAccessToken());
    }, []);

    function signOut() {
        clearAccessToken();
        setToken(null);
    }

    return { token, request, signOut };
}
