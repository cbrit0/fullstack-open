export const Persons = (props) => {
  const { persons, filter } = props;

  return (
    persons
      .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
      .map(person => <p key={person.id}>{person.name} {person.number}</p>
      )
  );
};
