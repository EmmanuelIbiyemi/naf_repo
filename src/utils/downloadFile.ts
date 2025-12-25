export const downloadFile = (url: string, filename?: string) => {
  const link = document.createElement("a");
  link.href = url;
  if (filename) link.download = filename;
  link.target = "_blank";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
