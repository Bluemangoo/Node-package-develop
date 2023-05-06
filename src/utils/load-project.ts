import Project from "../types/project";
import * as fs from "fs";
import logger from "./logger";

export default function loadProject(): Project {
    let written: any = {};
    let hasConfig = false;
    try {
        written = JSON.parse(fs.readFileSync(process.cwd() + "/npd.json").toString());
        hasConfig = true;
    } catch {
    }

    if (written.current) {
        logger.warn("The `current` will be ignored. Remove it from config.");
    }

    let project: Project = { ...defaultConfig, ...written };
    project.check = { ...defaultConfig.check, ...written.test };
    project.build = { ...defaultConfig.build, ...written.build };
    project.publish = { ...defaultConfig.publish, ...written.publish };
    project.current = defaultConfig.current;
    project.current.hasConfig = hasConfig;

    if (!project.publish.gitTag) {
        project.check.gitTag = false;
    }

    if (project.ignoreError) {
        logger.warn("`ignoreError` is on now, which might cause unknown bugs. Switch it off.");
    }

    return project;
}

function isGitRepo(): boolean {
    try {
        fs.accessSync(".git");
        return true;
    } catch (error) {
        return false;
    }
}

function getPackageJson() {
    let packageJson = { exist: false };
    try {
        packageJson = JSON.parse(fs.readFileSync("package.json").toString());
        packageJson.exist = true;
    } catch {
    }
    return packageJson;
}

const current = {
    hasConfig: false,
    isGitRepo: isGitRepo(),
    packageJson: getPackageJson(),
    shell: process.platform == "win32"
};

const defaultConfig: Project = {
    check: {
        gitTag: current.isGitRepo,
        npm: true,
        npmIgnore: true,
        projectScripts: true
    },
    build: {
        projectScripts: true
    },
    publish: {
        pretest: true,
        prebuild: true,
        gitTag: {
            use: true,
            push: true,
            ignoreError: false,
            origins: ["origin"],
            output: false
        },
        npm: {
            use: true,
            changeRegistry: true
        },
        projectScripts: true
    },
    ignoreError: false,
    current: {
        hasConfig: current.hasConfig,
        isGitRepo: current.isGitRepo,
        packageJson: current.packageJson,
        shell: current.shell
    }
};