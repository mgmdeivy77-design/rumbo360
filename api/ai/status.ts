import {
  handleAiStatus,
  type ApiRequestLike,
  type ApiResponseLike,
} from "../../lib/aiServer.ts";

export default async function handler(
  req: ApiRequestLike,
  res: ApiResponseLike
): Promise<void> {
  await handleAiStatus(req, res);
}
