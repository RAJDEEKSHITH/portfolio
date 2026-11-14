const DRIVE_ID_RE = /\/d\/([\w-]+)|[?&]id=([\w-]+)/;

export type ResumeLinks = { preview: string; view: string; download: string };

/** File ID from ".../file/d/<ID>/..." or "...?id=<ID>"; null if neither is present. */
export const getDriveId = (url: string): string | null => {
  const m = DRIVE_ID_RE.exec(url);
  return m?.[1] ?? m?.[2] ?? null;
};

export const getResumeLinks = (url: string): ResumeLinks | null => {
  const id = getDriveId(url);
  if (!id) return null;
  return {
    preview: `https://drive.google.com/file/d/${id}/preview`,
    view: `https://drive.google.com/file/d/${id}/view`,
    download: `https://drive.google.com/uc?export=download&id=${id}`,
  };
};
