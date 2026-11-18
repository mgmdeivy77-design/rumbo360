import {
  handleAiGenerate,
  type ApiRequestLike,
  type ApiResponseLike,
} from "../../lib/aiServer.js";

export default async function handler(
  req: ApiRequestLike,
  res: ApiResponseLike
): Promise<void> {
  await handleAiGenerate(req, res);
}
