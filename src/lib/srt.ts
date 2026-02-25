export interface SrtEntry {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

export function parseSrt(content: string): SrtEntry[] {
  const blocks = content.replace(/\r\n/g, "\n").trim().split(/\n\n+/);
  const entries: SrtEntry[] = [];

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 2) continue;

    const id = parseInt(lines[0].trim(), 10);
    if (isNaN(id)) continue;

    const timecodeMatch = lines[1].match(
      /^(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/
    );
    if (!timecodeMatch) continue;

    const [, startTime, endTime] = timecodeMatch;
    const text = lines.slice(2).join("\n");

    entries.push({ id, startTime, endTime, text });
  }

  return entries;
}

export function serializeSrt(entries: SrtEntry[]): string {
  return entries
    .map(
      (entry) =>
        `${entry.id}\n${entry.startTime} --> ${entry.endTime}\n${entry.text}`
    )
    .join("\n\n");
}
