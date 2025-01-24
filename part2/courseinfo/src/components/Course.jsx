const Part = ({ part }) => (
  <p>{part.name} {part.exercises}</p>
)

const Content = ({ parts }) => (
  parts.map(part => <Part key={part.id} part={part} />)
)

const Header = ({ name }) => (
  <h2>{name}</h2>
)

const Total = ({ parts }) => (
  <p>
    <b>
      total of {parts.reduce((acc, curr) => acc + curr.exercises, 0)} exercises
    </b>
  </p>
)

export const Course = (props) => {
  const { course } = props
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}
