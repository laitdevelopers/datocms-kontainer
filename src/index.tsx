import { connect, RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import "datocms-react-ui/styles.css";
import React from 'react';
import { createRoot } from 'react-dom/client';
import KontainerAssets from './entrypoints/KontainerAssets';

function render(component: React.ReactNode) {
  const element = document.getElementById('root') as Element;
  const root = createRoot(element);
  root.render(<React.StrictMode>{component}</React.StrictMode>);
}

connect({
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
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    switch (fieldExtensionId) {
      case 'kontainerAssets':
        return render(<KontainerAssets ctx={ctx} />);
    }
  },
});
