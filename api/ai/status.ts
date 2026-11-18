import {
  handleAiStatus,
  type ApiRequestLike,
  type ApiResponseLike,
} from "../../lib/aiServer.js";

export default async function handler(
  req: ApiRequestLike,
  res: ApiResponseLike
): Promise<void> {
  await handleAiStatus(req, res);
}
