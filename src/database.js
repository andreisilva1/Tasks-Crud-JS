import fs from 'node:fs/promises'
import { parseCSV } from './parseCSV.js'
const databasePath = new URL('tasks.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
    .then(data => this.#database = JSON.parse(data))
    .catch(() => {
      this.#persist()
    })

    if (Object.keys(this.#database).length === 0) {
      parseCSV()}
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table]

    if (search) {
      data = data.filter(row => Object.entries(search).some(([key, value]) => {
        return row[key].toLowerCase().includes(value.toLowerCase())
      }))
    }
    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id = id)
    const completed_at = this.#database[table][rowIndex].completed_at
    if (rowIndex > -1) {
      if (completed_at) {
        data['completed_at'] = null
      }
      this.#database[table][rowIndex] = { id, ...this.#database[table][rowIndex], ...data}
      this.#persist()
      return this.#database[table][rowIndex]
    }
    return null
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id = id)
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
}