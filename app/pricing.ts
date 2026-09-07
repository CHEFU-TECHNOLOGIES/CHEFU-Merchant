export const PRODUCT_CURRENCY = "ZAR" as const;

const decimalMoneyPattern = /^(?:0|[1-9]\d*)(?:\.\d{0,2})?$/;

export function formatZAR(minorUnits: number | null | undefined) {
    const amount = Number.isInteger(minorUnits) ? (minorUnits || 0) / 100 : 0;
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: PRODUCT_CURRENCY,
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function minorUnitsToInput(minorUnits: number | null | undefined) {
    if (minorUnits === undefined || minorUnits === null) return "";
    if (!Number.isInteger(minorUnits) || minorUnits < 0) return "";
    return (minorUnits / 100).toFixed(2);
}

export function parseMoneyInput(value: string) {
    const normalized = value.trim();
    if (!decimalMoneyPattern.test(normalized)) return null;

    const [whole, fraction = ""] = normalized.split(".");
    const minorUnits = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
    return Number.isSafeInteger(minorUnits) ? minorUnits : null;
}

export function isMoneyInput(value: string) {
    return parseMoneyInput(value) !== null;
}

export const money = formatZAR;
