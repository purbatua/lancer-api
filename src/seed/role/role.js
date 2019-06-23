import { create as createRoleCtrl } from '../../api/role/role.controller'
import seedonfig from '../../config/seed'



export function create(req, res) {
  const roles = [
    {
      name: 'Super Admin',
      permissions: seedonfig.permissions
    },
    {
      name: 'Admin',
      permissions: seedonfig.permissions
    },
    {
      name: 'Super User',
      permissions: seedonfig.permissions
    },
    {
      name: 'User',
      permissions: seedonfig.permissions
    }
  ]

  req.body = roles
  createRoleCtrl(req, res)
}