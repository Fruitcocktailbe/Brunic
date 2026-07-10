const CART_PARTS = /* GraphQL */ `
  fragment CartParts on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            sku
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            product {
              handle
              title
              featuredImage {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  ${CART_PARTS}
  query Cart($id: ID!) {
    cart(id: $id) {
      ...CartParts
    }
  }
`;

export const CART_CREATE = /* GraphQL */ `
  ${CART_PARTS}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartParts
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_ADD = /* GraphQL */ `
  ${CART_PARTS}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartParts
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_UPDATE = /* GraphQL */ `
  ${CART_PARTS}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartParts
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE = /* GraphQL */ `
  ${CART_PARTS}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartParts
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Server-side poortwachter. Een client kan élk variant-ID posten, dus we halen de
 * échte staat van de variant op vóór we hem in de mand leggen:
 * etalage-producten dragen `price 0.00` als "nog geen prijs"-sentinel — die mogen
 * nooit afrekenbaar zijn.
 */
export const VARIANT_GUARD_QUERY = /* GraphQL */ `
  query VariantGuard($id: ID!) {
    node(id: $id) {
      ... on ProductVariant {
        id
        availableForSale
        price {
          amount
        }
        product {
          handle
          title
          etalage: metafield(namespace: "brunic", key: "etalage") {
            value
          }
        }
      }
    }
  }
`;
