import { createContext, useContext, useState } from 'react'

const LocaStateContext = createContext()
const LocalStateProvider = LocaStateContext.Provider

const CartStateProvider = ({ children }) => {
  // This is our own custom provider! we will store data (state)
  // an functionality (updaters) in here and anyone can access it
  // via the consumer!

  const [cartOpen, setCartOpen] = useState(false)

  const toggleCart = () => setCartOpen(!cartOpen)
  const openCart = () => setCartOpen(true)
  const closeCart = () => setCartOpen(false)

  return (
    <LocalStateProvider
      value={{
        cartOpen,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </LocalStateProvider>
  )
}

// Custom hook for accessing the cart local state
const useCart = () => {
  // We use a consumer here to access the local state -> useContext
  const all = useContext(LocaStateContext)
  return all
}

export { CartStateProvider, useCart }
