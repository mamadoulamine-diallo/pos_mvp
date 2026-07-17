import { Outlet } from "react-router-dom";

function Content() {

    return (
        <main className="content">

            <Outlet />

        </main>
    );

}

export default Content;