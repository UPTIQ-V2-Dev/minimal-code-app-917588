import prisma from '../client.ts';
import { Prisma, Role, User } from '../generated/prisma/index.js';
import ApiError from '../utils/ApiError.ts';
import { encryptPassword } from '../utils/encryption.ts';
import httpStatus from 'http-status';

export interface PaginatedResult<T> {
    results: T[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
}

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<Omit<User, 'password'>>}
 */
const createUser = async (email: string, password: string, name: string, role: Role): Promise<Omit<User, 'password'>> => {
    if (await getUserByEmail(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: await encryptPassword(password),
            role
        }
    });
    
    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

/**
 * Query for users with pagination
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<PaginatedResult>}
 */
const queryUsers = async (
    filter: Prisma.UserWhereInput,
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
    }
): Promise<PaginatedResult<Omit<User, 'password'>>> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    
    // Parse sortBy if provided (format: "field:asc" or "field:desc")
    let orderBy: Prisma.UserOrderByWithRelationInput | undefined;
    if (sortBy) {
        const [field, direction] = sortBy.split(':');
        if (field && ['asc', 'desc'].includes(direction)) {
            orderBy = { [field]: direction as 'asc' | 'desc' };
        }
    }

    // Calculate skip value for pagination (page starts from 1)
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalResults = await prisma.user.count({ where: filter });
    const totalPages = Math.ceil(totalResults / limit);

    // Get users with pagination
    const users = await prisma.user.findMany({
        where: filter,
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true
        },
        skip,
        take: limit,
        orderBy: orderBy || { createdAt: 'desc' }
    });

    return {
        results: users,
        page,
        limit,
        totalPages,
        totalResults
    };
};

/**
 * Get user by id
 * @param {number} id
 * @returns {Promise<Omit<User, 'password'> | null>}
 */
const getUserById = async (id: number): Promise<Omit<User, 'password'> | null> => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true
        }
    });
    return user;
};

/**
 * Get user by email (internal use - includes password for auth)
 * @param {string} email
 * @returns {Promise<User | null>}
 */
const getUserByEmail = async (email: string): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: { email }
    });
};

/**
 * Get user by email (external use - excludes password)
 * @param {string} email
 * @returns {Promise<Omit<User, 'password'> | null>}
 */
const getUserByEmailSafe = async (email: string): Promise<Omit<User, 'password'> | null> => {
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true
        }
    });
    return user;
};

/**
 * Update user by id
 * @param {number} userId
 * @param {Object} updateBody
 * @returns {Promise<Omit<User, 'password'>>}
 */
const updateUserById = async (
    userId: number,
    updateBody: Prisma.UserUpdateInput
): Promise<Omit<User, 'password'>> => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    
    // Check if email is being updated and if it's already taken
    if (updateBody.email && updateBody.email !== user.email) {
        const existingUser = await getUserByEmail(updateBody.email as string);
        if (existingUser) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
    }

    // Encrypt password if it's being updated
    const dataToUpdate = { ...updateBody };
    if (dataToUpdate.password) {
        dataToUpdate.password = await encryptPassword(dataToUpdate.password as string);
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true
        }
    });
    return updatedUser;
};

/**
 * Delete user by id
 * @param {number} userId
 * @returns {Promise<void>}
 */
const deleteUserById = async (userId: number): Promise<void> => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await prisma.user.delete({ where: { id: userId } });
};

export { PaginatedResult };

export default {
    createUser,
    queryUsers,
    getUserById,
    getUserByEmail,
    getUserByEmailSafe,
    updateUserById,
    deleteUserById
};
