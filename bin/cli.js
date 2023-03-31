#! /usr/bin/env node
console.log(process.argv);
const program = require("commander");
const chalk = require("chalk");

// .version()方法可以设置版本，其默认选项为-V和--version，设置了版本后，命令行会输出当前的版本号。
// 修改帮助信息的首行提示
program
  .version("1.0.0")
  .usage("使用方式是命令+空格+参数的方式，即xvue <command> <options>");

program
  .command("create <projectName> [options]")
  .description("使用xvue创建一个项目")
  .option("-f --force", "强制覆盖")
  .action((projectName, options) => {});

program
  .command("info")
  .description("打印系统环境信息")
  .option("-s", "查看系统信息")
  .option("-b", "查看浏览器信息")
  .action((cmd) => {
    console.log("打印当前环境信息");
    console.log(cmd);
  });

// 自定义监听事件，输入的不是所需要命令
program.on("command:*", ([cmd]) => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}`));
  // suggestCommands(cmd);
  process.exitCode = 1;
});

// 当用户输入--help输出提示语
program.on("--help", () => {
  console.log();
  console.log(
    `  Run ${chalk.cyan(
      `xvue <command> --help`
    )} for detailed usage of given command.`
  );
  console.log();
});

// 为所有注册的命令输入--help可以输出帮助信息，方便用户查看命令的使用说明
program.commands.forEach((c) => c.on("--help", () => console.log()));

// 解析用户传入参数执行命令
program.parse(process.argv);
