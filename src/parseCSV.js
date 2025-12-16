import { parse } from 'csv-parse/sync'
export function parseCSV () {
  const csv = `
  title,description
  Create authentication endpoint,Implement login using JWT with email and password
  Import data from CSV,Build functionality to import tasks from a CSV file
  Refactor task service,Separate business logic from route handlers
  Add data validation,Validate request payloads using a schema
  Create automated tests,Write unit tests for the task module
  `

  const csv_converted = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  })

  for (const task of csv_converted) {
    fetch('http://localhost:3335/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'title': task.title,
        'description': task.description
      })
    })
  };
}
