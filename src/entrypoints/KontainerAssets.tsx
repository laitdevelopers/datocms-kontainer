import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Button, Canvas, Spinner } from "datocms-react-ui";
import React from "react";

type PropTypes = {
	ctx: RenderFieldExtensionCtx;
};

type StateTypes = {
	isOpen: boolean;
	assets: KontainerEventData[];
};

type KontainerEventData = {
	url: string;
	type: "image";
	extension: "png" | "jpeg" | "jpg" | "tiff" | "xlsx" | "svg" | "docx";
	description: string | null;
	alt: string | null;
	fileId: number;
	folderId: number;
	token: unknown;
	external: unknown[];
	cf: unknown[];
};

export class KontainerAssets extends React.Component<PropTypes, StateTypes> {
	constructor(props: PropTypes) {
		super(props);

		this.ctx = props.ctx;
		this.minItems = (this.ctx.parameters["minItems"] ?? 1) as number;
		this.maxItems = (this.ctx.parameters["maxItems"] ?? 1) as number;
		this.multiSelect = this.maxItems > 1;
		this.state = { isOpen: false, assets: [] };

		let kontainerDomain = this.ctx.plugin.attributes.parameters[
			"domain"
		] as string;
		if (kontainerDomain.indexOf(".") < 0) {
			kontainerDomain = `https://${kontainerDomain}.kontainer.com/`;
		}
		if (kontainerDomain.indexOf("http") < 0) {
			kontainerDomain = `https://${kontainerDomain}`;
		}

		this.popUpUrl = kontainerDomain
			.replace("http://", "https://")
			.replace(/(\.\w+)\/.*$/, "$1");
	}

	private ctx: RenderFieldExtensionCtx;
	private popUpUrl: string;
	private multiSelect: boolean;
	private minItems: number;
	private maxItems: number;

	componentDidMount() {
		const value = this.ctx.formValues[this.ctx.fieldPath];
		if (typeof value === "string") {
			const assets = JSON.parse(
				this.ctx.formValues[this.ctx.fieldPath] as string
			) as KontainerEventData[];

			this.setState({ assets: Array.isArray(assets) ? assets : [] });
		}
	}

	private edit(asset?: KontainerEventData) {
		this.setState({ isOpen: true });
		const eventListener = (event: MessageEvent<string>) => {
			if (event.data == null || typeof event.data !== "string") {
				throw Error("No data was recieved from Kontainer.");
			}
			const content = JSON.parse(event.data) as
				| KontainerEventData
				| KontainerEventData[];

			this.updateItem(
				Array.isArray(content) ? content : [content],
				asset
			);
			this.setState({ isOpen: false });
		};

		window.addEventListener("message", eventListener, { once: true });

		const url = `${this.popUpUrl}?cmsMode=1`;
		const popup = window.open(url);
		const interval = window.setInterval(() => {
			if (popup?.closed) {
				window.clearInterval(interval);
				this.setState({ isOpen: false });

				window.removeEventListener("message", eventListener);
			}
		}, 250);
	}

	private updateItem(
		newAsset: KontainerEventData[],
		oldAsset?: KontainerEventData
	) {
		if (oldAsset != null) {
			const index = this.state.assets.indexOf(oldAsset);
			this.state.assets.splice(index, 1, ...newAsset);
		} else {
			this.state.assets.push(...newAsset);
		}
		this.ctx.setFieldValue(
			this.ctx.fieldPath,
			JSON.stringify(this.state.assets)
		);
	}

	private remove(asset: KontainerEventData) {
		const index = this.state.assets.indexOf(asset);
		this.state.assets.splice(index, 1);
		this.ctx.setFieldValue(
			this.ctx.fieldPath,
			JSON.stringify(this.state.assets)
		);
	}

	private mapAsset(asset: KontainerEventData) {
		if (asset.type === "image") {
			return (
				<img
					style={{
						height: "100px",
						width: "100px",
					}}
					src={asset.url}
					alt={asset.alt ?? undefined}
					title={asset.description ?? undefined}
				/>
			);
		} else {
			return (
				<div
					style={{
						height: "100px",
						width: "100px",
						cursor: "pointer",
					}}
				>
					{asset.extension}
				</div>
			);
		}
	}

	render(): React.ReactNode {
		return (
			<Canvas ctx={this.ctx}>
				<div>
					{this.state.isOpen && (
						<Spinner size={48} placement="centered" />
					)}
					{this.state.assets.map((asset, index) => (
						<div key={index}>
							{this.mapAsset(asset)}

							<Button
								onClick={() => {
									this.remove(asset);
								}}
							>
								Remove
							</Button>
							<Button
								onClick={() => {
									this.edit(asset);
								}}
							>
								Edit
							</Button>
						</div>
					))}
					{this.maxItems > this.state.assets.length && (
						<Button
							onClick={() => {
								this.edit();
							}}
						>
							Add
						</Button>
					)}
				</div>
			</Canvas>
		);
	}
}
