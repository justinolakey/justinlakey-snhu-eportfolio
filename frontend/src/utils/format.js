// Formats a numeric price as a compact dollar string (e.g. 320000 -> "$320K").
// Used in multiple places across the app, so defined here as a utility function.
export function fmt(n) {
    return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`;
}
