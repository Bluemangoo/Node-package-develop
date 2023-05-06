import Project from "./types/project";
import { spawnSync } from "child_process";
import logger from "./utils/logger";

export default function build(project: Project) {
    logger.info(`Building project ${project.current.packageJson.name}`);

    if (project.check.projectScripts) {
        if (project.current.packageJson.scripts && project.current.packageJson.scripts.build) {
            try {
                spawnSync("npm", ["run", "build"], {
                    stdio: "inherit",
                    shell: project.current.shell
                });
            } catch (e) {
                logger.throwOrWarn(project.ignoreError, `Error when running $ npm run build`);
            }

        }
    }

    logger.cancelCurrent();
    logger.success(`Build success.`);
}
