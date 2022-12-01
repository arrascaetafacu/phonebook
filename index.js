require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))


app.get('/info', (request, response) => {
  Person.find({})
  .then(persons => {
    response.send(
      `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
      <div>`
  )})
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }) 
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
        response.json(person)
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons/', (request, response) => {
  const body = request.body
  console.log(body)
  if (!body.name || !body.number) {
    return response.status(400).json({error: "name or number missing"})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(p => {
    response.status(201).json(p)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const person = {
    number: request.body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})