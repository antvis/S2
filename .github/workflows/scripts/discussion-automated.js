const {
  getAutomatedReply,
  buildAutoReplyBody,
} = require("./automated-reply");

/**
 * @param {Object} param
 * @param {import('@actions/github').GitHub} param.github
 * @param {import('@actions/core')} param.core
 * @param {Object} param.context GitHub Action context
 * @param {Object} param.discussion The discussion object from the payload
 */
module.exports = async ({ github, core, context, discussion }) => {
  try {
    core.info("开始处理 discussion...", context.repo.repo);
    const library = "s2";
    if (!discussion || !discussion.node_id) {
      core.setFailed("找不到 discussion 信息或 node_id");
      return;
    }

    const discussionNumber = discussion.number;
    const discussionTitle = discussion.title;
    core.info(`处理 discussion #${discussionNumber}: ${discussionTitle}`);

    const { response, source } = await getAutomatedReply({
      core,
      context,
      post: discussion,
      postType: "discussion",
      library,
    });

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
      discussionId: discussion.node_id,
      body: buildAutoReplyBody(discussion.user.login, response, source, "discussion"),
    };

    await github.graphql(mutation, variables);

    core.info("成功发布回复！");
  } catch (error) {
    core.setFailed(`处理 discussion 失败: ${error.message}`);
    core.error(error.stack);
  }
};
