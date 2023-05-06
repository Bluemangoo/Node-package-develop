import Project from "./types/project";
import * as execa from "execa";
import { spawnSync } from "child_process";
import * as fs from "fs";
import logger from "./utils/logger";

export default function check(project: Project) {

    if (!project.current.packageJson.exist) {
        logger.error(new Error("Check Failed"), "This is not a node project.");
    }

    if (!project.current.packageJson.name) {
        logger.error(new Error("Check Failed"), "No project name founded in package.json.");
    }

    if (!project.current.packageJson.version) {
        logger.error(new Error("Check Failed"), "No version found in package.json.");
    }

    if (!project.current.isGitRepo && project.check.gitTag) {
        logger.error(new Error("Check Failed"), "Check git option is on, but no git root was found. Try to switch 'check.git' to false.");
    }

    logger.info(`Checking project ${project.current.packageJson.name}`);

    if (project.check.gitTag) {
        logger.currentInfo("Checking git tag");
        let success = true;
        try {
            execa.sync("git", ["rev-parse", `v${project.current.packageJson.version}`]);
            success = false;
        } catch {
        }
        if (!success) {
            logger.error(new Error("Check Failed"), "Git tag for this version is already existed. Remember to update version in package.json.");
        }
    }

    if (project.check.npm) {
        logger.currentInfo("Checking npm");
        let success;
        try {
            execa.sync("npm", ["view", `${project.current.packageJson.name}@${project.current.packageJson.version}`, "version"]);
            success = false;
        } catch {
            success = true;
        }
        if (!success) {
            logger.error(new Error("Check Failed"), "Npm tag for this version is already existed. Remember to update version in package.json.");
        }
    }

    if (project.check.npmIgnore && project.current.hasConfig) {
        logger.currentInfo("Checking npm ignore");
        let excludes: string[] = [];
        try {
            excludes = fs.readFileSync(".npmignore", "utf8")
                .replace(/\r/g, "")
                .split("\n")
                .filter(line => line.trim() && !line.startsWith("#"));
        } catch {
            logger.error(new Error("Check Failed"), ".npmignore file is not exist.");
        }

        if (!excludes.includes("npd.json")) {
            logger.error(new Error("Check Failed"), "npd.json is not included in .npmignore.");
        }
    }

    if (project.check.projectScripts) {
        if (project.current.packageJson.scripts) {
            if (project.current.packageJson.scripts.test) {
                try {
                    spawnSync("npm", ["run", "check"], {
                        stdio: "inherit",
                        shell: project.current.shell
                    });
                } catch (e) {
                    logger.throwOrWarn(project.ignoreError, `Error when running $ npm run test`);
                }
            }
        }
    }

    logger.cancelCurrent();
    logger.success(`Check success.`);
}
