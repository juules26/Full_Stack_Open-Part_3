const PersonForm = ({ newName, setNewName, newNumber, setNewNumber, addName}) => (
    <div>
        <form onSubmit={addName}>
          name:
          <input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
            />
          <div>
            number:
            <input
              value={newNumber}
              onChange={(event) => setNewNumber(event.target.value)}
            />
          </div>
          <button type='submit'>add</button>
      </form>
    </div>
)

export default PersonForm