import { AlertTriangle, X } from "lucide-react";

export function ConfirmDialog({
    title,
    description,
    confirmLabel,
    onConfirm,
    onCancel,
}: {
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="dialog-backdrop" role="presentation" onMouseDown={onCancel}>
            <section
                className="confirm-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-description"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <button className="dialog-close" type="button" onClick={onCancel} aria-label="Close dialog">
                    <X size={17} />
                </button>
                <span className="dialog-icon"><AlertTriangle size={20} /></span>
                <h2 id="confirm-title">{title}</h2>
                <p id="confirm-description">{description}</p>
                <div className="dialog-actions">
                    <button className="secondary" type="button" onClick={onCancel}>Cancel</button>
                    <button className="danger-button" type="button" onClick={onConfirm}>{confirmLabel}</button>
                </div>
            </section>
        </div>
    );
}
