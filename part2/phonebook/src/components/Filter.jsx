export const Filter = (props) => {
  const { filter, handleFilterChange } = props;
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};
