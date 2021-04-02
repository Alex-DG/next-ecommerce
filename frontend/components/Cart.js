import styled from 'styled-components'
import CartStyles from './styles/CartStyles'
import CloseButton from './styles/CloseButton'
import Supreme from './styles/Supreme'
import formatMoney from '../lib/formatMoney'
import calcTotalPrice from '../lib/calcTotalPrice'
import { useUser } from './User'
import { useCart } from '../lib/cartState'
import RemoveFromtCart from './RemoveFromtCart'

const CardItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightGrey);
  display: grid;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 1rem;
  }
  h3,
  p {
    margin: 0;
  }
`

const CardItem = ({ item }) => {
  if (!item.product) return null

  const { quantity, product, id } = item
  const { name, photo, price } = product

  return (
    <CardItemStyles>
      <img width="100" src={photo?.image.publicUrlTransformed} alt={name} />
      <div>
        <h3>{name}</h3>
        <p>
          {formatMoney(price * quantity)} -{' '}
          <em>
            {quantity} &times; {formatMoney(price)} each
          </em>
        </p>
      </div>
      <RemoveFromtCart {...{ id }} />
    </CardItemStyles>
  )
}

const Cart = () => {
  const me = useUser()
  const { cartOpen, closeCart } = useCart()

  if (!me) return null

  const { name, cart } = me

  return (
    <CartStyles open={cartOpen}>
      <header>
        <Supreme>{name}'s Cart</Supreme>
        <CloseButton onClick={closeCart}>&times;</CloseButton>
      </header>

      <ul>
        {me.cart.map((item) => {
          return <CardItem key={item.id} {...{ item }} />
        })}
      </ul>

      <footer>
        <p>{formatMoney(calcTotalPrice(cart))}</p>
      </footer>
    </CartStyles>
  )
}

export default Cart
