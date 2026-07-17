import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";

import "./MainLayout.scss";

function MainLayout() {

    return (

        <div className="main-layout">

            <Header />

            <div className="layout-body">

                <Sidebar />

                <Content />

            </div>

        </div>

    );

}

export default MainLayout;