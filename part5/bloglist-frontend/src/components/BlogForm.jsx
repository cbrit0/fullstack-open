import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })

    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        author
        <input
          data-testid='author'
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          placeholder='author'
        />
      </div>
      <div>
        title
        <input
          data-testid='title'
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          placeholder='title'
        />
      </div>
      <div>
        url
        <input
          data-testid='url'
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          placeholder='url'
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm