import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export default function CallbackPage() {
    return (
        <Suspense
            fallback={
                <main className="login">
                    <div className="login-card">
                        <p>Completing secure sign-in...</p>
                    </div>
                </main>
            }
        >
            <CallbackClient />
        </Suspense>
    );
}
