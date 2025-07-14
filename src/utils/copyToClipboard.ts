export const copyContents = async (contents: string) => {
    try {
        await navigator.clipboard.writeText(contents);
    } catch (err) {
        console.error('Failed to copy contents:', err);
    }
};