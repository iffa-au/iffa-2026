import { isSignedQuestionId } from "@/modules/chatbot/lib/guard";
import { sendFeedback } from "@/modules/chatbot/lib/insights";

/**
 * POST /api/chat/feedback: the visitor's thumbs up / down on one answer.
 *
 * Body: { qid, qsig, helpful: boolean }. `qid` / `qsig` come from the answer's
 * trailer (chat-route.ts); the signature proves the visitor really received
 * that answer, so nobody can vote on other people's questions by guessing ids.
 * Passed on to cms-hub, where admins see disliked answers in the CMS.
 */
export async function POST(request: Request) {
	const body = (await request.json().catch(() => null)) as {
		qid?: unknown;
		qsig?: unknown;
		helpful?: unknown;
	} | null;

	if (!body || typeof body.helpful !== "boolean" || !isSignedQuestionId(body.qid, body.qsig)) {
		return Response.json({ ok: false }, { status: 400 });
	}
	const ok = await sendFeedback(body.qid as string, body.helpful);
	return Response.json({ ok }, { status: ok ? 200 : 502 });
}
