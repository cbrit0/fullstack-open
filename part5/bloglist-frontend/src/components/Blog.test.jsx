import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import Notification from './Notification'

test('renders title and author, but not URL or likes by default', () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 5,
    user: { name: 'Test User', username: 'testuser' },
  }

  render(<Blog blog={blog} user={{ username: 'testuser' }} likeBlog={(blog) => {}} deleteBlog={(blog) => {}} />)

  expect(screen.getByText('Testing React Components Test Author')).toBeDefined()

  expect(screen.queryByText('https://test.com')).toBeNull()
  expect(screen.queryByText('Likes: 5')).toBeNull()
})
