import Project from "./types/project";
import { spawnSync } from "child_process";
import logger from "./utils/logger";
import * as path from "path";
import * as fs from "fs";
import ignore from "ignore";

export default function build(project: Project) {
    logger.info(`Building project ${project.current.packageJson.name}`);

    if (project.build.projectScripts) {
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

    if (project.build.removeCR) {
        logger.currentInfo("Converting CRLF to LF");

        function convertToLF(filePath: string) {
            const content = fs.readFileSync(filePath, "utf-8");
            const convertedContent = content.replace(/\r\n/g, "\n");
            fs.writeFileSync(filePath, convertedContent, "utf-8");
        }

        function processDirectory(directory: string) {
            const stats = fs.statSync(directory);
            if (stats.isFile()) {
                convertToLF(directory);
            } else if (stats.isDirectory()) {
                const files = fs.readdirSync(directory);
                for (const file of files) {
                    processDirectory(`${directory}/${file}`);
                }
            }
        }

        for (const removeElement of project.build.removeCR) {
            processDirectory(process.cwd() + "/" + removeElement);
        }
    }

    logger.cancelCurrent();
    logger.success(`Build success.`);
}
