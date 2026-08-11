import { inArray } from "drizzle-orm";

import {
    storeRoles,
    storePermissions,
    storeRolePermissions,
} from "./schema/stores.js";

import { defaultStoreRoles } from "./seed/store-default-roles.js";

export async function createDefaultStoreRoles(storeId, tx) {
    const permissionCodes = [
        ...new Set(
            defaultStoreRoles.flatMap(
                (role) => role.permissions,
            ),
        ),
    ];

    const permissions = await tx
        .select({
            id: storePermissions.id,
            code: storePermissions.code,
        })
        .from(storePermissions)
        .where(
            inArray(
                storePermissions.code,
                permissionCodes,
            ),
        );

    const permissionMap = new Map(
        permissions.map((permission) => [
            permission.code,
            permission.id,
        ]),
    );

    const roles = await tx
        .insert(storeRoles)
        .values(
            defaultStoreRoles.map((role) => ({
                storeId,
                code: role.code,
                name: role.name,
                isSystem: true,
            })),
        )
        .returning({
            id: storeRoles.id,
            code: storeRoles.code,
        });

    const rolePermissions = [];

    for (const role of defaultStoreRoles) {
        const createdRole = roles.find(
            (item) => item.code === role.code,
        );

        if (!createdRole) {
            throw new Error(
                `Role was not created: ${role.code}`,
            );
        }

        for (const permissionCode of role.permissions) {
            const permissionId =
                permissionMap.get(permissionCode);

            if (!permissionId) {
                throw new Error(
                    `Permission not found: ${permissionCode}`,
                );
            }

            rolePermissions.push({
                roleId: createdRole.id,
                permissionId,
            });
        }
    }

    if (rolePermissions.length > 0) {
        await tx
            .insert(storeRolePermissions)
            .values(rolePermissions);
    }

    return roles;
}