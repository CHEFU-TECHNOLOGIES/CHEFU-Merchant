"use client";

import { useSsoCallback } from "../../hooks/useSsoCallback";

export default function CallbackClient() {
    const error = useSsoCallback();
    return (
        <main className="login">
            <div className="login-card">
                <p className="eyebrow">CHEFU SSO</p>
                <h1>Signing you in</h1>
                {error ? (
                    <>
                        <p className="error">{error}</p>
                        <a className="primary" href="/">
                            Return to admin
                        </a>
                    </>
                ) : (
                    <p>Completing secure sign-in...</p>
                )}
            </div>
        </main>
    );
}
