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
    if (!discussion || !discussion.node_id) { // 检查 node_id 是否存在
      core.setFailed('找不到 discussion 信息或 node_id');
      return;
    }

    // 1. 从 discussion 对象中获取信息 (不变)
    const discussionNumber = discussion.number;
    const discussionTitle = discussion.title;
    core.info(`处理 discussion #${discussionNumber}: ${discussionTitle}`);

    // 2. AI 处理逻辑 (完全不变)
    const combinedQuery = prepareAIPrompt(context, discussion);
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

    // 3. 关键修改：使用 GraphQL Mutation 来创建评论
    core.info(`准备向 Discussion #${discussion.number} 发布回复...`);
    const mutation = `
      mutation AddDiscussionComment($discussionId: ID!, $body: String!) {
        addDiscussionComment(input: {discussionId: $discussionId, body: $body}) {
          comment {
            id
            url
          }
        }
      }`;

    const variables = {
      // 关键：GraphQL 需要的是全局的 node_id，而不是 number
      discussionId: discussion.node_id,
      body: `@${discussion.user.login} 您好！以下是关于您问题的自动回复：\n\n${response}\n\n---\n*此回复由 AI 助手自动生成。如有任何问题，我们的团队会尽快跟进。*`
    };

    await github.graphql(mutation, variables);

    core.info('成功发布回复！');

  } catch (error) {
    core.setFailed(`处理 discussion 失败: ${error.message}`);
    core.error(error.stack);
  }
};

// prepareAIPrompt 函数保持不变
function prepareAIPrompt(context, post) {
  return `
    你是 ${context.repo.repo} 项目的智能助手。这是一个处理 GitHub discussion 的自动回复系统。
    请分析以下 discussion 并提供专业、有帮助的回复。

    ## 当前 Discussion
    - 标题: ${post.title}
    - 内容: ${post.body}

    请提供完整、有帮助的回复，但不要过于冗长。回复应该条理清晰，使用适当的 Markdown 格式。
`;
}

// getAIResponse 函数保持不变
async function getAIResponse(core, userQuestion) {
  try {
    core.info('正在调用 GitHub AI API...');
    const token = process.env.GH_TOKEN;
    if (!token) { throw new Error('未找到 GH_TOKEN 环境变量'); }
    const endpoint = "https://models.github.ai/inference";
    const client = new OpenAI({ baseURL: endpoint, apiKey: token });
    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: userQuestion }],
      temperature: 0.7,
      top_p: 1.0,
      model: "openai/gpt-4.1"
    });
    core.info('成功获取 AI 响应');
    return response.choices[0].message.content;
  } catch (error) {
    core.warning(`调用 GitHub AI API 失败: ${error.message}`);
    return `感谢您开启这个讨论！\n\n我们的团队会尽快查看您的问题。谢谢您的理解与支持！`;
  }
}
