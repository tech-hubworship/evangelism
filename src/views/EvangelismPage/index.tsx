"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useRouter, useSearchParams } from "next/navigation";
import Hero from "./sections/Hero";
import GospelCarousel from "./sections/GospelCarousel";
import Scriptures from "./sections/Scriptures";
import Songs from "./sections/Songs";
import QnA from "./sections/QnA";
import ChurchFinder from "./sections/ChurchFinder";
import {
  Explore,
  ExploreMore,
  Why,
  CgnVideos,
  HurrayTeam,
  EvangelismFooter,
} from "./sections/StaticSections";
import { Page, Wrap, C } from "./styles";
import { TABS, DEFAULT_TAB, isTabKey, TabKey, EXPLORE_ITEMS } from "./data";

const TabBarOuter = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: ${C.cream};
  border-bottom: 1px solid ${C.line};
`;

const TabBar = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  /* 좌우 안쪽 여백으로 첫/마지막 탭이 가장자리에 붙어 잘리지 않게.
     Wrap의 측면 여백과 겹치지 않도록 음수 마진으로 전체폭까지 확장 후 패딩. */
  padding: 10px 18px;
  margin: 0 -18px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  scroll-padding-inline: 18px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 0 0 auto;
  border: 1px solid ${(p) => (p.active ? C.green : C.line)};
  background: ${(p) => (p.active ? C.green : "#fff")};
  color: ${(p) => (p.active ? "#fff" : "#47544b")};
  border-radius: 999px;
  padding: 9px 15px;
  font: inherit;
  font-size: 13px;
  font-weight: ${(p) => (p.active ? 750 : 500)};
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;

  &:hover {
    border-color: #9eb6a3;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
  }
`;

// --- 어느 탭에서나 떠 있는 빠른 이동 메뉴(FAB) ---
const FabWrap = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;

  @media (max-width: 480px) {
    right: 14px;
    bottom: 14px;
  }
`;

const FabMenu = styled.div`
  width: min(300px, calc(100vw - 32px));
  background: #fff;
  border: 1px solid ${C.line};
  border-radius: 18px;
  box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  animation: fabIn 0.18s ease;

  @keyframes fabIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .head {
    padding: 14px 16px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.02em;
    color: ${C.green2};
    border-bottom: 1px solid ${C.line};
  }
`;

const FabItem = styled.button<{ active: boolean }>`
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  border-top: 1px solid ${C.line};
  background: ${(p) => (p.active ? "#f3f7f2" : "#fff")};
  font: inherit;
  cursor: pointer;
  transition: background 0.12s;

  &:first-of-type {
    border-top: none;
  }
  &:hover {
    background: #f6f8f5;
  }

  .ico {
    flex: 0 0 28px;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: ${C.sage};
    display: grid;
    place-items: center;
    font-size: 15px;
  }
  strong {
    font-size: 14px;
    letter-spacing: -0.01em;
    color: ${C.ink};
  }
`;

const FabButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 18px;
  border: none;
  border-radius: 999px;
  background: ${C.green};
  color: #fff;
  font: inherit;
  font-weight: 750;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 14px 34px -14px rgba(24, 58, 49, 0.7);
  transition: transform 0.12s;

  &:hover {
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }

  .mark {
    font-size: 16px;
    line-height: 1;
  }
`;

function TabPanel({ tab, onSelectTab }: { tab: TabKey; onSelectTab: (t: TabKey) => void }) {
  switch (tab) {
    case "explore":
      return <Explore onSelectTab={onSelectTab} />;
    case "why":
      return <Why />;
    case "gospel":
      return <GospelCarousel onSelectTab={onSelectTab} />;
    case "scripture":
      return <Scriptures />;
    case "qna":
      return <QnA />;
    case "songs":
      return <Songs />;
    case "cgn":
      return <CgnVideos />;
    case "church":
      return <ChurchFinder />;
    case "hurray":
      return <HurrayTeam />;
    default:
      return null;
  }
}

export default function EvangelismPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<TabKey>(
    isTabKey(paramTab) ? paramTab : DEFAULT_TAB
  );

  // 뒤로가기/링크 등으로 URL이 바뀌면 탭 상태 동기화
  useEffect(() => {
    if (isTabKey(paramTab) && paramTab !== activeTab) {
      setActiveTab(paramTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramTab]);

  // 탭바(sticky) 위치. 탭 전환 시 이 지점으로 스크롤해 콘텐츠가 바로 보이게 한다.
  const tabBarRef = useRef<HTMLDivElement>(null);

  const selectTab = useCallback(
    (tab: TabKey) => {
      setActiveTab(tab);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`/?${params.toString()}`, { scroll: false });

      if (typeof window === "undefined") return;

      // 둘러보기는 Hero 인사말까지 포함해 맨 위로, 그 외 탭은 탭바 위치(=콘텐츠)로 이동
      if (tab === "explore") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const bar = tabBarRef.current;
      if (bar) {
        const top = bar.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [router, searchParams]
  );

  // 선택된 탭이 탭바에서 보이도록 자동 스크롤 (모바일에서 탭이 화면 밖일 때)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  useEffect(() => {
    const el = tabRefs.current[activeTab];
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeTab]);

  // 어느 탭에서나 떠 있는 빠른 이동 메뉴
  const [fabOpen, setFabOpen] = useState(false);

  const handleFabSelect = (tab: TabKey) => {
    setFabOpen(false);
    selectTab(tab);
  };

  return (
    <>
      <Page>
        <Hero onSelectTab={selectTab} />

        <TabBarOuter ref={tabBarRef}>
          <Wrap>
            <TabBar role="tablist" aria-label="전도 페이지 섹션">
              {TABS.map((t) => (
                <TabButton
                  key={t.key}
                  ref={(el) => {
                    tabRefs.current[t.key] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === t.key}
                  active={activeTab === t.key}
                  onClick={() => selectTab(t.key)}
                >
                  {t.label}
                </TabButton>
              ))}
            </TabBar>
          </Wrap>
        </TabBarOuter>

        <TabPanel tab={activeTab} onSelectTab={selectTab} />

        {/* 둘러보기 탭 외 모든 탭 하단에 "무엇이 궁금하신가요?" 그리드 노출 */}
        {activeTab !== "explore" && (
          <ExploreMore onSelectTab={selectTab} activeTab={activeTab} />
        )}
      </Page>
      <EvangelismFooter />

      <FabWrap>
        {fabOpen && (
          <FabMenu role="menu" aria-label="바로 이동">
            <div className="head">무엇이 궁금하신가요?</div>
            {EXPLORE_ITEMS.map((item) => (
              <FabItem
                key={item.tab}
                type="button"
                role="menuitem"
                active={activeTab === item.tab}
                onClick={() => handleFabSelect(item.tab)}
              >
                <span className="ico" aria-hidden>
                  {item.icon}
                </span>
                <strong>{item.title}</strong>
              </FabItem>
            ))}
          </FabMenu>
        )}
        <FabButton
          type="button"
          aria-expanded={fabOpen}
          aria-label={fabOpen ? "메뉴 닫기" : "바로 이동 메뉴 열기"}
          onClick={() => setFabOpen((o) => !o)}
        >
          <span className="mark" aria-hidden>
            {fabOpen ? "✕" : "✦"}
          </span>
          {fabOpen ? "닫기" : "바로 이동"}
        </FabButton>
      </FabWrap>
    </>
  );
}
