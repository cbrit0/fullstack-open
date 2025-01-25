export const Persons = (props) => {
  const { persons, filter, handleDelete } = props;

  return (
    persons
      .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
      .map(person => (
          <p key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
          </p>
      ))
  );
};
