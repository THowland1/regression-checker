import { z } from "zod";
import { environment } from "../environment";

const CRON_REGEX =
  /(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/;

async function getScreenshot(props: {
  url: string;
  width: number;
  height: number;
}) {
  const BASE_URL = `${environment.NEXT_PUBLIC_API_URL}/.netlify/functions/screenshot`;
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

const NewMonitorSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  url: z.string().url(),
  interval_cron: z.string().regex(CRON_REGEX),
  name: z.string(),
  wait_for: z.union([
    z.literal("load"),
    z.literal("domcontentloaded"),
    z.literal("networkidle0"),
    z.literal("networkidle2"),
  ]),
});
const MonitorSchema = z.object({
  monitor_id: z.string().uuid(),
  created_at: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
  url: z.string().url(),
  interval_cron: z.string().regex(CRON_REGEX),
  name: z.string(),
  wait_for: z.union([
    z.literal("load"),
    z.literal("domcontentloaded"),
    z.literal("networkidle0"),
    z.literal("networkidle2"),
  ]),
});

async function postMonitor(newMonitor: z.infer<typeof NewMonitorSchema>) {
  const POST_URL = `${environment.NEXT_PUBLIC_API_URL}/.netlify/functions/monitors`;

  const response = await fetch(POST_URL, {
    body: JSON.stringify(newMonitor),
    method: "POST",
  });
  const responseBody = await response.json();
  const monitor = MonitorSchema.parse(responseBody);

  return monitor;
}

async function getMonitor(monitor_id: string) {
  const GET_URL = `${environment.NEXT_PUBLIC_API_URL}/.netlify/functions/monitors?monitor_id=${monitor_id}`;

  const response = await fetch(GET_URL);
  const responseBody = await response.json();
  const monitor = MonitorSchema.parse(responseBody);

  return monitor;
}

export const apiClient = { getScreenshot, postMonitor, getMonitor };
