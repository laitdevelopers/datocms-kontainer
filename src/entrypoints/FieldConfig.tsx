import { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, Form, TextField } from "datocms-react-ui";
import { useCallback, useState } from "react";
type PropTypes = {
	ctx: RenderManualFieldExtensionConfigScreenCtx;
};

type Parameters = {
	minItems: string;
	maxItems: string;
};

export function fieldConfigValidation(parameters: Parameters) {
	const errors: Record<string, string> = {};
	const minNumber = parseInt(parameters.minItems);
	const maxNumber = parseInt(parameters.maxItems);
	if (isNaN(maxNumber) || maxNumber < 0 || maxNumber < minNumber) {
		errors.maxItems =
			"Max items must be a number bigger than or equal to Min item";
	}
	if (isNaN(minNumber) || minNumber < 0 || minNumber > maxNumber) {
		errors.minItems =
			"Min items must be a number less than or equal to Max item";
	}
	return errors;
}

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
		[formValues, setFormValues, ctx]
	);
	const errors = ctx.errors as Partial<Record<string, string>>;

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
					error={errors.minItems}
				/>
				<TextField
					id="maxItems"
					name="maxItems"
					label="Maximum items"
					required
					value={formValues.maxItems}
					onChange={update.bind(null, "maxItems")}
					error={errors.maxItems}
				/>
			</Form>
		</Canvas>
	);
}
