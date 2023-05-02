import Project from "./types/project";
import test from "./test";
import build from "./build";
import * as chalk from "chalk";
import * as logSymbols from "log-symbols";
import * as execa from "execa";
import { spawnSync } from "child_process";
import { program } from "./cli";

export default function publish(project: Project) {
    if (project.publish.pretest&&!(<any>program).skipTest) {
        test(project);
    }
    if (project.publish.prebuild&&!(<any>program).skipBuild) {
        build(project);
    }

    console.log(logSymbols.info, chalk.cyan(`Publishing project ${project.current.packageJson.name}`));

    if (project.publish.gitTag) {
        console.log(chalk.grey(`$ git tag v${project.current.packageJson.version}`));
        spawnSync("git", ["tag", `v${project.current.packageJson.version}`], {
            shell: true,
            stdio: "inherit"
        });
    }

    if (project.publish.pushGitTag) {
        console.log(chalk.grey("$ git push origin --tags"));
        spawnSync("git", ["push", "origin", "--tags"], {
            shell: true,
            stdio: "inherit"
        });
    }

    if (project.publish.npm) {
        let currentRegistry = "https://registry.npmjs.org/";
        let needRecoverRegistry = false;

        if (project.publish.changeRegistry) {
            currentRegistry = execa.sync("npm", ["get", "registry"]).stdout;

            if (currentRegistry != "https://registry.npmjs.org/") {
                console.log(chalk.cyan("Changing registry to https://registry.npmjs.org/"));
                needRecoverRegistry = true;
                execa.sync("npm", ["config", "set", "registry", "https://registry.npmjs.org/"]);
            }
        }

        console.log(chalk.grey("$ npm publish"));
        spawnSync("npm", ["publish"], {
            shell: true,
            stdio: "inherit"
        });

        if (needRecoverRegistry) {
            execa.sync("npm", ["config", "set", "registry", currentRegistry]);
        }
    }

    if (project.publish.projectScripts) {
        if (project.current.packageJson.scripts) {
            if (project.current.packageJson.scripts.publish) {
                spawnSync("npm", ["run", "publish"], {
                    shell: true,
                    stdio: "inherit"
                });
            }
        }
    }


    console.log(logSymbols.success, chalk.green(`Publish success.`));
}