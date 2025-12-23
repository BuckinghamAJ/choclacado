import { query, redirect } from "@solidjs/router";
import goApiClient from "./go-api-client";
import { getRequestEvent } from "solid-js/web";

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

// TODO: Define types!
const verifyUser = query(async function () {
  "use server";

  const event = getRequestEvent();

  const reqHeaders = event?.request.headers;
  // console.log("Request Headers:");
  // console.log(event);

  const verifyUrl = new URL("/api/me", BETTER_AUTH_URL);

  const rsp = await fetch(verifyUrl.toString(), {
    headers: reqHeaders,
  });

  if (!rsp.ok) {
    console.log("Should throw redirect");
    return { error: "Error verifying user" };
  }

  const data = await rsp.json();

  // console.log("Response: " + JSON.stringify(data));
  // console.log("Response User: " + JSON.stringify(rsp.data.user));
  // console.log("Response Name: " + rsp.data.user.Name);

  return data.user;
}, "userAuthentication");

export default verifyUser;
