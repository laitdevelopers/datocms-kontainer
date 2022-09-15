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
	extension: "png" | "jpeg" | "jpg" | "tiff" | "xlsx";
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
	private multiSelect: boolean = false;

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
			const content = JSON.parse(event.data) as KontainerEventData;
			this.updateItem(content, asset);
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
		newAsset: KontainerEventData,
		oldAsset?: KontainerEventData
	) {
		if (oldAsset != null) {
			const index = this.state.assets.indexOf(oldAsset);
			this.state.assets.splice(index, 1, newAsset);
		} else {
			this.state.assets.push(newAsset);
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

	render(): React.ReactNode {
		return (
			<Canvas ctx={this.ctx}>
				<div>
					{this.state.isOpen && (
						<Spinner size={48} placement="centered" />
					)}
					{this.state.assets.map((asset, index) => (
						<div key={index}>
							<img
								style={{
									height: "100px",
									width: "100px",
									cursor: "pointer",
								}}
								onClick={() => {
									this.edit();
								}}
								src={asset?.url}
								alt={asset?.alt ?? undefined}
							/>
							<Button
								onClick={() => {
									this.remove(asset);
								}}
							>
								Remove
							</Button>
						</div>
					))}
					<Button
						onClick={() => {
							this.edit();
						}}
					>
						Add
					</Button>
				</div>
			</Canvas>
		);
	}
}
