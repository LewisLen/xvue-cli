#! /usr/bin/env node

// #! 符号用于指定脚本的解释程序
// Node CLI 应用入口文件必须要有这样的文件头
// 如果是Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改

const semver = require("semver");
const xVersion = require('../package.json');
const requiredVersion = require("../package.json").engines.node;
const program = require("commander");
const chalk = require("chalk");

// 检查node版本
function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(
      chalk.red(
        "You are using Node " +
          process.version +
          ", but this version of " +
          id +
          " requires Node " +
          wanted +
          ".\nPlease upgrade your Node version."
      )
    );
    process.exit(1);
  }
}

checkNodeVersion(requiredVersion, "xvue-cli");

program.version(xVersion.version).usage("<command> [options] hhhh");

// 定义命令和参数
program
  .command('create <app-name>')
  .description('create a new project')
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    // 打印执行结果
    console.log('name:',name,'options:',options)
  })
  
program
   // 配置版本号信息
  .version(`v${xVersion.version}`)
  .usage('<command> [option]')

  console.log(111);

  console.log(222);

program
  .command("info")
  .description("print debugging information about your environment")
  .action((cmd) => {
    console.log(chalk.bold("\nEnvironment Info:"));
    require("envinfo")
      .run(
        {
          System: ["OS", "CPU"],
          Binaries: ["Node", "Yarn", "npm"],
          Browsers: ["Chrome", "Edge", "Firefox", "Safari"],
          npmPackages: "/**/{typescript,*vue*,@vue/*/}",
          npmGlobalPackages: ["@vue/cli"],
        },
        {
          showNotFound: true,
          duplicates: true,
          fullTree: true,
        }
      )
      .then(console.log);
  });

  
// output help information on unknown commands
program.on("command:*", ([cmd]) => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}`));
  console.log();
  suggestCommands(cmd);
  process.exitCode = 1;
});

// add some useful info on help
program.on("--help", () => {
  console.log();
  console.log(`  Run ${chalk.cyan(`xvue <command> --help`)} for detailed usage of given command.`);
  console.log();
});

program.commands.forEach((c) => c.on("--help", () => console.log()));

// enhance common error messages
const enhanceErrorMessages = require("../lib/util/enhanceErrorMessages");

enhanceErrorMessages("missingArgument", (argName) => {
  return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`;
});

enhanceErrorMessages("unknownOption", (optionName) => {
  return `Unknown option ${chalk.yellow(optionName)}.`;
});

enhanceErrorMessages("optionMissingArgument", (option, flag) => {
  return (
    `Missing required argument for option ${chalk.yellow(option.flags)}` +
    (flag ? `, got ${chalk.yellow(flag)}` : ``)
  );
});

// 解析用户执行命令传入参数
program.parse(process.argv);

function suggestCommands(unknownCommand) {
  const availableCommands = program.commands.map((cmd) => cmd._name);
  let suggestion;
  availableCommands.forEach((cmd) => {
    const isBestMatch = leven(cmd, unknownCommand) < leven(suggestion || "", unknownCommand);
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd;
    }
  });

  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
}