"use client";

import { useState } from "react";
import { apiClient } from "../../../api/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";

type PageProps<TParams = {}, TSearchParams = {}> = {
  params: TParams;
  searchParams: TSearchParams;
};
export default function Page({
  params: { monitor_id },
}: PageProps<{ monitor_id: string }>) {
  const [image, setImage] = useState<string | undefined>(undefined);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["monitors", monitor_id] as const,
    queryFn: (props) => {
      return apiClient.getMonitor(props.queryKey[1]);
    },
  });

  const mutation = useMutation({
    mutationKey: ["monitors", monitor_id] as const,
    mutationFn: async () => {
      return apiClient.postSnapshot({ monitor_id });
    },
  });

  return (
    <div className="absolute inset-0 m-auto">
      <div className="container m-auto pt-16">
        <h1 className="text-6xl text-center">
          PageHawk watches your websites for you
        </h1>

        {isLoading && "Loading"}
        {isError && "Error"}
        {data && (
          <>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>

            <button
              disabled={mutation.isLoading}
              onClick={() => mutation.mutate()}
            >
              Marshmallow time!
            </button>
          </>
        )}
      </div>
    </div>
  );
}
