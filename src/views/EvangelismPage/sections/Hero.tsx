"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import type { TabKey } from "../data";
import { HERO_VERSES, HERO_VERSE_INTERVAL } from "../data";
import { C, Wrap } from "../styles";

const Nav = styled.header`
  display: flex;
  align-items: center;
  padding: 20px 0;
`;

const Brand = styled.div`
  font-weight: 800;
  letter-spacing: -0.04em;
  color: ${C.green};
  font-size: 18px;

  span {
    display: block;
    font-size: 10px;
    letter-spacing: 0.18em;
    color: ${C.muted};
    font-weight: 600;
  }
`;

const HeroButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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

const HeroBox = styled.section`
  background: ${C.green};
  color: #fff;
  border-radius: 24px;
  padding: clamp(28px, 6vw, 68px);
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 36px;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 20px;
    border-radius: 18px;
  }
`;

const HeroCopy = styled.div`
  flex: 1;
  min-width: 0;

  .eyebrow {
    font-size: 12px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #c8d9ca;
    font-weight: 700;
  }

  h1 {
    font-size: clamp(30px, 7vw, 62px);
    line-height: 1.18;
    letter-spacing: -0.055em;
    margin: 14px 0 18px;
    max-width: 700px;
  }

  p {
    max-width: 560px;
    color: #e0e9e1;
    margin: 0 0 28px;
    word-break: keep-all;
  }

  @media (max-width: 768px) {
    h1 {
      margin: 10px 0 14px;
    }
    p {
      margin: 0 0 20px;
      font-size: 15px;
    }
  }
`;

const VerseBadge = styled.aside`
  flex: 0 0 clamp(240px, 30vw, 330px);
  width: clamp(240px, 30vw, 330px);
  min-height: 190px;
  border: 1px solid #789488;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 26px;
  color: #e0e9e1;
  gap: 12px;

  @media (max-width: 768px) {
    align-self: stretch;
    width: 100%;
    flex-basis: auto;
    min-height: unset;
    padding: 20px;
  }

  .mark {
    font-size: 26px;
    line-height: 1;
    color: #c8d9ca;
  }
  blockquote {
    margin: 0;
    font-size: clamp(14px, 1.35vw, 17px);
    line-height: 1.65;
    letter-spacing: -0.035em;
    white-space: pre-line;
    word-break: keep-all;
  }
  cite {
    font-size: 12px;
    font-style: normal;
    color: #c8d9ca;
    font-weight: 700;
  }

  /* 말씀이 바뀔 때 부드럽게 전환 */
  .verse-fade {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    animation: verseIn 0.7s ease;
  }

  @keyframes verseIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .verse-fade {
      animation: none;
    }
  }
`;

const Dots = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 4px;

  button {
    width: 7px;
    height: 7px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: #789488;
    cursor: pointer;
    transition: background 0.2s;

    &[aria-current="true"] {
      background: #e0e9e1;
    }
  }
`;

export default function Hero({
  onSelectTab,
}: {
  onSelectTab: (tab: TabKey) => void;
}) {
  // 썸네일 말씀 자동 회전 (기본 20초 간격)
  const [verseIdx, setVerseIdx] = useState(0);
  // 수동 선택 시에도 타이머를 리셋하기 위한 트리거
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (HERO_VERSES.length <= 1) return;
    const timer = setInterval(() => {
      setVerseIdx((i) => (i + 1) % HERO_VERSES.length);
    }, HERO_VERSE_INTERVAL);
    return () => clearInterval(timer);
  }, [cycle]);

  const pickVerse = (i: number) => {
    setVerseIdx(i);
    setCycle((c) => c + 1); // 타이머 재시작
  };

  const verse = HERO_VERSES[verseIdx];

  return (
    <Wrap>
      <Nav>
        <Brand>
          한 영혼을 향한 사랑
          <span>LOVE · FAITH · COMMUNITY</span>
        </Brand>
      </Nav>

      <HeroBox>
        <HeroCopy>
          <div className="eyebrow">YOU ARE LOVED</div>
          <h1>
            하나님이
            <br />
            당신을 사랑하십니다
          </h1>
          <p>
            하나님에 대해 궁금했던 이야기,
            <br />
            누군가에게 묻기 어려웠던 질문들.
            <br />
            <br />
            이곳에서 천천히 알아가며
            <br />
            마음 편히 쉬어 가세요.
          </p>
          <HeroButton type="button" onClick={() => onSelectTab("explore")}>
            천천히 둘러보기 <span>↘</span>
          </HeroButton>
        </HeroCopy>

        <VerseBadge aria-label="오늘의 말씀" aria-live="polite">
          <div className="verse-fade" key={verseIdx}>
            <div className="mark">“</div>
            <blockquote>{verse.text}</blockquote>
            <cite>{verse.ref}</cite>
          </div>
          {HERO_VERSES.length > 1 && (
            <Dots role="tablist" aria-label="말씀 선택">
              {HERO_VERSES.map((v, i) => (
                <button
                  key={v.ref}
                  type="button"
                  aria-current={i === verseIdx}
                  aria-label={`${v.ref} 말씀 보기`}
                  onClick={() => pickVerse(i)}
                />
              ))}
            </Dots>
          )}
        </VerseBadge>
      </HeroBox>
    </Wrap>
  );
}
