import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null )

      return res.writeHead(200).end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const new_task = { id: randomUUID(), ...req.body, created_at: new Date().toISOString(), updated_at: null, completed_at: null}
      database.insert('tasks', new_task)
      return res.writeHead(201).end()

    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const id = req.params['id']
      req.body = { ...req.body, updated_at: new Date()}
      const task = database.update('tasks', id, req.body)

      return res.writeHead(200).end(JSON.stringify(task))

    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const id = req.params['id']
      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const id = req.params['id']
      const updated_task = database.update('tasks', id, {'completed_at': new Date()})
      return res.writeHead(200).end(JSON.stringify(updated_task))
    }
  }
]