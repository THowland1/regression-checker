"use client";

import Image from "next/image";
import { useState } from "react";
import { apiClient } from "../api/api-client";
import Input from "./Input";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

type DeviceSize = "mobile" | "tablet" | "desktop";

const SIZES: Record<DeviceSize, { width: number; height: number }> = {
  mobile: { height: 844, width: 390 },
  tablet: { height: 820, width: 1180 },
  desktop: { height: 1080, width: 1920 },
};

export default function Home() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const router = useRouter();

  async function getScreenshot(props: {
    url: string;
    width: number;
    height: number;
  }) {
    const res = await apiClient.postMonitor({
      height: props.height,
      width: props.width,
      interval_cron: "@every 5m",
      name: "BBC News Front Page",
      url: props.url,
      wait_for: "networkidle2",
    });
    router.push(`./monitors/${res.monitor_id}`);
  }
  return (
    <div className="absolute inset-0 m-auto">
      <div className="container m-auto pt-16">
        <h1 className="text-7xl text-center">
          PageHawk watches your websites for you
        </h1>

        <img src={image} alt="the image" />

        <Formik
          initialValues={{
            url: "",
            device: "mobile" as "mobile" | "tablet" | "desktop",
          }}
          onSubmit={(values) =>
            getScreenshot({
              url: values.url,
              ...SIZES[values.device],
            })
          }
        >
          {({
            values,
            handleSubmit,
            handleChange,
            isSubmitting,
            setFieldValue,
          }) => (
            <form
              onSubmit={handleSubmit}
              className={isSubmitting ? "opacity-50" : ""}
            >
              <div className="flex flex-col">
                <label htmlFor="">I want to watch</label>
                <Input
                  placeholder="Enter the website to watch: e.g. https://www.bbc.co.uk/news"
                  name="url"
                  type="text"
                  value={values.url}
                  onChange={handleChange}
                />

                <label>As it appears on</label>
                <div className="flex border border-scale-7  p-1">
                  {["mobile", "tablet", "desktop"].map((device) => (
                    <label
                      key={device}
                      className={
                        "border border-scale-7  p-2 m-1 cursor-pointer rounded-md " +
                        (values.device === device ? "bg-scale-7" : "")
                      }
                    >
                      <input
                        type="radio"
                        name="device"
                        value={device}
                        checked={values.device === device}
                        onChange={() => {
                          console.log(device);
                          setFieldValue("device", device);
                        }}
                      />
                      {device}
                    </label>
                  ))}
                </div>
                <button
                  className="btn-primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
