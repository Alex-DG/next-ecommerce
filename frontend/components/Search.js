import { useLazyQuery, useQuery } from '@apollo/client'
import { resetIdCounter, useCombobox } from 'downshift'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/dist/client/router'
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'

const SEARH_PRODUCT_QUERY = gql`
  query SEARH_PRODUCT_QUERY($value: String!) {
    results: allProducts(
      where: {
        OR: [{ name_contains_i: $value }, { description_contains_i: $value }]
      }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`

const Search = () => {
  const router = useRouter()

  const [findItems, { loading, data, error }] = useLazyQuery(
    SEARH_PRODUCT_QUERY,
    {
      fetchPolicy: 'no-cache',
    }
  )

  const items = data?.results || []
  const findItemsButChill = debounce(findItems, 350)

  /**
   * Downshit
   */
  resetIdCounter() // SSR fix

  const {
    inputValue,
    highlightedIndex,
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
  } = useCombobox({
    items,
    onInputValueChange: () => {
      findItemsButChill({
        variables: {
          value: inputValue,
        },
      })
    },
    onSelectedItemChange: ({ selectedItem: { id } }) => {
      router.push({
        pathname: `/product/${id}`,
      })
    },
    itemToString: (item) => item?.name || '',
  })

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an item',
            id: 'search',
            className: loading ? 'loading' : '',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => {
            const { id, name, photo } = item

            return (
              <DropDownItem
                key={id}
                {...getItemProps({ item })}
                highlighted={index === highlightedIndex}
              >
                <img
                  src={photo.image.publicUrlTransformed}
                  alt={name}
                  width="50"
                />
                {name}
              </DropDownItem>
            )
          })}

        {isOpen && !items.length && !loading && (
          <DropDownItem>Sorry, not items found four {inputValue}</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  )
}

export default Search
