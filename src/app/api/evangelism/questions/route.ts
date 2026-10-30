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
 * 연락처 수단(종류). 방문자가 드롭다운에서 하나를 고르고, 종류에 맞는 형식만
 * 통과시킨다. DB(contact 컬럼)에는 "라벨: 값" 형태로 저장해 admin 에서
 * 어떤 수단으로 답장해야 하는지 한눈에 보이게 한다.
 */
type ContactType = "email" | "kakao" | "phone";

const CONTACT_LABEL: Record<ContactType, string> = {
  email: "이메일",
  kakao: "카카오톡 ID",
  phone: "전화번호",
};

function isContactType(v: unknown): v is ContactType {
  return v === "email" || v === "kakao" || v === "phone";
}

/**
 * 선택한 수단에 맞게 연락처 값을 검증 + 정규화한다.
 * - 유효하면 { ok: true, value } (정규화된 값) 반환
 * - 유효하지 않으면 { ok: false, message } (사용자 안내 문구) 반환
 */
function validateContact(
  type: ContactType,
  raw: string
): { ok: true; value: string } | { ok: false; message: string } {
  const v = raw.trim();

  switch (type) {
    case "email": {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return { ok: true, value: v };
      return { ok: false, message: "이메일 주소를 정확히 입력해주세요. (예: name@example.com)" };
    }
    case "kakao": {
      // 카카오톡 ID: 영문 소문자/숫자/._- 4~20자 (영문 1자 이상 포함)
      if (/^[a-z0-9._-]{4,20}$/.test(v) && /[a-z]/.test(v))
        return { ok: true, value: v };
      return {
        ok: false,
        message: "카카오톡 ID를 정확히 입력해주세요. (영문 소문자·숫자 4~20자)",
      };
    }
    case "phone": {
      const digits = v.replace(/\D/g, "");
      // 국내 휴대폰/일반전화: 숫자 9~11자리
      if (/^[0-9()+\-\s]+$/.test(v) && digits.length >= 9 && digits.length <= 11)
        return { ok: true, value: v };
      return {
        ok: false,
        message: "전화번호를 정확히 입력해주세요. (예: 010-1234-5678)",
      };
    }
  }
}

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
    const rawContactType = body.contactType;

    // 연락처 수단(종류) 선택 필수
    if (!isContactType(rawContactType)) {
      return jsonError("답변 받을 연락처 종류를 선택해주세요.", 400);
    }
    // 연락처가 없으면 답변을 전달할 방법이 없으므로 질문 자체를 받지 않는다.
    if (!rawContact) {
      return jsonError("답변 받을 연락처를 입력해주세요.", 400);
    }
    if (rawContact.length > MAX_CONTACT_LENGTH) {
      return jsonError(`연락처는 ${MAX_CONTACT_LENGTH}자를 초과할 수 없습니다.`, 400);
    }
    // 선택한 수단에 맞는 형식인지 검증 (예: "010-2" 같은 불완전 번호 차단)
    const contactCheck = validateContact(rawContactType, rawContact);
    if (!contactCheck.ok) {
      return jsonError(contactCheck.message, 400);
    }
    if (!rawQuestion) {
      return jsonError("질문 내용을 입력해주세요.", 400);
    }
    if (rawQuestion.length > MAX_QUESTION_LENGTH) {
      return jsonError(`질문은 ${MAX_QUESTION_LENGTH}자를 초과할 수 없습니다.`, 400);
    }

    // name 컬럼은 NOT NULL 이므로 익명(미입력) 시 null 대신 빈 문자열로 저장한다.
    const name = rawName ? rawName.slice(0, MAX_NAME_LENGTH) : "";
    // DB 에는 "라벨: 값" 형태로 저장해 admin 이 수단을 바로 알 수 있게 한다.
    const contact = `${CONTACT_LABEL[rawContactType]}: ${contactCheck.value}`.slice(
      0,
      MAX_CONTACT_LENGTH
    );

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
 * 관리자(hub_web)에서 답변을 작성한 질문을 노출한다.
 * status 가 "answered"(답변 완료) 든 "closed"(종료) 든, 실제 answer 가 채워진
 * 질문이면 공개한다. (관리자 상태 라벨에 의존하지 않고 "답변 유무" 로 판단)
 * 개인정보 보호를 위해 contact 는 절대 내려주지 않으며, 이름도 생략한다.
 * (익명으로 다른 방문자들이 "어떤 질문에 어떻게 답했는지" 를 볼 수 있게 하는 용도)
 */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("evangelism_questions")
      .select("id, question, answer, answered_at, created_at")
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

    // 실시간 갱신이 필요 없으므로 CDN 에서 하루(86400초) 캐싱한다.
    // stale-while-revalidate 로 만료 후에도 즉시 응답하고 백그라운드에서 갱신.
    return jsonOk({ items }, 200, {
      "Cache-Control":
        "public, s-maxage=86400, max-age=0, stale-while-revalidate=86400",
    });
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
