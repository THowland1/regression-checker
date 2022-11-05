"use client";

import { useState } from "react";
import { apiClient } from "../../../api/api-client";
import { useQuery } from "@tanstack/react-query";

type PageProps<TParams = {}, TSearchParams = {}> = {
  params: TParams;
  searchParams: TSearchParams;
};
export default function Page({
  params: { monitorid },
}: PageProps<{ monitorid: string }>) {
  const [image, setImage] = useState<string | undefined>(undefined);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["monitors", monitorid] as const,
    queryFn: (props) => {
      return apiClient.getMonitor(props.queryKey[1]);
    },
  });

  return (
    <div className="absolute inset-0 m-auto">
      <div className="container m-auto pt-16">
        <h1 className="text-7xl text-center">
          PageHawk watches your websites for you
        </h1>

        {isLoading && "Loading"}
        {isError && "Error"}
        {data && (
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
