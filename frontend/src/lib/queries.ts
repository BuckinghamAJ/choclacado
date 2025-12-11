import { query, redirect } from "@solidjs/router";
import goApiClient from "./go-api-client";
import { getRequestEvent } from "solid-js/web";

const BETTER_AUTH_URL = "http://localhost:3000";

const verifyUser = query(async function () {
  "use server";
  const event = getRequestEvent();

  const reqHeaders = event?.request.headers;
  // console.log("Request Headers:");
  // console.log(event);

  const verifyUrl = new URL("/api/me", BETTER_AUTH_URL);
  console.log("Sending to: " + verifyUrl.toString());

  const rsp = await fetch(verifyUrl.toString(), {
    headers: reqHeaders,
  })
    .then((x) => x.json())
    .then((x) => ({ data: x }))
    .catch((e) => ({ error: e }));

  if (rsp.error) {
    console.log("Should throw redirect");
    throw redirect("/login");
  }

  console.log("Response: " + JSON.stringify(rsp.data));

  return rsp.data.user;
}, "userAuthentication");

export default verifyUser;
