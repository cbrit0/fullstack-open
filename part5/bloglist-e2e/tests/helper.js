const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}


const createBlog = async (page, content) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()
}

export { loginWith, createBlog }