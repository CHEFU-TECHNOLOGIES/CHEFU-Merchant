import type { ReactNode } from "react";

export function Metric({
    label,
    value,
    icon,
    tone = "",
}: {
    label: string;
    value: number;
    icon: ReactNode;
    tone?: string;
}) {
    return (
        <div className="metric">
            <span className={`metric-icon ${tone}`}>{icon}</span>
            <div>
                <p>{label}</p>
                <strong>{value}</strong>
            </div>
        </div>
    );
}
