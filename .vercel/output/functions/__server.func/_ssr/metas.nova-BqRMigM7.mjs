import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { t as GoalForm } from "./goal-form-CneUMWz3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/metas.nova-BqRMigM7.js
var import_jsx_runtime = require_jsx_runtime();
function NovaMeta() {
	const navigate = useNavigate();
	const { addGoal } = useStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalForm, {
		title: "Nova Meta",
		onCancel: () => navigate({ to: "/metas" }),
		onSubmit: (data) => {
			addGoal(data);
			toast.success("Meta criada");
			navigate({ to: "/metas" });
		}
	});
}
//#endregion
export { NovaMeta as component };
