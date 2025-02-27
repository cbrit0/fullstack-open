const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'black',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle} className="notification">
      {message}
    </div>
  )
}

export default Notification