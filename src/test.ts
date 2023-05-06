import Project from "./types/project";
import * as execa from "execa";
import { spawnSync } from "child_process";
import * as fs from "fs";
import logger from "./utils/logger";

export default function test(project: Project) {

    if (!project.current.packageJson.exist) {
        logger.error(new Error("Test Failed"), "This is not a node project.");
    }

    if (!project.current.packageJson.name) {
        logger.error(new Error("Test Failed"), "No project name founded in package.json.");
    }

    if (!project.current.packageJson.version) {
        logger.error(new Error("Test Failed"), "No version found in package.json.");
    }

    if (!project.current.isGitRepo && project.test.gitTag) {
        logger.error(new Error("Test Failed"), "Test git option is on, but no git root was found. Try to switch 'test.git' to false.");
    }

    logger.info(`Testing project ${project.current.packageJson.name}`);

    if (project.test.gitTag) {
        logger.currentInfo("Checking git tag");
        let success = true;
        try {
            execa.sync("git", ["rev-parse", `v${project.current.packageJson.version}`]);
            success = false;
        } catch {
        }
        if (!success) {
            logger.error(new Error("Test Failed"), "Git tag for this version is already existed. Remember to update version in package.json.");
        }
    }

    if (project.test.npm) {
        logger.currentInfo("Checking npm");
        let success;
        try {
            execa.sync("npm", ["view", `${project.current.packageJson.name}@${project.current.packageJson.version}`, "version"]);
            success = false;
        } catch {
            success = true;
        }
        if (!success) {
            logger.error(new Error("Test Failed"), "Npm tag for this version is already existed. Remember to update version in package.json.");
        }
    }

    if (project.test.npmIgnore && project.current.hasConfig) {
        logger.currentInfo("Checking npm ignore");
        let excludes: string[] = [];
        try {
            excludes = fs.readFileSync(".npmignore", "utf8")
                .replace(/\r/g, "")
                .split("\n")
                .filter(line => line.trim() && !line.startsWith("#"));
        } catch {
            logger.error(new Error("Test Failed"), ".npmignore file is not exist.");
        }

        if (!excludes.includes("npd.json")) {
            logger.error(new Error("Test Failed"), "npd.json is not included in .npmignore.");
        }
    }

    if (project.test.projectScripts) {
        if (project.current.packageJson.scripts) {
            if (project.current.packageJson.scripts.test) {
                try {
                    spawnSync("npm", ["run", "test"], {
                        stdio: "inherit",
                        shell: project.current.shell
                    });
                } catch (e) {
                    if (project.ignoreError) {
                        logger.warning(`Error when running $ npm run test`);
                    } else {
                        logger.error(e);
                    }
                }
            }
        }
    }

    logger.cancelCurrent()
    logger.success(`Test success.`);
}
