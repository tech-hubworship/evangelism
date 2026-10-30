"use client";

import React from "react";
import { Global, css } from "@emotion/react";
import EmotionRegistry from "./EmotionRegistry";

const globalStyles = css`
  /* hub_web과 동일한 기본 폰트 스택 (Wanted Sans) */
  :root {
    --font-wanted: "Wanted Sans Variable", "Wanted Sans", -apple-system,
      BlinkMacSystemFont, system-ui, "Segoe UI", "Apple SD Gothic Neo",
      "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol", sans-serif;
  }

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
    font-family: var(--font-wanted);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: -0.01em;
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
