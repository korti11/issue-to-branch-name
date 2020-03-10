const core = require('@actions/core');
const github = require('@actions/github')

// most @actions toolkit packages have async methods
async function run() {
  if(!process.env.GITHUB_TOKEN) {
    core.setFailed('GITHUB_TOKEN missing, must be set with ${{secrets.GITHUB_TOKEN}}');
  }
  try { 
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    const issueNumber = core.getInput('issue');
    const prefix = core.getInput('prefix');
    const suffix = core.getInput('suffix');
    const fillSymbol = core.getInput('fill-symbol');
    const octokit = new github.Github(process.env.GITHUB_TOKEN);

    const { data: issue } = await octokit.issues.get({
      owner: owner,
      repo: repo,
      issue_number: issueNumber
    });

    const branchName = `${prefix}${issueNumber}-${issue.title}${suffix}`.replace(/[ ]+/g, fillSymbol);
    core.info(`Generated branch name: ${branchName}`);
    core.setOutput('branch_name', branchName);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
