import { create as createPermissionCtrl } from '../../api/permission/permission.controller'



export function create(req, res) {
  const permissions = [
    {
      name: 'Create User',
      resource: 'User',
      access: 'Create'
    },
    {
      name: 'Read User',
      resource: 'User',
      access: 'Read'
    },
    {
      name: 'Update User',
      resource: 'User',
      access: 'Update'
    },
    {
      name: 'Remove User',
      resource: 'User',
      access: 'Remove'
    }
  ]

  req.body = permissions
  createPermissionCtrl(req, res)
}