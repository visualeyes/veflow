# VEFlow (for [Mercurial](https://www.mercurial-scm.org/))

GitHub: [https://github.com/visualeyes/veflow](https://github.com/visualeyes/veflow)

NPM: [https://www.npmjs.com/package/veflow](https://www.npmjs.com/package/veflow)

![build status](https://codebuild.ap-southeast-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiZGZPYjdiRGYraEJ4ZGdlbE4xcnFnTW0vYk1tdFZVaFZTWkdwZHgyeDV2RG1OSDc1dmZrNFF2Um52U0lIZ3F0ZUpqTXpad1dTN0pnQzFOQW5zdU52eG53PSIsIml2UGFyYW1ldGVyU3BlYyI6IldLZTUvbjhuT2hCWE1NNzMiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

## Requirements

* [Mercurial](https://www.mercurial-scm.org/)
* [NodeJS](https://nodejs.org/en/)

## Overview

A globally installable helper package which fills gaps in specific [HG Flow](https://bitbucket.org/yinwm/hgflow) use cases.

## Installation

1. Run ```npm i -g veflow```
2. In the project where you'll be using ```veflow```, add a ```.veflow.json``` file for configuration, see the example below

## Example .veflow.json

```json
{
    "masterRepo": "master",
    "releasedBookmark": "current",
    "unreleasedOrderedBranches": [
        "release/2",
        "release/3"
    ]
}
```

## Usage

### Close

Replacement for ```hg flow finish```, where hotfixed code is not merged into each unreleased branch.

```veflow close [branch]```

Effects:
1. Pull from ```master``` repository
2. Close branch (currently active if none specified)
3. If ```hotfix```, merge branch into configured ```releasedBookmark```
4. If ```release``` or ```hotfix```, iterate through ```unreleasedOrderedBranches``` and merge into each of those.
5. Merge into ```develop```