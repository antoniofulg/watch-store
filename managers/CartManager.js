import Vue from 'vue'

const initialState = {
  open: false,
  items: [],
}

export class CartManager {
  state

  constructor() {
    this.state = Vue.observable(initialState)
  }

  open() {
    this.state.open = true

    return this.state
  }

  close() {
    this.state.open = false

    return this.state
  }

  getState() {
    return this.state
  }

  productIsInTheCart(product) {
    return !!this.state.items.find(({ id }) => id === product.id)
  }

  hasProducts() {
    return this.state.items.length > 0
  }

  addProduct(product) {
    if (!this.productIsInTheCart(product)) this.state.items.push(product)

    return this.getState()
  }

  removeProduct(id) {
    this.state.items = [
      ...this.state.items.filter((product) => product.id !== id),
    ]

    return this.getState()
  }

  clearProducts() {
    this.state.items = []
    return this.getState()
  }

  clearCart() {
    this.clearProducts()
    this.close()
    return this.getState()
  }
}
