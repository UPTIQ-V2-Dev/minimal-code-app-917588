import { Role } from '../generated/prisma/index.js';

const allRoles = {
    [Role.USER]: ['getMcp'],
    [Role.ADMIN]: ['getUsers', 'manageUsers', 'getMcp', 'manageMcp']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
