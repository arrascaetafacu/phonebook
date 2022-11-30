const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))


let persons = [
  {
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  response.send(
    `<div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    <div>`
  )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    return response.json(person)
  }

  response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
  const body = request.body
  console.log(body)
  if (!body.name || !body.number) {
    return response.status(400).json({error: "name or number missing"})
  }
  if ( persons.find(p => p.name === body.name) ) {
    return response.status(400).json({error: "Name already exists in phonebook"})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 9999)
  }

  persons = persons.concat(person)

  response.status(201).json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})