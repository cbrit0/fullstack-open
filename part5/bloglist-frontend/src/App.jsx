import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = (credentials) => {
    loginService
      .login(credentials)
      .then(user => {
        window.localStorage.setItem(
          'loggedBloglistUser', JSON.stringify(user)
        )
        blogService.setToken(user.token)
        setUser(user)
      })
      .catch(() => {
        setMessage('wrong username or password')
      })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      })
      .catch(() => {
        setMessage(`error adding blog`)
      })
    setTimeout(() => setMessage(null), 5000)
  }

  const blogFormRef = useRef()

  const likeBlog = (blog) => {
    blogService
      .update(blog.id, { ...blog, likes: blog.likes + 1, user: blog.user.id})
      .then(returnedBlog => {
        setBlogs(blogs.map(b => b.id === blog.id ? { ...returnedBlog, user: blog.user }: b))
        setMessage(`${returnedBlog.title} by ${returnedBlog.author} liked`)
      })
      .catch(() => {
        setMessage('error updating blog')
      })
    setTimeout(() => setMessage(null), 5000)
  }

  const deleteBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService
        .deleteBlog(blog.id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
          setMessage(`${blog.title} by ${blog.author} deleted`)
        })
        .catch(() => setMessage('error deleting blog'))
      setTimeout(() => setMessage(null), 5000)
    }
  }

  return (
    <div>
      <Notification message={message} />
      {user === null ? (
        <div>
          <h2>log in to application</h2>
          <LoginForm login={handleLogin} />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <h2>create new</h2>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.map(blog =>
            <Blog
              key={blog.id} 
              blog={blog} 
              likeBlog={likeBlog} 
              deleteBlog={deleteBlog} 
            />
          )}
        </div>
      )}
    </div>
  )
}

export default App