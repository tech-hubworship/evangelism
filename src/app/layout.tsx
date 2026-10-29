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
      React.createElement("link", {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      }),
      React.createElement("link", {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      }),
      React.createElement("link", {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap",
      })
    ),
    React.createElement(
      "body",
      null,
      React.createElement(Providers, null, children)
    )
  );
}
