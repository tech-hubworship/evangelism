import { supabaseAdmin } from "@src/lib/supabase";
import { jsonError, jsonOk, methodNotAllowed } from "@src/lib/api/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUESTION_LENGTH = 3000;
const MAX_NAME_LENGTH = 60;
const MAX_CONTACT_LENGTH = 200;
const DUPLICATE_WINDOW_MINUTES = 3;

/** 공개 답변 목록에서 한 번에 내려줄 최대 개수 */
const PUBLIC_ANSWERED_LIMIT = 50;

/**
 * 전도 페이지 질문 접수 API.
 *
 * 전도 대상자는 비로그인 익명 방문자이므로 세션/인증을 요구하지 않는다.
 * 간단한 중복/도배 방지를 위해 동일 IP + 동일 질문이 짧은 시간 내 반복되면 거부한다.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    const rawQuestion = typeof body.question === "string" ? body.question.trim() : "";
    const rawName = typeof body.name === "string" ? body.name.trim() : "";
    const rawContact = typeof body.contact === "string" ? body.contact.trim() : "";

    // 연락처가 없으면 답변을 전달할 방법이 없으므로 질문 자체를 받지 않는다.
    if (!rawContact) {
      return jsonError("답변 받을 연락처를 입력해주세요.", 400);
    }
    if (rawContact.length > MAX_CONTACT_LENGTH) {
      return jsonError(`연락처는 ${MAX_CONTACT_LENGTH}자를 초과할 수 없습니다.`, 400);
    }
    if (!rawQuestion) {
      return jsonError("질문 내용을 입력해주세요.", 400);
    }
    if (rawQuestion.length > MAX_QUESTION_LENGTH) {
      return jsonError(`질문은 ${MAX_QUESTION_LENGTH}자를 초과할 수 없습니다.`, 400);
    }

    // name 컬럼은 NOT NULL 이므로 익명(미입력) 시 null 대신 빈 문자열로 저장한다.
    const name = rawName ? rawName.slice(0, MAX_NAME_LENGTH) : "";
    const contact = rawContact.slice(0, MAX_CONTACT_LENGTH);

    const userIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;

    // 중복/도배 방지: 같은 IP + 같은 질문이 최근 N분 내 있으면 거부
    if (userIp) {
      const since = new Date(
        Date.now() - DUPLICATE_WINDOW_MINUTES * 60 * 1000
      ).toISOString();

      const { data: recent, error: dupError } = await supabaseAdmin
        .from("evangelism_questions")
        .select("id")
        .eq("question", rawQuestion)
        .gte("created_at", since)
        .limit(1);

      if (!dupError && recent && recent.length > 0) {
        return jsonError(
          "같은 질문이 방금 접수되었어요. 잠시 후 다시 시도해주세요.",
          429
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from("evangelism_questions")
      .insert({
        name,
        question: rawQuestion,
        contact,
        status: "new",
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("전도 질문 저장 오류:", error);
      return jsonError("질문 저장에 실패했습니다.", 500, {
        details: (error as { message?: string }).message,
      });
    }

    return jsonOk(
      {
        success: true,
        message: "질문이 전달되었어요. 소중한 마음으로 읽겠습니다.",
        id: data.id,
      },
      201
    );
  } catch (error) {
    console.error("Evangelism Questions API Error:", error);
    return jsonError("서버 오류가 발생했습니다.", 500);
  }
}

/**
 * 공개 Q&A 목록.
 *
 * 관리자(hub_web)에서 답변을 작성해 status 가 "answered" 가 된 질문만 노출한다.
 * 개인정보 보호를 위해 contact 는 절대 내려주지 않으며, 이름도 생략한다.
 * (익명으로 다른 방문자들이 "어떤 질문에 어떻게 답했는지" 를 볼 수 있게 하는 용도)
 */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("evangelism_questions")
      .select("id, question, answer, answered_at, created_at")
      .eq("status", "answered")
      .not("answer", "is", null)
      .order("answered_at", { ascending: false })
      .limit(PUBLIC_ANSWERED_LIMIT);

    if (error) {
      console.error("공개 Q&A 조회 오류:", error);
      return jsonError("답변 목록을 불러오지 못했습니다.", 500);
    }

    const items = (data ?? [])
      .filter((row) => typeof row.answer === "string" && row.answer.trim())
      .map((row) => ({
        id: row.id,
        question: row.question,
        answer: row.answer,
        answeredAt: row.answered_at ?? row.created_at ?? null,
      }));

    return jsonOk({ items });
  } catch (error) {
    console.error("Evangelism Public Q&A API Error:", error);
    return jsonError("서버 오류가 발생했습니다.", 500);
  }
}

export function PUT() {
  return methodNotAllowed(["GET", "POST"]);
}

export function PATCH() {
  return methodNotAllowed(["GET", "POST"]);
}

export function DELETE() {
  return methodNotAllowed(["GET", "POST"]);
}
