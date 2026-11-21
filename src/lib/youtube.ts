/** YouTube video id from any common link format (watch, youtu.be, shorts, embed, live), or null. */
export const youTubeId = (url?: string | null) =>
  url?.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/)?.[1] ?? null;

/** Thumbnail picture YouTube makes for every video. */
export const youTubeThumb = (url?: string | null) => {
  const id = youTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
};
