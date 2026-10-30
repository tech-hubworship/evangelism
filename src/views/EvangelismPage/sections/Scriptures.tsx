"use client";

import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import {
  SCRIPTURES,
  SCRIPTURE_TOPICS,
  ScriptureTopic,
} from "../data";
import { C, Section, Wrap, SectionHead, Kicker, H2 } from "../styles";

// 주제 필터 칩
const Chips = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 2px 0 22px;
`;

const Chip = styled.button<{ active: boolean }>`
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
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  background: #fff;
  border: 1px solid ${C.line};
  border-radius: 18px;
  padding: clamp(20px, 3vw, 28px);
  display: flex;
  flex-direction: column;
  gap: 16px;

  .topic {
    align-self: flex-start;
    background: #eaf0e9;
    color: #345444;
    padding: 5px 11px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 750;
  }

  .verse {
    margin: 0;
    color: ${C.ink};
    font-size: clamp(15px, 1.6vw, 17px);
    line-height: 1.85;
  }
  .verse span {
    display: block;
  }

  cite {
    font-size: 12px;
    font-style: normal;
    color: ${C.muted};
    font-weight: 700;
    letter-spacing: 0.01em;
  }
`;

const Empty = styled.p`
  color: ${C.muted};
  font-size: 14px;
  padding: 30px 0;
  text-align: center;
`;

type Filter = "all" | ScriptureTopic;

export default function Scriptures() {
  const [filter, setFilter] = useState<Filter>("all");

  const labelOf = useMemo(() => {
    const map = new Map(SCRIPTURE_TOPICS.map((t) => [t.key, t.label]));
    return (key: ScriptureTopic) => map.get(key) ?? "";
  }, []);

  const list = useMemo(
    () =>
      filter === "all"
        ? SCRIPTURES
        : SCRIPTURES.filter((s) => s.topic === filter),
    [filter]
  );

  return (
    <Section>
      <Wrap>
        <SectionHead>
          <div>
            <Kicker>SCRIPTURE FOR YOU</Kicker>
            <H2>말씀 추천</H2>
          </div>
          <p>지금 마음에 가까운 주제를 선택해 말씀을 만나보세요.</p>
        </SectionHead>

        <Chips role="group" aria-label="말씀 주제 선택">
          <Chip
            type="button"
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            전체 보기
          </Chip>
          {SCRIPTURE_TOPICS.map((t) => (
            <Chip
              key={t.key}
              type="button"
              active={filter === t.key}
              onClick={() => setFilter(t.key)}
            >
              {t.label}
            </Chip>
          ))}
        </Chips>

        {list.length === 0 ? (
          <Empty>해당 주제의 말씀이 아직 준비 중입니다.</Empty>
        ) : (
          <Cards>
            {list.map((s, i) => (
              <Card key={`${s.ref}-${i}`}>
                <span className="topic">{labelOf(s.topic)}</span>
                <blockquote className="verse">
                  {s.lines.map((line, j) => (
                    <span key={j}>{line}</span>
                  ))}
                </blockquote>
                <cite>{s.ref}</cite>
              </Card>
            ))}
          </Cards>
        )}
      </Wrap>
    </Section>
  );
}
