import { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Button, Canvas, TextField, Form, FieldGroup } from "datocms-react-ui";
import { Form as FormHandler, Field } from "react-final-form";
type Props = {
	ctx: RenderConfigScreenCtx;
};

export type KontainerParameters = { domain?: string };

export default function ConfigScreen({ ctx }: Props) {
	const onSubmit = async (values: KontainerParameters) => {
		await ctx.updatePluginParameters(values);
		ctx.notice("Settings updated successfully!");
	};

	return (
		<Canvas ctx={ctx}>
			<FormHandler<KontainerParameters>
				initialValues={ctx.plugin.attributes.parameters}
				validate={(values: KontainerParameters) => {
					const errors: Record<string, string> = {};
					if (!values.domain) {
						errors.domain = "This field is required!";
					}
					return errors;
				}}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, submitting, dirty }) => (
					<Form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field name="domain">
								{({ input, meta: { error } }) => (
									<TextField
										id="domain"
										label="Kontainer domain"
										hint="The subdomain of your kontainer url."
										required
										error={error}
										{...input}
									/>
								)}
							</Field>
						</FieldGroup>
						<Button
							type="submit"
							fullWidth
							buttonSize="l"
							buttonType="primary"
							disabled={ submitting || !dirty }
						>
							Save settings
						</Button>
					</Form>
				)}
			</FormHandler>
		</Canvas>
	);
}
