import { set, connect, Schema, model } from 'mongoose'

set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error conecting to MongoDB:', error.message)
    })

const personSchema = new Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: v => /^(\d{2,3}-\d+)$/.test(v),
            message: props => `${props.value} is not a valid phone number.`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

export default model('Person', personSchema)