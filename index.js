#!/usr/bin/env node
import fs from "fs";
import outdent from "outdent";
import cp from "child_process";
import path from "path";
import ora from "ora";

const spinner = ora("Generating files!").start();

// create folders
if (!fs.existsSync(path.join(process.cwd(), "src")))
  fs.mkdirSync(path.join(process.cwd(), "src"));
if (!fs.existsSync(path.join(process.cwd(), ".github")))
  fs.mkdirSync(path.join(process.cwd(), ".github"));
if (!fs.existsSync(path.join(process.cwd(), ".vscode")))
  fs.mkdirSync(path.join(process.cwd(), ".vscode"));

const writeFiles = async (fileArray) => {
  fileArray.map((file) => {
    fs.writeFileSync(
      path.join(process.cwd(), file.path),
      outdent({ trimLeadingNewline: true })`${file.content.substring(1)}`
    );
  });
};

(async () => {
  writeFiles([
    {
      path: "tsconfig.json",
      content: `
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "module": "commonjs",
    "moduleResolution": "node",
    "target": "ESNext",
    "outDir": "dist",
    "sourceMap": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
  `,
    },
    {
      path: ".prettierrc",
      content: `
{
  "tabs-width": 2,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": true,
  "arrowParens": "always",

}
      `,
    },
    {
      path: ".vscode/extensions.json",
      content: `
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
  ]
}
      `,
    },
    {
      path: "src/index.ts",
      content: `
// sample file has been created!
      `,
    },
    {
      path: "README.md",
      content: `
README.md
      `,
    },
    {
      path: ".gitignore",
      content: `
node_modules
dist
yarn-error.log
.env
misc/
*.log
      `,
    },
  ]); // end of writeFiles

  spinner.text = "Installing Dependancies!";

  cp.exec("npm init -y", { cwd: process.cwd() }, () => {
    cp.exec(
      "yarn add typescript ts-node @types/node --dev",
      { cwd: process.cwd() },
      () => {
        cp.exec("git init", { cwd: process.cwd() }, () => {
          spinner.succeed("Everything is ready!");
        });
      }
    );
  });
})();
