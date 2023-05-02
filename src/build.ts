import Project from "./types/project";
import { spawnSync } from "child_process";
import * as chalk from "chalk";
import * as logSymbols from "log-symbols";

export default function build(project: Project) {
    console.log(logSymbols.info, chalk.cyan(`Building project ${project.current.packageJson.name}`));

    if (project.test.projectScripts) {
        if (project.current.packageJson.scripts) {
            if (project.current.packageJson.scripts.build) {
                spawnSync("npm", ["run", "build"], {
                    shell: true,
                    stdio: "inherit"
                });
            }
        }
    }

    console.log(logSymbols.success, chalk.green(`Build success.`));
}
