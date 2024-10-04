const Filter = ({ filtered, setFiltered }) => (
    <div>
        filter shown with<input
            value={filtered}
            onChange={(event) => setFiltered(event.target.value)}
          />
    </div>
)

export default Filter