import { connect, RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import ConfigScreen from "./entrypoints/ConfigScreen";
import KontainerAssets from "./entrypoints/KontainerAssets";

let root: Root | undefined;

function render(component: React.ReactNode) {
	if (!root) {
		const element = document.getElementById("root") as Element;
		root = createRoot(element);
	}
	root.render(<React.StrictMode>{component}</React.StrictMode>);
}

connect({
	renderConfigScreen(ctx) {
		return render(<ConfigScreen ctx={ctx} />);
	},
	manualFieldExtensions(ctx) {
		return [
			{
				id: "kontainerAssets",
				name: "Kontainer Assets",
				type: "editor",
				fieldTypes: ["json"],
			},
		];
	},
	renderFieldExtension(
		fieldExtensionId: string,
		ctx: RenderFieldExtensionCtx
	) {
		switch (fieldExtensionId) {
			case "kontainerAssets":
				return render(<KontainerAssets ctx={ctx} />);
		}
	},
});
