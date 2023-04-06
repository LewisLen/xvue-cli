#! /usr/bin/env node
const program = require("commander");
const chalk = require("chalk");
const inquirer = require("inquirer");
// const download = require("download-git-repo");
const ejs = require("ejs");
const fs = require("fs-extra");
const path = require("path");

// .version()方法可以设置版本，其默认选项为-V和--version，设置了版本后，命令行会输出当前的版本号。
// usage -h时输出的首行提示帮助信息
program.version("1.0.0").usage("使用方式是命令+空格+参数的方式，即xvue <command> <options>");

program
  .command("create <projectName>")
  .description("使用xvue创建一个项目")
  .option("-f --force", "强制覆盖")
  .option("-d", "使用默认设置")
  .action((projectName, options) => {
    console.log("options---", options);
    inquirer
      .prompt([
        {
          type: "input",
          name: "projectName",
          message: "请输入项目名称",
          default: projectName,
        },
        {
          name: "action",
          type: "list",
          message: `Target directory already exists. Pick an action:`,
          choices: [
            { name: "Overwrite", value: "overwrite" },
            { name: "Merge", value: "merge" },
            { name: "Cancel", value: false },
          ],
          default: "merge",
        },
        {
          name: "preset-confirm",
          type: "confirm",
          message: "是否保存预设",
          default: "y",
        },
        {
          name: "lintOn",
          message: "Pick additional lint features:",
          // when: (answers) => answers.features.includes("linter"),
          type: "checkbox",
          choices: [
            {
              name: "Lint on save",
              value: "save",
              checked: true,
            },
            {
              name: "Lint and fix on commit",
              value: "commit",
            },
          ],
        },
      ])
      .then((answers) => {
        console.log(answers);
        const templPath = path.join(__dirname, "../template");
        const dirname = `${process.cwd()}/${projectName}`;
        fs.readdir(templPath, (err, files) => {
          if (err) throw err;
          files.forEach((file) => {
            ejs.renderFile(path.join(templPath, file), { data: answers }).then((data) => {
              if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname, { recursive: true });
              }
              fs.writeFile(path.join(dirname, file), data);
            });
          });
        });
        // const dirPath = path.resolve(__dirname);
        // const templateFilePath = path.join(dirPath, "../template/a.html");
        // const fileStr = fs.readFileSync(templateFilePath, "utf-8");
        // // let template = ejs.compile(fileStr)({ data: answers });
        // const template = ejs.render(fileStr, { data: answers });
        // const dirname = `${process.cwd()}/${projectName}`;
        // if (!fs.existsSync(dirname)) {
        //   fs.mkdirSync(dirname, { recursive: true });
        // }
        // fs.writeFile(`${dirname}/index.html`, template);
      });
    // 下载远程模板
    // download(
    //   "http://github.com:LewisLen/vue-multiple-h5#main",
    //   projectName,
    //   { clone: true },
    //   (err) => {
    //     if (err) {
    //       console.log("下载模板失败");
    //     } else {
    //       console.log("下载模板成功");
    //     }
    //   }
    // );
  });

program
  .command("info")
  .description("打印系统环境信息")
  .option("-s", "查看系统信息")
  .option("-b", "查看浏览器信息")
  .action((cmd) => {
    console.log("打印当前环境信息");
    console.log(cmd);
  });

const templates = {
  templateA: {
    url: "",
    description: "模板A",
  },
  templateB: {
    url: "",
    description: "模板B",
  },
};

program
  .command("list")
  .description("查看系统所有模板")
  .action(() => {
    // Object.keys(template).forEach((t) => {
    //   console.log(t);
    // });
    for (let item in templates) {
      console.log(`${item}.description`);
    }
  });

// 自定义监听事件，输入的不是所需要命令
program.on("command:*", ([cmd]) => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}`));
  process.exitCode = 1;
});

// xvue -h 或者 xvue --help会根据program的代码输出命令的帮助信息
// 当用户输入--help输出提示语
program.on("--help", () => {
  console.log();
  console.log(`  Run ${chalk.cyan(`xvue <command> --help`)} for detailed usage of given command.`);
  console.log();
});

// 为所有注册的命令输入--help可以输出帮助信息，方便用户查看命令的使用说明
program.commands.forEach((c) => c.on("--help", () => console.log()));

// 解析用户传入参数执行命令
program.parse(process.argv);
