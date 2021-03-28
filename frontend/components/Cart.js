import styled from 'styled-components'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import formatMoney from '../lib/formatMoney'
import calcTotalPrice from '../lib/calcTotalPrice'
import { useUser } from './User'

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

  const { quantity, product } = item
  const { name, id, photo, price } = product

  return (
    <CardItemStyles key={id}>
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
    </CardItemStyles>
  )
}

const Cart = () => {
  const me = useUser()

  if (!me) return null

  const { name, cart } = me

  return (
    <CartStyles open>
      <header>
        <Supreme>{name}</Supreme>
      </header>

      <ul>
        {me.cart.map((item) => {
          return <CardItem {...{ item }} />
        })}
      </ul>

      <footer>
        <p>{formatMoney(calcTotalPrice(cart))}</p>
      </footer>
    </CartStyles>
  )
}

export default Cart
