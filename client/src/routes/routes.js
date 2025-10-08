import React from "react";

const Dashboard = React.lazy(() =>
  import("../pages/admin/dashboard/Dashboard")
);

const WidgetsDropdown = React.lazy(() =>
  import("../pages/admin/widgets/WidgetsDropdown")
);

const WidgetsBrand = React.lazy(() =>
  import("../pages/admin/widgets/WidgetsBrand")
);

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/widgets/dropdown", name: "WidgetsDropdown", element: WidgetsDropdown },
  { path: "/widgets/brand", name: "WidgetsBrand", element: WidgetsBrand },
];

export default routes;
