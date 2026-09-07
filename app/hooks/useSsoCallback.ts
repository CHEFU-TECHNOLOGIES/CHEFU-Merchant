"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { completeSso } from "../oauth";

export function useSsoCallback() {
    const router = useRouter();
    const params = useSearchParams();
    const [error, setError] = useState("");

    useEffect(() => {
        const code = params.get("code");
        if (!code) {
            setError(
                params.get("error_description") || "Missing authorization code.",
            );
            return;
        }
        void completeSso(code, params.get("state"))
            .then(() => router.replace("/"))
            .catch((reason: unknown) =>
                setError(reason instanceof Error ? reason.message : "Sign-in failed."),
            );
    }, [params, router]);

    return error;
}
