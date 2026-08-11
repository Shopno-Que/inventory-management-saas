import { db } from "../index.js";
import { storePermissions } from "../schema/stores.js";
/**
 * avoid alies import, becouse raw nodejs will run this file. it has not configured alies path as nextjs build toold has that configuration.
 */

const permissions = [
    {
        code: "products.view",
        name: "View products",
    },
    {
        code: "products.create",
        name: "Create products",
    },
    {
        code: "products.update",
        name: "Update products",
    },
    {
        code: "products.delete",
        name: "Delete products",
    },

    {
        code: "sales.view",
        name: "View sales",
    },
    {
        code: "sales.create",
        name: "Create sales",
    },
    {
        code: "sales.update",
        name: "Update sales",
    },
    {
        code: "sales.delete",
        name: "Delete sales",
    },

    {
        code: "purchases.view",
        name: "View purchases",
    },
    {
        code: "purchases.create",
        name: "Create purchases",
    },
    {
        code: "purchases.update",
        name: "Update purchases",
    },
    {
        code: "purchases.delete",
        name: "Delete purchases",
    },

    {
        code: "customers.view",
        name: "View customers",
    },
    {
        code: "customers.create",
        name: "Create customers",
    },
    {
        code: "customers.update",
        name: "Update customers",
    },
    {
        code: "customers.delete",
        name: "Delete customers",
    },

    {
        code: "suppliers.view",
        name: "View suppliers",
    },
    {
        code: "suppliers.create",
        name: "Create suppliers",
    },
    {
        code: "suppliers.update",
        name: "Update suppliers",
    },
    {
        code: "suppliers.delete",
        name: "Delete suppliers",
    },

    {
        code: "inventory.view",
        name: "View inventory",
    },
    {
        code: "inventory.adjust",
        name: "Adjust inventory",
    },

    {
        code: "reports.view",
        name: "View reports",
    },

    {
        code: "staff.view",
        name: "View staff",
    },
    {
        code: "staff.create",
        name: "Create staff",
    },
    {
        code: "staff.update",
        name: "Update staff",
    },
    {
        code: "staff.delete",
        name: "Delete staff",
    },

    {
        code: "roles.view",
        name: "View roles",
    },
    {
        code: "roles.create",
        name: "Create roles",
    },
    {
        code: "roles.update",
        name: "Update roles",
    },
    {
        code: "roles.delete",
        name: "Delete roles",
    },

    {
        code: "store.settings",
        name: "Manage store settings",
    },
];

async function seedPermissions() {
    await db
        .insert(storePermissions)
        .values(permissions)
        .onConflictDoNothing({
            target: storePermissions.code,
        });

    console.log("Store permissions seeded.");
}

async function seed() {
    console.log("Starting database seed...");

    await seedPermissions();

    // Add future seeders here.
    // await seedSomethingElse();

    console.log("Database seed completed.");
}

seed()
    .catch((error) => {
        console.error("Database seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        process.exit(0);
    });