// 1. Import mongoose library
import { connect, Schema, model, connection } from 'mongoose'

// 2. Verify if there is password as argument
if (process.argv.length < 3) {
    console.log(`provide a password as argument`)
    process.exit(1) // exit program with error message
}

// 3. Define URl and password
const password = process.argv[2]
const url = `mongodb+srv://juules26:${password}@cluster0.cvvzf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// 4. Connect to mongodb
connect(url)

// 5. Define Mongoose scheme
const personSchema = new Schema({
    name: String,
    number: String
})
// Define scheme based model
const Person = model('Person', personSchema)

// 6. Add or list people
if (process.argv.length === 5) {
    const person = new Person ({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(() => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        connection.close()
    })
} else if (process.argv.length === 3) {
    // List all the people
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        });
        connection.close() // 7. Close connection
    })
}
