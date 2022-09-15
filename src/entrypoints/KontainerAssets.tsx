import { IntentCtx, RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Button, Canvas } from "datocms-react-ui";
import { arrayBuffer } from "stream/consumers";

type PropTypes = {
	ctx: RenderFieldExtensionCtx;
};

const KontainerAssets = ({ ctx }: PropTypes) => {
	let isOpen = false;
	let popUpUrl: string;
	let multiSelect = ctx.parameters["multiSelect"] === true;
	let kontainerDomain = ctx.plugin.attributes.parameters["domain"] as string;
	if (kontainerDomain == null) return null;

	if (kontainerDomain.indexOf(".") < 0) {
		kontainerDomain = `https://${kontainerDomain}.kontainer.com/`;
	}
	if (kontainerDomain.indexOf("http") < 0) {
		kontainerDomain = `https://${kontainerDomain}`;
	}

	// Remove path part, eg. /a/b/c/d:
	popUpUrl = kontainerDomain
		.replace("http://", "https://")
		.replace(/(\.\w+)\/.*$/, "$1");

	let assets = JSON.parse(
		ctx.formValues[ctx.fieldPath] as string
	) as KontainerEventData[];
	if (!Array.isArray(assets)) assets = [];

	const edit = (asset?: KontainerEventData) => {
		isOpen = true;

		const eventListener = (event: MessageEvent<string>) => {
			if (event.data == null || typeof event.data !== "string") {
				throw Error("No data was recieved from Kontainer.");
			}
			const content = JSON.parse(event.data) as KontainerEventData;
			updateItem(content, asset);
			console.log(content);
		};

		window.addEventListener("message", eventListener, { once: true });

		const url = `${popUpUrl}?cmsMode=1`;
		console.log(url);
		const popup = window.open(url);
		const interval = window.setInterval(() => {
			if (popup?.closed) {
				window.clearInterval(interval);
				isOpen = false;

				window.removeEventListener("message", eventListener);
			}
		}, 250);
	};

	const remove = () => {
		ctx.setFieldValue(ctx.fieldPath, null);
	};

	const updateItem = (
		newItem: KontainerEventData,
		oldItem?: KontainerEventData
	) => {
		let currentAssets = ctx.formValues[
			ctx.fieldPath
		] as KontainerEventData[];
		if (!Array.isArray(currentAssets)) currentAssets = [];
		if (oldItem != null) {
			const index = currentAssets.indexOf(oldItem);
			currentAssets[index] = newItem;
		} else {
			currentAssets.push(newItem);
		}
		ctx.setFieldValue(ctx.fieldPath, JSON.stringify(currentAssets));

		isOpen = false;
	};

	return (
		<Canvas ctx={ctx}>
			<div>
				{assets.map((asset, index) => (
					<template key={index}>
						<img
							style={{
								height: "100px",
								width: "100px",
								cursor: "pointer",
							}}
							onClick={() => {edit()}}
							src={asset?.url}
							alt={asset?.alt ?? undefined}
						/>
						<Button onClick={remove}>Remove</Button>
					</template>
				))}
				<Button onClick={() => {edit()}}>Add</Button>
			</div>
		</Canvas>
	);
};

export default KontainerAssets;

interface KontainerEventData {
	url: string;
	type: "image";
	extension: "png" | "jpeg" | "jpg" | "tiff" | "xlsx";
	description: string | null;
	alt: string | null;
	fileId: number;
	folderId: number;
	token: unknown;
	external: unknown[];
	cf: unknown[];
}
