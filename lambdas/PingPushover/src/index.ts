import fetch from "node-fetch";

export const handler = async (...props) => {
  await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    body: JSON.stringify({
      token: process.env.PUSHOVER_APPLICATION_KEY,
      user: process.env.PUSHOVER_USER_KEY,
      message: "hello moto",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify(props, null, 2),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
