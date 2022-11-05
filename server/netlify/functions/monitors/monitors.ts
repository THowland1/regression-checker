import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../types/supabase";
import { z } from "zod";

const CRON_REGEX =
  /(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/;

const MonitorQuerySchema = z.object({
  monitorid: z.string(),
});
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

function throwError(message: string): string {
  throw new TypeError(message);
}

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? throwError("SUPABASE_URL is not set");
const SUPABASE_KEY =
  process.env.SUPABASE_KEY ?? throwError("SUPABASE_KEY is not set");

export const handler: Handler = async (event, { awsRequestId }) => {
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {});

  switch (event.httpMethod) {
    case "POST": {
      const newMonitor = NewMonitorSchema.safeParse(
        JSON.parse(event.body ?? "{}")
      );

      if (!newMonitor.success) {
        return {
          statusCode: 400,
          body: JSON.stringify(newMonitor.error),
          headers: { "Access-Control-Allow-Origin": "*" },
        };
      }

      const { data, error } = await client
        .from("monitor")
        .insert(newMonitor.data)
        .select()
        .single();
      if (data) {
        return {
          statusCode: 201,
          body: JSON.stringify(data),
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify(error),
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        };
      }
    }
    case "GET": {
      const query = MonitorQuerySchema.parse(event.queryStringParameters);
      const { data, error } = await client
        .from("monitor")
        .select()
        .eq("monitorid", query.monitorid)
        .single();
      if (data) {
        return {
          statusCode: 200,
          body: JSON.stringify(data),
          headers: { "Access-Control-Allow-Origin": "*" },
        };
      } else if (error) {
        return {
          statusCode: 500,
          body: JSON.stringify(error),
          headers: { "Access-Control-Allow-Origin": "*" },
        };
      } else {
        return {
          statusCode: 404,
          body: "Not Found",
          headers: { "Access-Control-Allow-Origin": "*" },
        };
      }
    }
    default:
      return {
        statusCode: 405,
        body: "Method Not Allowed",
        headers: { "Access-Control-Allow-Origin": "*" },
      };
  }
};
