const {
  getAutomatedReply,
  buildAutoReplyBody,
} = require("./automated-reply");


/**
 * @param {Object} param
 * @param {import('@actions/github').GitHub} param.github
 * @param {import('@actions/core')} param.core
 * @param {Object} param.context GitHub Action context
 */
module.exports = async ({ github, core, context, issue }) => {
  try {
    core.info("开始处理 issue...", context.repo.repo);
    const library = "s2";
    if (!issue) {
      core.setFailed("找不到 issue 信息");
      return;
    }

    const issueNumber = issue.number;
    const issueTitle = issue.title;

    core.info(`处理 issue #${issueNumber}: ${issueTitle}`);

    const { response, source } = await getAutomatedReply({
      core,
      context,
      post: issue,
      postType: "issue",
      library,
    });

    await github.rest.issues.createComment({
      issue_number: issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: buildAutoReplyBody(issue.user.login, response, source, "issue"),
    });

    core.info("Issue 处理完成");
  } catch (error) {
    core.setFailed(`处理 issue 失败: ${error.message}`);
    core.error(error.stack);
  }
};

