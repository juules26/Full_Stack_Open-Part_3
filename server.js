const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

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
];

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms :req-body'))

morgan.token('req-body', (request) => JSON.stringify(request.body))

app.get('/', (request, response) => {
  response.send('Welcome to the Phonebook :-)')
})

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/info', (request, response) => {
  const listLength = persons.length
  const date = new Date().toString()
  const message = `Phonebook has info for ${listLength} people <br/><br/>${date}`

  response.send(message)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
    console.error('id non existing')
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const personToDelete = persons.find(person => person.id === id)
  if (personToDelete) {
    console.log(`${personToDelete.name} deleted`)
  }
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const idLimit = 10000
  const randomId = Math.floor(Math.random() * idLimit) + 4
  return randomId
}

app.post('/api/persons',(request, response) => {
  const body = request.body

  console.log('request POST:', request.body)
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing and required'
    })
  }
  const nameExists = persons.some(person => person.name === body.name)
  if (nameExists) {
    console.log(`${body.name} exists!`)
    return response.status(409).json({
      error: `${body.name} already exists`
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons.push(person)
  console.log(`${person.name} added to contacts`)
  response.status(201).json(person)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
