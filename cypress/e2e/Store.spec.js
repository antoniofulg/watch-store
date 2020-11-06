/// <reference types="cypress" />

import { makeServer } from '../../miragejs/server'

context('Store', () => {
  let server
  const g = cy.get
  const gid = cy.getByTestId

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should display the store', () => {
    cy.visit('/')

    g('body').contains('Brand')
    g('body').contains('Wrist Watch')
  })

  context.only('Store > Shopping Cart', () => {
    it('should not display shopping cart when page first lodas', () => {
      cy.visit('/')

      gid('shopping-cart').should('have.class', 'hidden')
    })

    it('should toggle shopping cart visibility when button is clicked', () => {
      cy.visit('/')

      gid('toggle-button').as('toggleButton')

      gid('shopping-cart').as('shoppingCart')

      g('@toggleButton').click()

      g('@shoppingCart').should('not.have.class', 'hidden')

      g('@toggleButton').click()

      g('@shoppingCart').should('have.class', 'hidden')
    })
  })

  context('Store > Product list', () => {
    it('should display "0 Products" when no product is returned', () => {
      cy.visit('/')

      gid('product-card').should('have.length', 0)
      g('body').contains('0 Products')
    })

    it('should display "1 Product" when 1 product is returned', () => {
      server.create('product')

      cy.visit('/')

      gid('product-card').should('have.length', 1)
      g('body').contains('1 Product')
    })

    it('should display "10 Products" when 10 products are returned', () => {
      server.createList('product', 10)

      cy.visit('/')

      gid('product-card').should('have.length', 10)
      g('body').contains('10 Products')
    })
  })

  context('Store > Search for products', () => {
    it('should type in the search field', () => {
      cy.visit('/')

      g('input[type="search"]')
        .type('Some text here')
        .should('have.value', 'Some text here')
    })

    it('should return 1 product when "Relógio bonito" is used as search term', () => {
      server.create('product', {
        title: 'Relógio bonito',
      })
      server.createList('product', 10)

      cy.visit('/')
      g('input[type="search"]').type('Relógio bonito')
      gid('form-submit').submit()
      gid('product-card').should('have.length', 1)
    })

    it('should not return any product', () => {
      server.createList('product', 10)

      cy.visit('/')
      g('input[type="search"]').type('Relógio bonito')
      gid('form-submit').submit()
      gid('product-card').should('have.length', 0)
      g('body').contains('0 Products')
    })
  })
})
