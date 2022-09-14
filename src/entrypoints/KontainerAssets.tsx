import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Button, Canvas } from "datocms-react-ui";
import { KontainerParameters } from "./ConfigScreen";

type PropTypes = {
	ctx: RenderFieldExtensionCtx;
};

const KontainerAssets = ({ ctx }: PropTypes) => {
	let isOpen = false;
	const parameters = ctx.plugin.attributes.parameters as KontainerParameters;
	let popUpUrl: string = `https://${parameters.domain}.kontainer.com`;
	let currentValue = JSON.parse(
		ctx.formValues[ctx.fieldPath] as string
	) as KontainerEventData;
	const edit = () => {
		isOpen = true;

		const eventListener = (event: MessageEvent<string>) => {
			if (event.data == null) {
				throw Error("No data was recieved from Kontainer.");
			}

			const content = JSON.parse(event.data) as KontainerEventData;
			console.log(content);
			ctx.setFieldValue(ctx.fieldPath, event.data);
			currentValue = ctx.formValues[ctx.fieldPath] as KontainerEventData;
		};

		window.addEventListener("message", eventListener, { once: true });

		const url = `${popUpUrl}?cmsMode=1`;
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

	return (
		<Canvas ctx={ctx}>
			<img
				style={{ height: "100px", width: "100px", cursor: "pointer" }}
				onClick={edit}
				src={currentValue?.url}
				alt={currentValue?.alt ?? undefined}
			/>
			<Button onClick={remove}>Remove</Button>
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
