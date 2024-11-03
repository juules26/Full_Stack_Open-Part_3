import { config } from 'dotenv';
import mongoose from 'mongoose';
import express, { json } from 'express';
import morgan, { token } from 'morgan';
import cors from 'cors';
import { join } from 'path';
import Person from './models/phonebook.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(cors());
app.use(json());
app.use(morgan(':method :url :status :response-time ms :req-body'));
app.use(express.static(join(__dirname, 'dist')));

token('req-body', (request) => JSON.stringify(request.body));


const url = process.env.MONGODB_URI;
mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message);
    });

// Home route
app.get('/', (request, response) => {
  response.send('Welcome to the Phonebook :-)')
})

// Fetch all persons from MongoDB
app.get('/api/persons', (request, response) => {
  Person.find({}) // Busca todos los documentos en la coleccion
    .then(persons => {
      response.json(persons)
    })
    .catch(error => {
      console.log(error.name)
      next(error)
    })
})

// Additional info 
app.get('/api/info', (request, response) => {
  countDocuments({})
    .then(count => {
      const date = new Date().toString()
      const message = `Phonebook has info for ${count} people <br/><br/>${date}`
      response.send(message)
    })
    .catch(error => {
      console.log(error.name)
      next(error)
    })
})

// Fetch person by ID from Mongo
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).send({ error: 'Person not found' })
      }
    })
    .catch(error => {
      console.log(error.name)
      next(error)})
})

// Update contact number
app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body //extract number from request body
  const id = request.params.id // get id from url

  findByIdAndUpdate( id, { number }, { new: true } ) // searches database for person with specific id
    .then(updatedPerson => { // after finding and updating, .then() gets called with results of update
      if (updatedPerson) { // if person found and updated
        response.json(updatedPerson) // sends updated person to client (frontend) as a JSON response
      } else {
        response.status(404).send({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
}) 

// Delete person by ID from Mongo
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  findById(id)
    .then(person => {
      if (person) {
        console.log('Deleted person:', person)
        return person.deleteOne()
      } else {
        response.status(404).send({ error: 'Person not found' })
      }
    })
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error.name)
      next(error)})
})

// Add new person to Mongo
app.post('/api/persons', (request, response, next) => {
  const {name, number} = request.body

  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number missing and required'
    })
  }
  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => {
      console.log('Added person:', savedPerson)
      response.status(201).json(savedPerson)
    })
    .catch(error => {
      console.log(error.name)
      next(error)})
})

// Fallback route for non-existent paths (for SPA)
app.get('*', (request, response) => {
  response.sendFile(join(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error('Error:', error.name, error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  response.status(500).send({ error: 'Internal server error' })
}

app.use(errorHandler)