const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = await page.locator('form')
    await expect(loginForm).toBeVisible()

    await expect(page.locator('input[name="Username"]')).toBeVisible()
    await expect(page.locator('input[name="Password"]')).toBeVisible()

    await expect(page.locator('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const notificationDiv = await page.locator('.notification')
      await expect(notificationDiv).toContainText('wrong username or password')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright', 'testing blog', 'https://playwright.dev/')

      await expect(page.getByText('testing blog Playwright').first()).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Playwright', 'testing blog', 'https://playwright.dev/')

      await page.getByRole('button', { name: 'view' }).click()
      
      const detailsLocator = page.locator('.blog-details')
      await expect(detailsLocator).toContainText('likes 0')

      await page.getByRole('button', { name: 'like' }).click()
      await expect(detailsLocator).toContainText('likes 1')
    })

    test('the user who added the blog can delete it', async ({ page }) => {
      await createBlog(page, 'Playwright', 'testing blog', 'https://playwright.dev/')

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'remove' }).click()
      
      page.once('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Remove blog testing blog by Playwright?')
        await dialog.accept()
      })

      await expect(page.getByText('testing blog Playwright').first()).not.toBeVisible()
    })
  })
})
