# Segment CDP Functions Documentation

## Introduction

Welcome to the `segment-cdp-functions` NPM package. This tool is designed to bolster developers' capabilities, streamlining the creation, building, and deployment processes for Segment CDP Functions. With robust integration capabilities for Typescript, CI/CD patterns, and testing environments, our goal is to enhance the development lifecycle and ensure flawless compatibility with the Segment function environment.

## Highlighted Features

- **Quick Setup**: Instantly set up projects and pipelines for Segment CDP Functions.
- **Typescript Integration**: Natively write and compile functions using Typescript.
- **RollupJS Bundling**: Leverage rollupJS for efficient code bundling.
- **Segment Deployment Assistance**: Hassle-free deployment of your bundled code to the Segment environment.
- **CI/CD & Testing**: Easily integrate continuous integration and continuous delivery patterns, and test your functions seamlessly.

## Precautions

- **Limited Functionality**: Currently, only support for destination functions is available.
- **Library Limitations**: To ensure function compatibility, please refrain from adding external libraries to your project. The Segment function environment might not recognize them, risking potential functional disruptions.
- **Accessible Methods**: The code environment grants access to specific methods, including `fetch()`, `atob()`, and `btoa()`.

## Best Practices

- Situate all your classes within the `./src` directory.
- For optimal functionality, incorporate and employ these classes within `./src/index.ts`.

## Workflow

Understanding the expectations of the Segment function environment is crucial. Typically, it anticipates a single NodeJS (NodeNext) compatible code. Traditional practices might not fit these parameters. That's where our package steps in:

1. **Setup**: Embark on your journey by initializing a fresh project and integrating all essential dependencies.
2. **Development**: Dive into a developer-centric environment with full-fledged Typescript support.
3. **Compilation**: Rely on rollupJS combined with Typescript to curate a code bundle that's a perfect fit for the Segment environment.
4. **Deployment**: Transfer the resulting bundle to the Segment environment, ensuring it integrates smoothly.

## Quick Start Guide

Embark on your Segment CDP Functions journey with these simple steps:

1. Launch your terminal.
2. Install the package using `npm i -g segment-cdp-functions`.
3. Create a project directory: `mkdir <project-name>`.
4. Navigate to it: `cd <project-name>`.
5. Initialize your project within the directory using: `segment-cdp-functions init`.
6. Explore the available Segment API functions in `./src/index.ts`.
7. Check out the sample `./src/slack.ts` which demonstrates sending Slack messages.
8. Bundle your code using: `npm run build`. This produces a deployment-ready code bundle (`./<build>/index.js`) and a JSON file (`./<build>/to_deploy.json`).
9. To deploy, acquire a segment token and save it in the `.env` file. Obtain this token from your Segment workspace by navigating: Settings > Workspace Settings > Access Management Tab > Tokens Tab > Create Token. Assign it a name and grant access as `Workspace Member` > `Function Admin`. Use this token in your `.env` as `SEGMENT_TOKEN=<Token>`.
10. Deploy your function with: `npm run deploy`.

We wish you an effortless development journey with the `segment-cdp-functions` package. Should you have any questions or feedback, please reach out.