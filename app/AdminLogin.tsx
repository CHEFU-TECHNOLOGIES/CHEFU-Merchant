import { beginSso } from "./oauth";

export function AdminLogin({ error }: { error: string }) {
    return (
        <main className="login">
            <section className="login-card">
                <p className="eyebrow">CHEFU TECHNOLOGIES</p>
                <h1>Product administration</h1>
                <p>
                    Manage product catalog, pricing, inventory, and availability from
                    one place.
                </p>
                {error && <p className="error">{error}</p>}
                <button className="primary" onClick={() => void beginSso()}>
                    Continue
                </button>
            </section>
        </main>
    );
}
