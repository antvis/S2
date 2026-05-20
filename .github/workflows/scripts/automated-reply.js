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

function buildAutoReplyBody(userLogin, response, source, postType) {
  const sourceLabel =
    source === "deepwiki" ? "DeepWiki" : "AI 文档检索兜底链路";

  if (postType === "issue") {
    return `@${userLogin} 感谢反馈！\n\n${response}\n\n---\n> 🤖 *此回复由 AI 助手自动生成（${sourceLabel}），仅供初步参考。维护者会尽快确认和跟进。*\n>\n> **如果信息不足，请补充：**\n> - 具体 S2 版本号（\`npm ls @antv/s2\`）\n> - 最小可复现 Demo（[CodeSandbox](https://codesandbox.io/) / [StackBlitz](https://stackblitz.com/)）\n> - 浏览器 + OS 信息`;
  }

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

  if (postType === "issue") {
    return `
你是 ${context.repo.repo} 项目的核心维护者。请基于 antvis/S2 的源码与仓库信息，诊断下面这个 GitHub Issue。

你的目标是：帮用户解决问题，或者指出根因。

要求：
1. 先判断这是 Bug 报告还是 Feature 请求
2. 如果是 Bug：
   - 尝试定位可能的根因（相关的源码模块、函数、逻辑）
   - 如果在某个版本已修复，只提这一个最相关的版本，不要罗列历史修复记录
   - 如果能判断，给出临时 workaround
   - 如果信息不足以判断，明确指出还需要什么（版本号、最小复现 Demo 等）
3. 如果是 Feature 请求：
   - 检查是否已有类似能力，给出现有方案
   - 如果确实没有，简要说明
4. 禁止：
   - 不要罗列大量历史版本的修复记录
   - 不要复读文档配置项说明，除非直接解决问题
   - 不要教育用户「不应该这么用」
   - 不要提及内部测试用例文件名
5. 回复简洁、有深度、使用 Markdown，像维护者同行对话，不是客服

标题：${post.title}
内容：${body}
`.trim();
  }

  // Discussion: 保持对话式风格
  return `
你是 ${context.repo.repo} 项目的智能助手。请基于 antvis/S2 的文档与仓库信息，回答下面这个 GitHub Discussion。

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

  if (postType === "issue") {
    return `
你是 ${context.repo.repo} 项目的核心维护者。请诊断下面这个 GitHub Issue，尝试找到根因或给出解决方案。

## Issue
- 标题: ${post.title}
- 内容: ${body}

要求：
- Bug 类 Issue：定位根因 → 给出 workaround → 说明是否已修复（只提最相关的 1 个版本）
- Feature 类 Issue：检查现有能力 → 给出替代方案或简要说明
- 不要罗列历史修复记录，不要复读文档，保持简洁有深度
`.trim();
  }

  return `
你是 ${context.repo.repo} 项目的智能助手。请回答以下 GitHub Discussion。

## Discussion
- 标题: ${post.title}
- 内容: ${body}

请提供简洁、有帮助的回复，使用 Markdown 格式。
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
      model: "openai/gpt-5",
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
