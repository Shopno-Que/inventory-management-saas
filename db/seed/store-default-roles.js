export const defaultStoreRoles = [
    {
        code: "manager",
        name: "Manager",
        permissions: [
            "products.view",
            "products.create",
            "products.update",
            "products.delete",

            "sales.view",
            "sales.create",
            "sales.update",
            "sales.delete",

            "purchases.view",
            "purchases.create",
            "purchases.update",
            "purchases.delete",

            "customers.view",
            "customers.create",
            "customers.update",
            "customers.delete",

            "suppliers.view",
            "suppliers.create",
            "suppliers.update",
            "suppliers.delete",

            "inventory.view",
            "inventory.adjust",

            "reports.view",

            "staff.view",
            "staff.create",
            "staff.update",

            "roles.view",
        ],
    },

    {
        code: "staff",
        name: "Staff",
        permissions: [
            "products.view",

            "sales.view",
            "sales.create",

            "purchases.view",

            "customers.view",
            "customers.create",

            "suppliers.view",

            "inventory.view",
        ],
    },
];