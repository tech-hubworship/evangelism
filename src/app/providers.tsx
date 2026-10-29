"use client";

import React from "react";
import { Global, css } from "@emotion/react";
import EmotionRegistry from "./EmotionRegistry";

const globalStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: "Nanum Myeongjo", system-ui, -apple-system,
      "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  }

  a {
    color: inherit;
  }
`;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <Global styles={globalStyles} />
      {children}
    </EmotionRegistry>
  );
}
