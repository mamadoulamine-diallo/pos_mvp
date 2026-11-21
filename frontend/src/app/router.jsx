import { RouterProvider } from "react-router-dom";
import routes from "./routes";

function AppRouter() {
    return <RouterProvider router={routes} />;
}

export default AppRouter;