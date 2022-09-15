import { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, Form, TextField } from "datocms-react-ui";
import { useCallback, useState } from "react";
type PropTypes = {
	ctx: RenderManualFieldExtensionConfigScreenCtx;
};

type Parameters = {
	minItems: number;
	maxItems: number;
};

export function FieldConfig({ ctx }: PropTypes) {
	const [formValues, setFormValues] = useState<Partial<Parameters>>(
		ctx.parameters
	);

	const update = useCallback(
		(field: any, value: any) => {
			const newParameters = { ...formValues, [field]: value };
			setFormValues(newParameters);
			ctx.setParameters(newParameters);
		},
		[formValues, setFormValues, ctx.setParameters]
	);

	return (
		<Canvas ctx={ctx}>
			<Form>
				<TextField
					id="minItems"
					name="minItems"
					label="Minimum items"
					required
					value={formValues.minItems}
					onChange={update.bind(null, "minItems")}
				/>
				<TextField
					id="maxItems"
					name="maxItems"
					label="Maximum items"
					required
					value={formValues.maxItems}
					onChange={update.bind(null, "maxItems")}
				/>
			</Form>
		</Canvas>
	);
}
