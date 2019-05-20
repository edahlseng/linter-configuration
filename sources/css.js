/* @flow */

import path from "path";
import { always } from "ramda";

import {
	addNpmScript,
	setupConfigurationFile,
	addNpmLintStep,
} from "./utils.js";

const stylelintConfiguration = `{
	"extends": ["@eric.dahlseng/configuration-lint/stylelintrc"]
}
`;

const setupCss = (projectRootDirectory: string) =>
	setupConfigurationFile({
		configuration: stylelintConfiguration,
		filePath: path.resolve(projectRootDirectory, "./.stylelintrc.json"),
	})
		.chain(
			always(
				addNpmScript({
					packageJsonPath: path.resolve(projectRootDirectory, "./package.json"),
					name: "lint:css",
					content: "stylelint '**/*.js'",
				}),
			),
		)
		.chain(
			always(
				addNpmLintStep({
					packageJsonPath: path.resolve(projectRootDirectory, "./package.json"),
					step: "npm run lint:css",
				}),
			),
		)
		.chain(
			always(
				addNpmScript({
					packageJsonPath: path.resolve(projectRootDirectory, "./package.json"),
					name: "lint-report:css",
					content:
						"mkdir -p ./linting-results/stylelint && stylelint '**/*.js' --custom-formatter './node_modules/stylelint-formatter-relative-junit' > ./linting-results/stylelint/report.xml",
				}),
			),
		);

export default setupCss;