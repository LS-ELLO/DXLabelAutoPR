const core = require("@actions/core");
const github = require("@actions/github");
const { Toolkit } = require("actions-toolkit");
const tools = new Toolkit();

async function pullReqAutoMerge() {
  try {
    const labelName = core.getInput("label-name");
    const reviewersNumber = core.getInput("reviewers-number");
    const merge_method = core.getInput("merge-method");
    const myToken = core.getInput("github-token");
    const octokit = new github.GitHub(myToken);

    const ref = tools.context.ref;
    console.log(ref); // refs/pull/15/merge
    const pull_number = Number(ref.split("/")[2]); // 15
    console.log(pull_number);

    const reviews = await octokit.pulls.listReviews({ // List reviews for a pull request
      ...github.context.repo,
      pull_number,
    });
    const pr = await octokit.pulls.get({ // get pull request 
      ...github.context.repo, 
      pull_number,
    });

    const labels = pr.data.labels;
    const hasAutomerge = labels.some((label) => label.name === labelName);

    if (hasAutomerge) {
      if (reviews.data.length >= +reviewersNumber) {
        octokit.pulls.merge({ // Merge a pull request
          ...github.context.repo,
          pull_number,
          merge_method,
        });
        core.info(`성공적으로 Merge PR 되었습니다!`);

        core.info(`---`);
        var reviewCommentInfo = Array();
        for (var i=0; i<reviews.data.length; i+=1) {
          //console.log(reviews.data[i]);
          var info_ = '';
          info_ += reviews.data[i].user.login;
          info_ += '님의 Review 코멘트 : ';
          info_ += reviews.data[i].body
          reviewCommentInfo.push(info_);
        }
        console.log('--reviewCommentInfo--')
        console.log(reviewCommentInfo);

        infoCollections = '';
        for (var i=0; i<reviewCommentInfo.length; i+=1) {
          infoCollections += reviewCommentInfo[i];
          infoCollections += '\n';
        }
        console.log('--infoCollections--')
        console.log(infoCollections);

        // issue 생성 
        const newIssue = await octokit.issues.create({
          ...github.context.repo,
          title: '성공적으로 자동 Merged 되었습니다! [pull_request:' + String(pull_number) + ']',
          body: infoCollections
        });

      } else throw Error("자동으로 Merge하기엔.. 다른사람들의 review가 부족합니다!");
    } else core.info(`label이 없어요..::"${labelName}"`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

pullReqAutoMerge();
