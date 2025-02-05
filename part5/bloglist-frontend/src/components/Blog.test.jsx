import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('Blog component', () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 5,
    user: { name: 'Test User', username: 'testuser' },
  }

  test('renders title and author, but not URL or likes by default', () => {
    render(<Blog blog={blog} user={{ username: 'testuser' }} likeBlog={(blog) => {}} deleteBlog={(blog) => {}} />)

    expect(screen.getByText('Testing React Components Test Author')).toBeDefined()

    expect(screen.queryByText('https://test.com')).toBeNull()
    expect(screen.queryByText('Likes: 5')).toBeNull()
  })

  test('shows URL and number of likes when the "View" button is clicked', async () => {
    const mockHandler = vi.fn()

    render(<Blog blog={blog} user={{ username: 'testuser' }} likeBlog={(blog) => {}} deleteBlog={(blog) => {}} />)

    expect(screen.queryByText('https://test.com')).toBeNull()
    expect(screen.queryByText('likes 5')).toBeNull()

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.queryByText('https://test.com')).toBeDefined()
    expect(screen.queryByText('likes 5')).toBeDefined()
  })
})