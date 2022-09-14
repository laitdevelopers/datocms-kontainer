import { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, Form, SwitchField } from "datocms-react-ui";
import { useCallback, useState } from "react";
type PropTypes = {
	ctx: RenderManualFieldExtensionConfigScreenCtx;
};

type Parameters = {
	multiSelect: boolean;
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
				<SwitchField
					id="multiSelect"
					name="multiSelect"
					label="Allow multiple"
					value={formValues.multiSelect ?? false}
					onChange={update.bind(null, "multiSelect")}
				/>
			</Form>
		</Canvas>
	);
}
