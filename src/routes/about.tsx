import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: function () {
    return (
      <>
        <h3>About</h3>
      </>
    );
  },
});