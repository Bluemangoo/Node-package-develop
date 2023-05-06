import Project from "./types/project";
import test from "./test";
import build from "./build";
import * as execa from "execa";
import { spawnSync } from "child_process";
import { program } from "./cli";
import logger from "./utils/logger";

export default function publish(project: Project) {
    if (project.publish.pretest && !(<any>program).skipTest) {
        test(project);
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
            if (project.ignoreError) {
                logger.warning(`Error when running $ git tag v${project.current.packageJson.version}`);
            } else {
                logger.error(e);
            }
        }
    }

    logger.currentInfo(`Pushing tags to origin`);

    if (project.publish.gitTag.push && project.publish.gitTag.origins.length) {
        const origins = project.publish.gitTag.origins;
        for (let i = 0; i <= origins.length; i++) {
            try {
                spawnSync("git", ["push", origins[i], "--tags"], {
                    stdio: [project.publish.gitTag.output ? "inherit" : "ignore", "inherit", "inherit"],
                    shell: project.current.shell
                });
            } catch (e) {
                if (project.ignoreError || project.publish.gitTag.ignoreError) {
                    logger.warning(`Error when running $ git push ${origins[i]} --tags`);
                } else {
                    logger.error(e);
                }
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
                if (project.ignoreError) {
                    logger.warning(`Error when running $ npm get registry`);
                } else {
                    logger.error(e);
                }
            }

            if (currentRegistry != "https://registry.npmjs.org/") {
                logger.currentInfo("Changing registry to https://registry.npmjs.org/");
                needRecoverRegistry = true;

                try {
                    execa.sync("npm", ["config", "set", "registry", "https://registry.npmjs.org/"]);
                } catch (e) {
                    if (project.ignoreError) {
                        logger.warning(`Error when running $ npm config set registry https://registry.npmjs.org/`);
                    } else {
                        logger.error(e);
                    }
                }
            }
        }

        logger.currentInfo("Publishing to npm");
        try {
            spawnSync("npm", ["publish"], {
                stdio: "inherit",
                shell: project.current.shell
            });
        } catch (e) {
            if (project.ignoreError) {
                logger.warning(`Error when running $ npm publish`);
            } else {
                logger.error(e);
            }
        }

        if (needRecoverRegistry) {
            try {
                execa.sync("npm", ["config", "set", "registry", currentRegistry]);
            } catch (e) {
                if (project.ignoreError) {
                    logger.warning(`Error when running $ npm config set registry ${currentRegistry}`);
                } else {
                    logger.error(e);
                }
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
                    if (project.ignoreError) {
                        logger.warning(`Error when running $ npm run publish`);
                    } else {
                        logger.error(e);
                    }
                }
            }
        }
    }

    logger.cancelCurrent();
    logger.success("Publish success.");
}