function Sidebar() {

    const menu = [
        "Dashboard",
        "Products",
        "Categories",
        "Sales",
        "Users"
    ];

    return (
        <aside className="sidebar">

            <nav>

                <ul>

                    {menu.map(item => (

                        <li key={item}>
                            {item}
                        </li>

                    ))}

                </ul>

            </nav>

        </aside>
    );
}

export default Sidebar;