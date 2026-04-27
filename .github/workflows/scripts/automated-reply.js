const { OpenAI } = require("openai");
const {
  QueryAntVDocumentTool,
  ExtractAntVTopicTool,
} = require("@antv/mcp-server-antv/build/tools");
const {
  queryDeepWiki,
} = require("@antv/mcp-server-antv/build/utils/deepwiki");

const DEFAULT_LIBRARY = "s2";

async function getAutomatedReply({
  core,
  context,
  post,
  postType,
  library = DEFAULT_LIBRARY,
}) {
  try {
    core.info(`优先使用 DeepWiki 回复 ${postType}...`);
    const response = await queryDeepWiki({
      repoName: library,
      question: prepareDeepWikiQuestion(context, postType, post),
      connectionMode: "close-after-query",
    });

    if (!response || !response.trim()) {
      throw new Error("DeepWiki 返回了空内容");
    }

    core.info(`DeepWiki 回复 ${postType} 成功`);
    return {
      response: response.trim(),
      source: "deepwiki",
    };
  } catch (error) {
    core.warning(
      `DeepWiki 回复 ${postType} 失败，回退到现有链路: ${error.message}`,
    );
  }

  const response = await getLegacyAutomatedReply({
    core,
    context,
    post,
    postType,
    library,
  });

  return {
    response,
    source: "legacy",
  };
}

function buildAutoReplyBody(userLogin, response, source) {
  const sourceLabel =
    source === "deepwiki" ? "DeepWiki" : "AI 文档检索兜底链路";

  return `@${userLogin} 您好！以下是关于您问题的自动回复：\n\n${response}\n\n---\n*此回复由 AI 助手自动生成（${sourceLabel}）。如有任何问题，我们的团队会尽快跟进。*`;
}

async function getLegacyAutomatedReply({
  core,
  context,
  post,
  postType,
  library,
}) {
  core.info(`开始执行 ${postType} 现有自动回复链路...`);

  const combinedQuery = prepareAIPrompt(context, postType, post);
  const topicExtractionResult = await ExtractAntVTopicTool.run({
    query: combinedQuery,
  });
  const extractionPrompt = topicExtractionResult?.content?.[0]?.text;

  if (!extractionPrompt) {
    throw new Error("ExtractAntVTopicTool 未返回可用内容");
  }

  const aiResponse = await getAIResponse(
    core,
    extractionPrompt,
    buildDefaultTopicExtraction(post),
  );
  const processedTopicContent = parseTopicExtraction(aiResponse, post);

  const queryDocumentParams = {
    library,
    query: combinedQuery,
    topic: processedTopicContent.topic,
    intent: processedTopicContent.intent,
    tokens: 5000,
    channel: "Context7",
    ...(processedTopicContent.subTasks && {
      subTasks: processedTopicContent.subTasks,
    }),
  };
  const documentationResult = await QueryAntVDocumentTool.run(
    queryDocumentParams,
  );
  const documentationPrompt = documentationResult?.content?.[0]?.text;

  if (!documentationPrompt) {
    throw new Error("QueryAntVDocumentTool 未返回可用内容");
  }

  return await getAIResponse(
    core,
    documentationPrompt,
    getDefaultReply(postType),
  );
}

function prepareDeepWikiQuestion(context, postType, post) {
  const body = post.body?.trim() || "暂无补充内容";
  return `
你是 ${context.repo.repo} 项目的智能助手。请直接基于 antvis/S2 的文档与仓库信息，回答下面这个 GitHub ${postType}。

要求：
- 直接回答用户问题，不要解释你的思考过程
- 回答尽量准确、简洁，并使用 Markdown
- 如果缺少关键上下文，请明确指出还需要补充什么信息

标题：${post.title}
内容：${body}
`.trim();
}

function prepareAIPrompt(context, postType, post) {
  const body = post.body?.trim() || "暂无补充内容";
  return `
你是 ${context.repo.repo} 项目的智能助手。这是一个处理 GitHub ${postType} 的自动回复系统。
请分析以下 ${postType} 并提供专业、有帮助的回复。

## 当前 ${postType}
- 标题: ${post.title}
- 内容: ${body}

请提供完整、有帮助的回复，但不要过于冗长。回复应该条理清晰，使用适当的 Markdown 格式。
`.trim();
}

function buildDefaultTopicExtraction(post) {
  const fallbackTopic = [post.title, post.body]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);

  return `\`\`\`json
{"topic":"${escapeJsonString(fallbackTopic || "S2 issue/discussion")}","intent":"explain"}
\`\`\``;
}

function parseTopicExtraction(aiResponse, post) {
  const jsonMatch =
    aiResponse.match(/```json\s*(\{[\s\S]*?\})\s*```/) ||
    aiResponse.match(/(\{[\s\S]*\})/);

  if (!jsonMatch) {
    return JSON.parse(
      buildDefaultTopicExtraction(post).replace(/```json\s*|\s*```/g, ""),
    );
  }

  try {
    return JSON.parse(jsonMatch[1]);
  } catch (error) {
    return JSON.parse(
      buildDefaultTopicExtraction(post).replace(/```json\s*|\s*```/g, ""),
    );
  }
}

function escapeJsonString(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function getAIResponse(core, userQuestion, fallbackText) {
  try {
    core.info("正在调用 GitHub AI API...");
    const token = process.env.GH_TOKEN;

    if (!token) {
      throw new Error("未找到 GH_TOKEN 环境变量");
    }

    const client = new OpenAI({
      baseURL: "https://models.github.ai/inference",
      apiKey: token,
    });

    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: userQuestion }],
      temperature: 0.7,
      top_p: 1.0,
      model: "openai/gpt-4.1",
    });

    core.info("成功获取 AI 响应");
    return response.choices[0].message.content;
  } catch (error) {
    core.warning(`调用 GitHub AI API 失败: ${error.message}`);
    if (fallbackText) {
      return fallbackText;
    }
    throw error;
  }
}

function getDefaultReply(postType) {
  return `感谢您提交这个 ${postType}！\n\n我们的团队会尽快查看您的问题。为了帮助我们更快定位问题，请尽量补充复现步骤、预期行为、实际行为以及版本信息。`;
}

module.exports = {
  getAutomatedReply,
  buildAutoReplyBody,
};
