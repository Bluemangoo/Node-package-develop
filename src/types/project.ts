export default interface Project {
    check: {
        gitTag: boolean,
        npm: boolean,
        npmIgnore: boolean,
        projectScripts: boolean
    },
    build: {
        projectScripts: boolean,
        removeCR: string[]
    },
    publish: {
        pretest: boolean,
        prebuild: boolean,
        gitTag: {
            use: boolean,
            push: boolean,
            ignoreError: boolean,
            origins: string[],
            output: boolean
        },
        npm: {
            use: boolean,
            changeRegistry: boolean,
            output: boolean
        },
        projectScripts: boolean
    },
    ignoreError: boolean,
    current: {
        hasConfig: boolean,
        isGitRepo: boolean,
        packageJson: { exist: boolean, name?: string, version?: string, scripts?: { [key: string]: string } },
        shell: boolean
    }
};