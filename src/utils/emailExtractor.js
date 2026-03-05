export function extractEmail(text) {

  const emailRegex =
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  const match = text.match(emailRegex);
  return match ? match[0] : null;
}
export function extractCompanyName(text) {
  const companyPatterns = [
    /Company\s*:\s*(.+)/i,
    /About\s+([A-Za-z0-9 &]+)/i,
    /at\s+([A-Za-z0-9 &]+)/i,
  ];

  for (const pattern of companyPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}