async function getScreenshot(props: {
  url: string;
  width: number;
  height: number;
}) {
  const BASE_URL = "http://localhost:55977/.netlify/functions/screenshot";
  const url = new URL(BASE_URL);

  const params = new URLSearchParams({
    url: props.url,
    width: String(props.width),
    height: String(props.height),
  });
  url.search = params.toString();

  const response = await fetch(url);
  return response;
}
export const apiClient = { getScreenshot };
