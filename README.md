# DXLabelAutoPR

## How To Use
`.github/workflows/${NAME_YOU_WANT}.yml` 에 아래와 같이 액션 설정 스크립트를 작성합니다.

```yml
name: DXLabelAutoPR
on:
  pull_request:
    types: [labeled]
jobs:
  run-actions:
    runs-on: ubuntu-latest
    steps:
      - name: Merge PR Auto Step
        uses: pym7857/DXLabelAutoPR@1.0.0
        with:
          # Event Trigger 라벨 이름을 설정합니다. 디폴트는 "DXLabel" 입니다.
          label-name:
          # 최소 Reviewer 수를 지정할 수 있습니다. 디폴트는 1명입니다.
          reviewers-number:
          # "merge", "squash", "rebase" 중 한가지를 선택할 수 있습니다. 디폴트는 "merge" 입니다
          merge-method:
          # GitHub Secret Token
          github-token: ${{ secrets.GITHUB_TOKEN }}
```
