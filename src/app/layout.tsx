import React from "react";
import type { Metadata, Viewport } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "한 영혼을 향한 사랑",
    template: "%s | 한 영혼을 향한 사랑",
  },
  description:
    "하나님에 대해 궁금했던 이야기와 복음을 천천히 알아가고, 편하게 질문할 수 있는 공간입니다.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  themeColor: "#f7f5ef",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return React.createElement(
    "html",
    { lang: "ko", dir: "ltr" },
    React.createElement(
      "head",
      null,
      // hub_web과 동일한 기본 폰트: Wanted Sans Variable (jsDelivr CDN)
      React.createElement("link", {
        rel: "preconnect",
        href: "https://cdn.jsdelivr.net",
        crossOrigin: "anonymous",
      }),
      React.createElement("link", {
        rel: "preload",
        as: "style",
        href: "https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css",
      }),
      React.createElement("link", {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css",
      })
    ),
    React.createElement(
      "body",
      null,
      React.createElement(Providers, null, children)
    )
  );
}
