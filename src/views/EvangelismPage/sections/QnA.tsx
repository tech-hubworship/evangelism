"use client";

import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { C, Section, Wrap, SectionHead, Kicker, H2, Panel, Tag } from "../styles";

const SubmitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 17px;
  border-radius: 999px;
  background: ${C.green};
  color: #fff;
  font: inherit;
  font-weight: 750;
  font-size: 14px;
  border: 1px solid transparent;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const Split = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.input`
  display: block;
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #d8ded6;
  border-radius: 12px;
  background: #fff;
  font: inherit;
  font-size: 14px;
  margin: 8px 0 14px;

  &:focus {
    outline: 2px solid #a8c1ab;
    outline-offset: 1px;
  }
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #d8ded6;
  border-radius: 12px;
  background: #fff;
  font: inherit;
  font-size: 14px;
  margin: 8px 0 14px;
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: 2px solid #a8c1ab;
    outline-offset: 1px;
  }

  &:disabled {
    background: #f3f4f2;
    color: #9aa39b;
    cursor: not-allowed;
  }
`;

const StatusBox = styled.div<{ tone: "ok" | "err" }>`
  padding: 12px;
  border-radius: 10px;
  font-size: 13px;
  margin-top: 12px;
  background: ${(p) => (p.tone === "ok" ? "#edf4ed" : "#fbecec")};
  color: ${(p) => (p.tone === "ok" ? "#244d36" : "#8a2f2f")};
`;

const Label = styled.label`
  display: block;
  font-size: 14px;

  .opt {
    font-size: 12px;
    color: ${C.muted};
    font-weight: 400;
  }

  .req {
    font-size: 12px;
    color: ${C.green2};
    font-weight: 700;
  }
`;

// --- 공개 Q&A(다른 분들이 남긴 질문과 답변) ---
const AnsweredWrap = styled.div`
  margin-top: 34px;
`;

const AnsweredHead = styled.div`
  margin-bottom: 14px;

  h3 {
    margin: 0 0 4px;
    font-size: 18px;
    letter-spacing: -0.01em;
    color: ${C.ink};
  }
  p {
    margin: 0;
    font-size: 13px;
    color: ${C.muted};
  }
`;

const QaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const QaCard = styled.div`
  border: 1px solid ${C.line};
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
`;

const QaItem = styled.div`
  padding: 15px 16px;

  & + & {
    border-top: 1px solid ${C.line};
  }

  .row {
    display: flex;
    gap: 10px;
    align-items: baseline;
  }

  .badge {
    flex: 0 0 auto;
    width: 22px;
    height: 22px;
    border-radius: 7px;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 800;
  }
  .badge.q {
    background: ${C.sage};
    color: ${C.green2};
  }
  .badge.a {
    background: ${C.green};
    color: #fff;
  }

  .text {
    flex: 1 1 auto;
    font-size: 14px;
    line-height: 1.65;
    color: ${C.ink};
    white-space: pre-line;
    word-break: keep-all;
  }

  &.answer {
    background: #f6f9f5;
  }
  &.answer .text {
    color: #2b3d31;
  }

  .date {
    margin-top: 8px;
    font-size: 12px;
    color: ${C.muted};
  }
`;

const EmptyNote = styled.div`
  padding: 18px 16px;
  border: 1px dashed ${C.line};
  border-radius: 16px;
  font-size: 13px;
  color: ${C.muted};
  text-align: center;
`;

interface AnsweredQa {
  id: string | number;
  question: string;
  answer: string;
  answeredAt: string | null;
}

function formatDate(value: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function QnA() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ tone: "ok" | "err"; msg: string } | null>(
    null
  );

  const [answered, setAnswered] = useState<AnsweredQa[]>([]);
  const [answeredLoading, setAnsweredLoading] = useState(true);

  // 연락처가 비어 있으면 질문 자체를 작성/전송할 수 없다.
  const contactMissing = !contact.trim();

  const loadAnswered = useCallback(async () => {
    try {
      const res = await fetch("/api/evangelism/questions", { method: "GET" });
      const data = await res.json();
      if (res.ok && Array.isArray(data.items)) {
        setAnswered(data.items as AnsweredQa[]);
      }
    } catch {
      // 공개 목록은 실패해도 폼 사용에는 영향 없음 — 조용히 넘어간다.
    } finally {
      setAnsweredLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnswered();
  }, [loadAnswered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      setResult({ tone: "err", msg: "답변 받을 연락처를 먼저 입력해주세요." });
      return;
    }
    if (!question.trim()) {
      setResult({ tone: "err", msg: "질문 내용을 입력해주세요." });
      return;
    }

    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/evangelism/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          question: question.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "질문 전송에 실패했습니다.");
      }
      setResult({
        tone: "ok",
        msg: data.message || "질문이 전달되었어요. 소중한 마음으로 읽겠습니다.",
      });
      setName("");
      setContact("");
      setQuestion("");
    } catch (err) {
      setResult({
        tone: "err",
        msg: (err as Error).message || "질문 전송에 실패했습니다.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section>
      <Wrap>
        <SectionHead>
          <div>
            <Kicker>QUESTIONS & ANSWERS</Kicker>
            <H2>궁금한 점을 남겨주세요</H2>
          </div>
          <p>정답을 몰라도 괜찮아요. 편하게 질문해 주세요.</p>
        </SectionHead>

        <Split>
          <Panel dark>
            <Tag>ASK ANYTHING</Tag>
            <h3>어떤 질문이든 환영합니다!</h3>
            <p>
              하나님은 정말 계실까? 교회는 어떤 곳일까? 믿음에 대한 고민부터 요즘
              마음을 무겁게 하는 이야기까지, 무엇이든 편하게 나눠주세요.
            </p>
            <p>
              저희가 모든 답을 알고 있거나 당장 고민을 해결해 드릴 수는 없겠지만,
              여러분의 이야기를 소중히 여기며 여러분의 마음과 삶을 위해 진심으로
              기도하겠습니다.
            </p>
            <p>
              답변을 드릴 수 있도록 연락처를 꼭 남겨주세요. 남겨주신 연락처로
              저희가 정성껏 답해 드릴게요. 이름은 익명으로 두셔도 괜찮습니다.
            </p>
          </Panel>

          <Panel>
            <form onSubmit={handleSubmit}>
              <Label htmlFor="ev-nickname">
                <strong>이름 또는 별명</strong> <span className="opt">(선택)</span>
              </Label>
              <Field
                id="ev-nickname"
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="익명으로 남겨도 괜찮아요"
              />

              <Label htmlFor="ev-contact">
                <strong>답변 받을 연락처</strong>{" "}
                <span className="req">(필수 · 답변드릴 방법이에요)</span>
              </Label>
              <Field
                id="ev-contact"
                maxLength={200}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="이메일 · 카카오톡 ID · 전화번호 등 편한 방법으로"
                required
                aria-required="true"
              />

              <Label htmlFor="ev-question">
                <strong>질문 내용</strong>
              </Label>
              <TextArea
                id="ev-question"
                maxLength={3000}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  contactMissing
                    ? "답변 받을 연락처를 먼저 입력해주세요."
                    : "궁금한 점을 자유롭게 적어주세요."
                }
                required
                disabled={contactMissing}
                aria-disabled={contactMissing}
                title={
                  contactMissing
                    ? "답변 받을 연락처를 먼저 입력해주세요."
                    : undefined
                }
              />

              <SubmitBtn type="submit" disabled={submitting || contactMissing}>
                {submitting ? "전송 중..." : "질문 보내기"}
              </SubmitBtn>

              {result && (
                <StatusBox tone={result.tone} role="status">
                  {result.msg}
                </StatusBox>
              )}
            </form>
          </Panel>
        </Split>

        <AnsweredWrap>
          <AnsweredHead>
            <h3>다른 분들이 남긴 질문과 답변</h3>
            <p>
              먼저 질문을 남겨주신 분들께 드린 답변이에요. 비슷한 고민이 있다면
              참고해 보세요. (개인정보 보호를 위해 이름·연락처는 공개하지
              않습니다.)
            </p>
          </AnsweredHead>

          {answeredLoading ? (
            <EmptyNote>답변을 불러오는 중이에요…</EmptyNote>
          ) : answered.length === 0 ? (
            <EmptyNote>
              아직 공개된 답변이 없어요. 첫 번째 질문을 남겨주세요.
            </EmptyNote>
          ) : (
            <QaList>
              {answered.map((qa) => (
                <QaCard key={qa.id}>
                  <QaItem>
                    <div className="row">
                      <span className="badge q" aria-hidden>
                        Q
                      </span>
                      <div className="text">{qa.question}</div>
                    </div>
                  </QaItem>
                  <QaItem className="answer">
                    <div className="row">
                      <span className="badge a" aria-hidden>
                        A
                      </span>
                      <div className="text">{qa.answer}</div>
                    </div>
                    {formatDate(qa.answeredAt) && (
                      <div className="date">{formatDate(qa.answeredAt)} 답변</div>
                    )}
                  </QaItem>
                </QaCard>
              ))}
            </QaList>
          )}
        </AnsweredWrap>
      </Wrap>
    </Section>
  );
}
