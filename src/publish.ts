import Project from "./types/project";
import check from "./check";
import build from "./build";
import * as execa from "execa";
import { spawnSync } from "child_process";
import { program } from "./cli";
import logger from "./utils/logger";

export default function publish(project: Project) {
    if (project.publish.pretest && !(<any>program).skipTest) {
        check(project);
    }
    if (project.publish.prebuild && !(<any>program).skipBuild) {
        build(project);
    }

    logger.info(`Publishing project ${project.current.packageJson.name}`);

    logger.currentInfo(`Creating git tags`);

    if (project.publish.gitTag.use) {
        try {
            execa.sync("git", ["tag", `v${project.current.packageJson.version}`]);
        } catch (e) {
            logger.throwOrWarn(project.ignoreError, e, `Error when running $ git tag v${project.current.packageJson.version}`);
        }
    }

    logger.currentInfo(`Pushing tags to origin`);

    if (project.publish.gitTag.use && project.publish.gitTag.push && project.publish.gitTag.origins.length) {
        const origins = project.publish.gitTag.origins;
        for (let i = 0; i <= origins.length; i++) {
            try {
                spawnSync("git", ["push", origins[i], "--tags"], {
                    stdio: project.publish.gitTag.output ? "inherit" : "ignore",
                    shell: project.current.shell
                });
            } catch (e) {
                logger.throwOrWarn(project.ignoreError, e, `Error when running $ git push ${origins[i]} --tags`);
            }
        }
    }

    if (project.publish.npm.use) {
        let currentRegistry = "https://registry.npmjs.org/";
        let needRecoverRegistry = false;

        if (project.publish.npm.changeRegistry) {

            try {
                currentRegistry = execa.sync("npm", ["get", "registry"]).stdout;
            } catch (e) {
                logger.throwOrWarn(project.ignoreError, e, `Error when running $ npm get registry`);
            }

            if (currentRegistry != "https://registry.npmjs.org/") {
                logger.currentInfo("Changing registry to https://registry.npmjs.org/");
                needRecoverRegistry = true;

                try {
                    execa.sync("npm", ["config", "set", "registry", "https://registry.npmjs.org/"]);
                } catch (e) {
                    logger.throwOrWarn(project.ignoreError, e, `Error when running $ npm config set registry https://registry.npmjs.org/`);
                }
            }
        }

        if (project.publish.gitTag.output) {
            logger.currentInfo("Publishing to npm");
        } else {
            logger.cancelCurrent();
        }
        try {
            spawnSync("npm", ["publish"], {
                stdio: project.publish.gitTag.output ? "inherit" : "ignore",
                shell: project.current.shell
            });
        } catch (e) {
            logger.throwOrWarn(project.ignoreError, e, `Error when running $ npm publish`);
        }

        if (needRecoverRegistry) {
            try {
                execa.sync("npm", ["config", "set", "registry", currentRegistry]);
            } catch (e) {
                logger.throwOrWarn(project.ignoreError, e, `Error when running $ npm config set registry ${currentRegistry}`);
            }
        }
    }

    if (project.publish.projectScripts) {
        if (project.current.packageJson.scripts) {
            if (project.current.packageJson.scripts.publish) {
                try {
                    spawnSync("npm", ["run", "publish"], {
                        stdio: "inherit",
                        shell: project.current.shell
                    });
                } catch (e) {
                    logger.throwOrWarn(project.ignoreError, e, `Error when running $ npm run publish`);
                }
            }
        }
    }

    logger.cancelCurrent();
    logger.success("Publish success.");
}