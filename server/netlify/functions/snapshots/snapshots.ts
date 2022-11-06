import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../types/supabase";
import { z } from "zod";
import { screenshot } from "../../utils/screenshot";
import { compareImages } from "../../utils/compare-images";
import { createPNGBlob } from "../../utils/create-png-blob";
import crypto from "crypto";

const NewSnapshotRequestSchema = z.object({
  monitor_id: z.string().uuid(),
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
      const newMonitorRequest = NewSnapshotRequestSchema.safeParse(
        JSON.parse(event.body ?? "{}")
      );

      if (!newMonitorRequest.success) {
        return {
          statusCode: 400,
          body: JSON.stringify(newMonitorRequest.error),
          headers: { "Access-Control-Allow-Origin": "*" },
        };
      }
      const { monitor_id } = newMonitorRequest.data;
      const monitorResponse = await client
        .from("monitor")
        .select()
        .eq("monitor_id", monitor_id)
        .single();
      if (!monitorResponse.data) {
        return {
          statusCode: 500,
          body: JSON.stringify(monitorResponse.error),
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        };
      }
      const monitor = monitorResponse.data;
      const latestSnapshotResponse = await client
        .from("snapshot")
        .select()
        .eq("monitor_id", monitor_id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!latestSnapshotResponse.data) {
        return {
          statusCode: 500,
          body: JSON.stringify(latestSnapshotResponse.error),
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        };
      }

      const maybeLatestSnapshot = latestSnapshotResponse.data[0];
      const latestSnapshot = maybeLatestSnapshot as
        | typeof maybeLatestSnapshot
        | undefined;

      const newSnapshotImage = await screenshot({
        url: monitor.url,
        viewport: {
          height: monitor.height,
          width: monitor.width,
        },
        waitFor: { waitUntil: monitor.wait_for as any },
      });

      const snapshot_id = crypto.randomUUID();
      const postSnapshotResult = await client.storage
        .from("pagehawk")
        .upload(`shapshots/${snapshot_id}.png`, newSnapshotImage, {
          contentType:
            "image/png" /** TODO cache control to longer than default 3600 seconds */,
        });
      if (postSnapshotResult.error) {
        return {
          statusCode: 500,
          body: JSON.stringify(postSnapshotResult.error),
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        };
      }

      let latestImageBlob: Blob;
      if (latestSnapshot) {
        const getSnapshotImageResult = await client.storage
          .from("pagehawk")
          .download(latestSnapshot.image_url);
        if (!getSnapshotImageResult.data) {
          return {
            statusCode: 500,
            body: JSON.stringify(getSnapshotImageResult.error),
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          };
        }
        latestImageBlob = getSnapshotImageResult.data;
      } else {
        latestImageBlob = createPNGBlob({
          width: monitor.width,
          height: monitor.height,
        });
      }

      const comparison = await compareImages(latestImageBlob, newSnapshotImage);
      const postDiffResult = await client.storage
        .from("pagehawk")
        .upload(`diffs/${snapshot_id}.png`, comparison.diff, {
          contentType:
            "image/png" /** TODO cache control to longer than default 3600 seconds */,
        });
      if (!postDiffResult.data) {
        return {
          statusCode: 500,
          body: JSON.stringify(postDiffResult.error),
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        };
      }

      const { data, error } = await client
        .from("snapshot")
        .insert({
          diff_image_url: postDiffResult.data.path,
          diff_pixel_count: comparison.pixeldifference,
          image_url: postSnapshotResult.data.path,
          small_image_url:
            postSnapshotResult.data.path /** TODO - Actually downscale */,
          medium_image_url:
            postSnapshotResult.data.path /** TODO - Actually downscale */,
          monitor_id,
        })
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
    // case "GET": {
    //   const query = MonitorQuerySchema.parse(event.queryStringParameters);
    //   const { data, error } = await client
    //     .from("monitor")
    //     .select()
    //     .eq("monitor_id", query.monitor_id)
    //     .single();
    //   if (data) {
    //     return {
    //       statusCode: 200,
    //       body: JSON.stringify(data),
    //       headers: { "Access-Control-Allow-Origin": "*" },
    //     };
    //   } else if (error) {
    //     return {
    //       statusCode: 500,
    //       body: JSON.stringify(error),
    //       headers: { "Access-Control-Allow-Origin": "*" },
    //     };
    //   } else {
    //     return {
    //       statusCode: 404,
    //       body: "Not Found",
    //       headers: { "Access-Control-Allow-Origin": "*" },
    //     };
    //   }
    // }
    default:
      return {
        statusCode: 405,
        body: "Method Not Allowed",
        headers: { "Access-Control-Allow-Origin": "*" },
      };
  }
};
