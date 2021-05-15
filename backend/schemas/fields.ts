import { checkbox } from '@keystone-next/fields'

// TODO: we may need a custom permission `canSeeBackend` so only admin can sign in
// to the keystone backend dashboard
export const permissionFields = {
  // canSeeBackend: {
  //   defaultValue: true,
  //   label: 'User can see backend',
  // },
  canManageProducts: checkbox({
    defaultValue: false,
    label: 'User can Update and delete any product',
  }),
  canSeeOtherUsers: checkbox({
    defaultValue: false,
    label: 'User can query other users',
  }),
  canManageUsers: checkbox({
    defaultValue: false,
    label: 'User can Edit other users',
  }),
  canManageRoles: checkbox({
    defaultValue: false,
    label: 'User can CRUD roles',
  }),
  canManageCart: checkbox({
    defaultValue: false,
    label: 'User can see and manage cart and cart items',
  }),
  canManageOrders: checkbox({
    defaultValue: false,
    label: 'User can see and manage orders',
  }),
}

export type Permission = keyof typeof permissionFields

export const permissionsList: Permission[] = Object.keys(
  permissionFields
) as Permission[]
