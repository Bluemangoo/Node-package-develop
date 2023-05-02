import Project from "./types/project";
import logSymbols = require("log-symbols");
import * as chalk from "chalk";
import * as execa from "execa";
import { spawnSync } from "child_process";
import * as fs from "fs";

export default function test(project: Project) {

    if (!project.current.packageJson.exist) {
        console.log(logSymbols.error, chalk.red("This is not a node project."));
        throw new Error("Test Failed");
    }

    if (!project.current.packageJson.name) {
        console.log(logSymbols.error, chalk.red("No project name founded in package.json."));
        throw new Error("Test Failed");
    }

    if (!project.current.packageJson.version) {
        console.log(logSymbols.error, chalk.red("No version found in package.json."));
        throw new Error("Test Failed");
    }

    if (!project.current.isGitRepo && project.test.gitTag) {
        console.log(logSymbols.error, chalk.red("Test git option is on, but no git root was found. Try to switch 'test.git' to false."));
        throw new Error("Test Failed");
    }

    console.log(logSymbols.info, chalk.cyan(`Testing project ${project.current.packageJson.name}`));

    if (project.test.gitTag) {
        let success = true;
        try {
            execa.sync("git", ["rev-parse", `v${project.current.packageJson.version}`]);
            success = false;
        } catch {
        }
        if (!success) {
            console.log(logSymbols.error, chalk.red("Git tag for this version is already existed. Remember to update version in package.json."));
            throw new Error("Test Failed");
        }
    }

    if (project.test.npm) {
        let success;
        try {
            execa.sync("npm", ["view", `${project.current.packageJson.name}@${project.current.packageJson.version}`, "version"]);
            success = false;
        } catch {
            success = true;
        }
        if (!success) {
            console.log(logSymbols.error, chalk.red("Npm tag for this version is already existed. Remember to update version in package.json."));
            throw new Error("Test Failed");
        }
    }

    if (project.test.npmIgnore && project.current.hasConfig) {
        let excludes: string[] = [];
        try {
            excludes = fs.readFileSync(".npmignore", "utf8")
                .replace(/\r/g, "")
                .split("\n")
                .filter(line => line.trim() && !line.startsWith("#"));
        } catch {
            console.log(logSymbols.error, chalk.red(".npmignore file is not exist."));
            throw new Error("Test Failed");
        }

        if (!excludes.includes("npd.json")) {
            console.log(logSymbols.error, chalk.red("npd.json is not included in .npmignore."));
            throw new Error("Test Failed");
        }
    }

    if (project.test.projectScripts) {
        if (project.current.packageJson.scripts) {
            if (project.current.packageJson.scripts.test) {
                spawnSync("npm", ["run", "test"], {
                    shell: true,
                    stdio: "inherit"
                });
            }
        }
    }

    console.log(logSymbols.success, chalk.green(`Test success.`));
}
