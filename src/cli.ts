import { program } from "commander";
import * as minimist from "minimist";
import * as chalk from "chalk";
import * as fs from "fs";
import Project from "./types/project";
import loadProject from "./utils/load-project";
import publish from "./publish";
import test from "./test";
import build from "./build";

const project: Project = loadProject();

program.usage("<command>");

program
    .version(JSON.parse(fs.readFileSync(__dirname + "/../package.json").toString()).version)
    .description("Node Package Develop");

program
    .option("--skip-test", "Skip testing before publishing")
    .option("--skip-build", "Skip building before publishing");


program
    .command("test")
    .description("Test if it can be published")
    .action(async () => {
        if (minimist(process.argv.slice(3))._.length > 0) {
            console.log(chalk.yellow("\n Info: You provided argument(s), which will be ignored."));
        }
        test(project);
    });

program
    .command("build")
    .description("Build the project")
    .action(async () => {
        if (minimist(process.argv.slice(3))._.length > 0) {
            console.log(chalk.yellow("\n Info: You provided argument(s), which will be ignored."));
        }
        build(project);
    });

program
    .command("publish")
    .description("Publish the version")
    .action(async () => {
        if (minimist(process.argv.slice(3))._.length > 0) {
            console.log(chalk.yellow("\n Info: You provided argument(s), which will be ignored."));
        }
        publish(project);
    });

program.parse(process.argv);