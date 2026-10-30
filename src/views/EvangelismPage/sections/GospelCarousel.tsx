"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { GOSPEL_STEPS } from "../data";
import type { TabKey, GospelSymbol } from "../data";
import { C, Section, Wrap, SectionHead, Kicker, H2, Panel, Tag, Btn, Small } from "../styles";

// -------------------------------------------------------------
// 전도 소책자의 심볼을 인라인 SVG로 표현
//  - 단계별로 의미가 담긴 아이콘(하트 → 갈라진 하트 → 십자가+하트 →
//    선물 → 집 문 → 다시 이어지는 하트 → 가득 찬 하트)
// -------------------------------------------------------------
const RED = "#c75b63";
const BLUE = "#6b73b0";
const GREEN = "#3f7d5f";
const ORANGE = "#d08a4f";
const INK = "#3a4a42";

function GospelSymbolIcon({ symbol }: { symbol: GospelSymbol }) {
  switch (symbol) {
    // 도입: 원 안의 두 갈래 화살표(어느 길을 택할지)
    case "compass":
      return (
        <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
          <circle cx="60" cy="60" r="46" fill="none" stroke={INK} strokeWidth="3" />
          <circle cx="60" cy="60" r="40" fill="none" stroke={INK} strokeWidth="1.5" />
          <circle cx="52" cy="68" r="4" fill="none" stroke={INK} strokeWidth="3" />
          <path d="M55 64 L82 40" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M74 40 L82 40 L82 48" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M57 72 L82 86" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M74 86 L82 86 L82 78" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    // 창조: 온전한 하트
    case "heart":
    case "heart-filled":
      return (
        <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
          <path d={HEART_PATH} fill={RED} />
        </svg>
      );
    // 죄: 가운데가 갈라진 하트
    case "heart-broken":
      return (
        <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
          <g>
            <path d={HEART_PATH} fill={RED} />
            {/* 가운데 흰 균열 */}
            <path
              d="M60 34 L54 56 L63 66 L55 80 L60 96 L60 34 Z"
              fill="#fdfdfb"
            />
            <rect x="59" y="32" width="2.5" height="66" fill="#fdfdfb" />
          </g>
        </svg>
      );
    // 사랑: 십자가 + 하트
    case "cross-heart":
      return (
        <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
          <path d={HEART_PATH} fill={RED} transform="translate(0 8) scale(0.92)" style={{ transformOrigin: "60px 60px" }} />
          <rect x="52" y="22" width="16" height="78" rx="2" fill={BLUE} />
          <rect x="38" y="40" width="44" height="15" rx="2" fill={BLUE} />
        </svg>
      );
    // 구원: 두 개의 선물 + 십자가
    case "gift-double":
      return (
        <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
          <GiftShape x={10} y={46} color={GREEN} />
          <GiftShape x={62} y={52} color={ORANGE} />
          <rect x="54" y="18" width="12" height="40" rx="1.5" fill={BLUE} />
          <rect x="44" y="30" width="32" height="11" rx="1.5" fill={BLUE} />
        </svg>
      );
    // 평안과 영생: 하나의 선물
    case "gift":
      return (
        <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
          <GiftShape x={34} y={40} color={BLUE} big />
        </svg>
      );
    // 초대: 문 열린 집
    case "door":
      return (
        <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
          <path d="M60 20 L100 54 L100 100 L20 100 L20 54 Z" fill="#a7adda" />
          <rect x="46" y="58" width="28" height="42" fill={BLUE} />
          <path d="M46 58 L60 52 L60 100 L46 100 Z" fill="#8f96c9" />
          <circle cx="51" cy="80" r="1.8" fill="#fdfdfb" />
        </svg>
      );
    // 기도: 다시 이어지는(회복되는) 하트 — 두 조각 + 점선
    case "heart-mending":
      return (
        <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
          <path d={HEART_PATH} fill={RED} transform="translate(-6 0)" />
          <path d={HEART_PATH} fill={RED} transform="translate(6 0)" />
          <rect x="34" y="60" width="52" height="2" fill="#fdfdfb" />
          <g fill="#fdfdfb">
            <circle cx="54" cy="61" r="2" />
            <circle cx="60" cy="61" r="2" />
            <circle cx="66" cy="61" r="2" />
          </g>
        </svg>
      );
    default:
      return null;
  }
}

// 공용 하트 패스 (viewBox 0 0 120 120 기준)
const HEART_PATH =
  "M60 98 C30 76 16 58 16 42 C16 29 26 20 38 20 C47 20 55 25 60 33 C65 25 73 20 82 20 C94 20 104 29 104 42 C104 58 90 76 60 98 Z";

// 선물 상자 모양 (리본 포함)
function GiftShape({
  x,
  y,
  color,
  big,
}: {
  x: number;
  y: number;
  color: string;
  big?: boolean;
}) {
  const w = big ? 52 : 40;
  const h = big ? 42 : 34;
  const cx = x + w / 2;
  return (
    <g>
      {/* 리본 매듭 */}
      <path
        d={`M${cx} ${y - 2} q -10 -14 -18 -10 q -4 4 2 8 q 6 4 16 4`}
        fill={color}
      />
      <path
        d={`M${cx} ${y - 2} q 10 -14 18 -10 q 4 4 -2 8 q -6 4 -16 4`}
        fill={color}
      />
      {/* 상자 */}
      <rect x={x} y={y} width={w} height={h} rx="2.5" fill={color} />
      {/* 세로 리본 (흰 띠) */}
      <rect x={cx - 3} y={y} width="6" height={h} fill="#fdfdfb" opacity="0.85" />
      {/* 가로 리본 */}
      <rect x={x} y={y + h / 2 - 3} width={w} height="6" fill="#fdfdfb" opacity="0.85" />
    </g>
  );
}

const LinkButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
  padding: 12px 17px;
  border-radius: 999px;
  background: #e3eddf;
  color: #193b30;
  font: inherit;
  font-weight: 750;
  font-size: 14px;
  border: 1px solid transparent;
  cursor: pointer;
`;

const Intro = styled(Panel)`
  margin-bottom: 18px;

  .quote {
    font-size: 21px;
    color: ${C.green};
    font-weight: 650;
    letter-spacing: -0.03em;
    margin: 12px 0;
  }
`;

const CarouselWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (min-width: 621px) {
    max-width: 790px;
    margin: auto;
    gap: 12px;
  }
`;

const Rail = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  /* 마지막 카드에서 더 스크롤되어 빈 공간이 보이거나 상위 스크롤로 넘어가지 않도록 */
  overscroll-behavior-x: contain;
  padding: 4px 2px 14px;
  flex: 1;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Card = styled.article`
  flex: 0 0 min(760px, 100%);
  min-height: 510px;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  box-sizing: border-box;
  padding: clamp(28px, 5vw, 58px);
  background: ${C.panel};
  border: 1px solid ${C.line};
  border-radius: 18px;
  text-align: center;

  @media (max-width: 768px) {
    flex-basis: 100%;
    min-height: unset;
    padding: 26px 20px;
  }

  h3 {
    font-size: clamp(22px, 5vw, 34px);
    line-height: 1.35;
    letter-spacing: -0.03em;
    margin: 10px 0 12px;
    color: ${C.ink};
  }

  p {
    font-size: clamp(15px, 4vw, 18px);
    max-width: 680px;
    margin: 0 auto 10px;
    line-height: 1.8;
    color: #56645b;
  }
`;

const Symbol = styled.div`
  width: 132px;
  height: 132px;
  margin: 0 auto 22px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    margin: 0 auto 16px;
  }
`;

// 소책자의 강조 라벨 (결과 : … / 선물 : …)
const Highlight = styled.p`
  display: inline-block;
  font-weight: 750 !important;
  color: ${C.green2} !important;
  border-bottom: 2px solid ${C.green};
  padding-bottom: 3px;
  margin: 6px auto 16px !important;
`;

// 말씀 전문 블록
const VerseBlock = styled.div`
  max-width: 640px;
  margin: 18px auto 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Verse = styled.div`
  background: #f3f7f2;
  border-left: 3px solid ${C.green};
  border-radius: 10px;
  padding: 12px 15px;

  .text {
    font-size: 14px;
    line-height: 1.7;
    color: #4b5a51;
  }
  .ref {
    display: block;
    margin-top: 7px;
    font-size: 12px;
    font-weight: 800;
    color: ${C.green2};
    letter-spacing: 0.02em;
  }
`;

// 영접 기도문 강조 카드
const PrayerBody = styled.p`
  background: #fbf4f2;
  border: 1px solid #f0dcd7;
  border-radius: 14px;
  padding: 18px 20px !important;
  text-align: left !important;
  line-height: 1.9 !important;
  color: #5a4a46 !important;
`;

const Arrow = styled.button`
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  border: 1px solid ${C.line};
  border-radius: 50%;
  background: #fff;
  color: ${C.green2};
  font-size: 27px;
  line-height: 1;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition:
    opacity 0.15s,
    border-color 0.15s,
    background 0.15s;

  &:hover:not(:disabled) {
    border-color: #9eb6a3;
    background: #f5f8f4;
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }

  @media (max-width: 620px) {
    flex-basis: 32px;
    width: 32px;
    height: 32px;
    font-size: 22px;
  }
`;

const Note = styled.div`
  font-size: 12px;
  color: ${C.muted};
  display: flex;
  justify-content: space-between;
  margin: 4px 2px 0;
`;

const Summary = styled(Panel)`
  margin-top: 18px;
`;

export default function GospelCarousel({
  onSelectTab,
}: {
  onSelectTab: (tab: TabKey) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  // 현재 스크롤 위치가 맨 처음/맨 끝인지 추적해 화살표를 비활성화
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    // 서브픽셀 오차 보정용 여유값
    setAtStart(rail.scrollLeft <= 1);
    setAtEnd(rail.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  const scrollByCard = (dir: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("article");
    const width = card ? card.getBoundingClientRect().width : rail.clientWidth;
    rail.scrollBy({ left: (width + 14) * dir, behavior: "smooth" });
  };

  return (
    <Section>
      <Wrap>
        <SectionHead>
          <div>
            <Kicker>THE GREATEST HAPPINESS</Kicker>
            <H2>복음에 대해 들어보실래요?</H2>
          </div>
          <p>참된 행복은 어디에서 시작될까요? 복음의 이야기를 따라가 보세요.</p>
        </SectionHead>

        <Intro dark>
          <Tag>복음의 여정</Tag>
          <p className="quote">
            당신은 언제 가장 행복하다고 생각하십니까? 그 행복한 시간이 영원하다고
            생각하시나요?
          </p>
          <p>
            창조 → 죄 → 사랑 → 구원 → 초대 → 영접의 순서로, 전도 소책자의 이야기를
            한 장씩 따라가 보세요. 각 장에는 함께 읽을 말씀이 담겨 있습니다.
          </p>
          <Btn
            variant="dark"
            href="https://www.youtube.com/watch?v=8-KDN_-5zJA"
            target="_blank"
            rel="noopener"
          >
            복음 영상 보기 ↗
          </Btn>
        </Intro>

        <CarouselWrap>
          <Arrow
            type="button"
            aria-label="이전 내용"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
          >
            ‹
          </Arrow>

          <Rail
            ref={railRef}
            tabIndex={0}
            aria-label="복음 이야기 순서대로 보기"
            onScroll={updateEdges}
          >
            {GOSPEL_STEPS.map((step) => {
              const isPrayer = step.symbol === "heart-mending";
              return (
                <Card key={step.no}>
                  <Symbol aria-hidden>
                    <GospelSymbolIcon symbol={step.symbol} />
                  </Symbol>
                  <Tag>
                    {step.no} · {step.tag}
                  </Tag>
                  <h3>{step.title}</h3>
                  {step.body.map((line, i) =>
                    isPrayer ? (
                      <PrayerBody key={i}>{line}</PrayerBody>
                    ) : (
                      <p key={i}>{line}</p>
                    )
                  )}
                  {step.highlight && <Highlight>{step.highlight}</Highlight>}
                  {step.verses.length > 0 && (
                    <VerseBlock>
                      {step.verses.map((v, i) => (
                        <Verse key={i}>
                          <span className="text">{v.text}</span>
                          <span className="ref">— {v.ref}</span>
                        </Verse>
                      ))}
                    </VerseBlock>
                  )}
                  {step.link && (
                    <LinkButton
                      type="button"
                      onClick={() => onSelectTab(step.link!.tab)}
                    >
                      {step.link.label} →
                    </LinkButton>
                  )}
                </Card>
              );
            })}
          </Rail>

          <Arrow
            type="button"
            aria-label="다음 내용"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
          >
            ›
          </Arrow>
        </CarouselWrap>

        <Note>
          <span>옆으로 넘겨 복음의 이야기를 순서대로 살펴보세요</span>
          <span>← 스와이프 →</span>
        </Note>

        <Summary>
          <h3>복음의 핵심을 한눈에</h3>
          <p>
            사람은 하나님과 교제하도록 창조되었지만 죄로 하나님을 떠났습니다.
            하나님은 사랑으로 예수 그리스도를 보내셨고, 예수님은 대속물로
            죽으시고 부활하셨습니다. 예수님을 믿고 영접하는 사람은 하나님의
            자녀가 되어 평안과 영생을 누립니다.
          </p>
          <Small>
            관련 말씀: 창세기 1:27 · 요한일서 4:8 · 로마서 3:23 · 로마서 6:23 ·
            마가복음 10:45 · 요한복음 14:27 · 요한복음 10:10 · 요한복음 3:16 ·
            요한복음 1:12 · 요한계시록 3:20
          </Small>
        </Summary>
      </Wrap>
    </Section>
  );
}
