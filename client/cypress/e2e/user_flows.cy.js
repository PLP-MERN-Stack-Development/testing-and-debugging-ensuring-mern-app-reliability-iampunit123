describe('User Authentication Flows', () => {
  beforeEach(() => {
    // Start from the home page before each test
    cy.visit('/');
  });

  it('should complete user registration flow', () => {
    cy.intercept('POST', '/api/auth/register').as('registerRequest');

    // Navigate to registration page
    cy.get('a[href="/register"]').click();
    cy.url().should('include', '/register');

    // Fill registration form
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Wait for API call and check response
    cy.wait('@registerRequest').its('response.statusCode').should('eq', 201);

    // Should be redirected to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, testuser').should('be.visible');
  });

  it('should complete user login flow', () => {
    cy.intercept('POST', '/api/auth/login').as('loginRequest');

    // Navigate to login page
    cy.get('a[href="/login"]').click();
    cy.url().should('include', '/login');

    // Fill login form
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Wait for API call
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // Should be redirected to dashboard
    cy.url().should('include', '/dashboard');
  });
});

describe('Post Management Flows', () => {
  beforeEach(() => {
    // Login first
    cy.login('test@example.com', 'password123');
    cy.visit('/dashboard');
  });

  it('should create a new post', () => {
    cy.intercept('POST', '/api/posts').as('createPost');

    // Navigate to create post page
    cy.get('a[href="/posts/create"]').click();
    cy.url().should('include', '/posts/create');

    // Fill post form
    cy.get('input[name="title"]').type('My New Post');
    cy.get('textarea[name="content"]').type('This is the content of my new post');
    
    // Submit form
    cy.get('button[type="submit"]').click();

    // Wait for API call
    cy.wait('@createPost').its('response.statusCode').should('eq', 201);

    // Should be redirected to posts list and see new post
    cy.url().should('include', '/posts');
    cy.contains('My New Post').should('be.visible');
  });

  it('should edit an existing post', () => {
    cy.intercept('PUT', '/api/posts/*').as('updatePost');

    // Go to posts list
    cy.visit('/posts');
    
    // Click edit on first post
    cy.get('[data-testid="post-item"]').first().within(() => {
      cy.get('a').contains('Edit').click();
    });

    // Update post title
    cy.get('input[name="title"]').clear().type('Updated Post Title');
    cy.get('button[type="submit"]').click();

    // Wait for API call
    cy.wait('@updatePost').its('response.statusCode').should('eq', 200);

    // Should see updated title
    cy.contains('Updated Post Title').should('be.visible');
  });

  it('should delete a post', () => {
    cy.intercept('DELETE', '/api/posts/*').as('deletePost');

    // Go to posts list
    cy.visit('/posts');
    
    // Count posts before deletion
    cy.get('[data-testid="post-item"]').its('length').then((initialCount) => {
      // Click delete on first post and confirm
      cy.get('[data-testid="post-item"]').first().within(() => {
        cy.get('button').contains('Delete').click();
      });

      // Confirm deletion in dialog
      cy.get('[data-testid="confirm-dialog"]').within(() => {
        cy.contains('button', 'Yes, Delete').click();
      });

      // Wait for API call
      cy.wait('@deletePost').its('response.statusCode').should('eq', 200);

      // Should have one less post
      cy.get('[data-testid="post-item"]').should('have.length', initialCount - 1);
    });
  });
});

// Custom command for login
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.request('POST', '/api/auth/login', {
      email: email,
      password: password
    }).then((response) => {
      window.localStorage.setItem('token', response.body.token);
    });
  });
});