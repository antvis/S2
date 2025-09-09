const { OpenAI } = require("openai");
const { QueryAntVDocumentTool, ExtractAntVTopicTool } = require('@antv/mcp-server-antv/build/tools');

/**
 * @param {Object} param
 * @param {import('@actions/github').GitHub} param.github
 * @param {import('@actions/core')} param.core
 * @param {Object} param.context GitHub Action context
 * @param {Object} param.discussion The discussion object from the payload
 */
module.exports = async ({ github, core, context, discussion }) => {
  try {
    core.info('开始处理 discussion...', context.repo.repo);
    const library = `s2`;
    if (!discussion) {
      core.setFailed('找不到 discussion 信息');
      return;
    }

    // 1. 从 discussion 对象中获取信息
    const discussionNumber = discussion.number;
    const discussionTitle = discussion.title;

    core.info(`处理 discussion #${discussionNumber}: ${discussionTitle}`);

    // 2. prepareAIPrompt 函数可以通用，只需传入正确的对象
    const combinedQuery = prepareAIPrompt(context, discussion);

    // AI 处理逻辑完全保持不变
    const topicExtractionResult = await ExtractAntVTopicTool.run({ query: combinedQuery });
    const aiResponse = await getAIResponse(core, topicExtractionResult.content[0].text);
    const jsonMatch = aiResponse.match(/```json\s*(\{[\s\S]*?\})\s*```/);
    const processedTopicContent = JSON.parse(jsonMatch[1]);
    const queryDocumentParams = {
      library,
      query: combinedQuery,
      topic: processedTopicContent.topic,
      intent: processedTopicContent.intent,
      tokens: 5000,
      ...(processedTopicContent.subTasks && { subTasks: processedTopicContent.subTasks }),
    };
    const documentationResult = await QueryAntVDocumentTool.run(queryDocumentParams);
    const response = await getAIResponse(core, documentationResult.content[0].text);

    // 3. 关键：使用 discussions.createComment API
    await github.rest.discussions.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      discussion_number: discussion.number, // 这里是 discussion_number
      body: `@${discussion.user.login} 您好！以下是关于您问题的自动回复：\n\n${response}\n\n---\n*此回复由 AI 助手自动生成。如有任何问题，我们的团队会尽快跟进。*`
    });

    core.info('Discussion 处理完成');

  } catch (error) {
    core.setFailed(`处理 discussion 失败: ${error.message}`);
    core.error(error.stack);
  }
};

// 这个函数可以设计得更通用，或者保持原样
function prepareAIPrompt(context, post) { // post 可以是 issue 或 discussion
  return `
    你是 ${context.repo.repo} 项目的智能助手。这是一个处理 GitHub discussion 的自动回复系统。
    请分析以下 discussion 并提供专业、有帮助的回复。

    ## 当前 Discussion
    - 标题: ${post.title}
    - 内容: ${post.body}

    请提供完整、有帮助的回复，但不要过于冗长。回复应该条理清晰，使用适当的 Markdown 格式。
`;
}

/**
 * 调用 GitHub AI API 获取回复 (此函数无需修改)
 */
async function getAIResponse(core, userQuestion) {
  // ... 此函数内部逻辑完全不变 ...
  try {
    core.info('正在调用 GitHub AI API...');

    const token = process.env.GH_TOKEN;

    if (!token) {
      throw new Error('未找到 GH_TOKEN 环境变量');
    }

    const endpoint = "https://models.github.ai/inference";
    const model = "openai/gpt-4.1";

    const client = new OpenAI({
      baseURL: endpoint,
      apiKey: token
    });

    const response = await client.chat.completions.create({
      messages: [
        { role: "user", content: userQuestion }
      ],
      temperature: 0.7,
      top_p: 1.0,
      model: model
    });

    core.info('成功获取 AI 响应');
    core.info(JSON.stringify(response));
    return response.choices[0].message.content;

  } catch (error) {
    core.warning(`调用 GitHub AI API 失败: ${error.message}`);
    // 默认回复
    return `
    感谢您开启这个讨论！

    我们的团队会尽快查看您的问题。为了帮助我们更快地提供帮助，请确保您提供了问题的清晰描述。

    谢谢您的理解与支持！
`;
  }
}
