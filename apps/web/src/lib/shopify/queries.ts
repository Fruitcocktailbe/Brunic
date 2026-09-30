const PRODUCT_CARD = /* GraphQL */ `
  fragment ProductCard on Product {
    id
    handle
    title
    productType
    vendor
    etalage: metafield(namespace: "brunic", key: "etalage") {
      value
    }
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

/**
 * Eén pagina producten van een collectie. Vooruit bladeren = first + after, terug = last +
 * before (cursor-paginering van de Storefront API; er bestaat geen paginanummer).
 */
export const COLLECTION_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD}
  query Collection(
    $handle: String!
    $first: Int
    $last: Int
    $after: String
    $before: String
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first, last: $last, after: $after, before: $before, filters: $filters) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

const IMAGE = /* GraphQL */ `
  url
  altText
  width
  height
`;

export const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      productType
      vendor
      collections(first: 10) {
        nodes {
          handle
          title
        }
      }
      descriptionHtml
      options {
        name
        optionValues {
          name
        }
      }
      etalage: metafield(namespace: "brunic", key: "etalage") {
        value
      }
      materiaal: metafield(namespace: "brunic", key: "materiaal") {
        value
      }
      kleurfamilie: metafield(namespace: "brunic", key: "kleurfamilie") {
        value
      }
      poolklasse: metafield(namespace: "brunic", key: "poolklasse") {
        value
      }
      erpFamilie: metafield(namespace: "brunic", key: "erp_familie") {
        value
      }
      collectie: metafield(namespace: "brunic", key: "collectie") {
        value
      }
      verkoopEenheid: metafield(namespace: "brunic", key: "verkoop_eenheid") {
        value
      }
      specificaties: metafield(namespace: "brunic", key: "specificaties") {
        value
      }
      featuredImage {
        ${IMAGE}
      }
      images(first: 60) {
        nodes {
          ${IMAGE}
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 100) {
        nodes {
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
          image {
            ${IMAGE}
          }
          breedte: metafield(namespace: "brunic", key: "breedte_cm") {
            value
          }
          lengte: metafield(namespace: "brunic", key: "lengte_cm") {
            value
          }
          kleurnaam: metafield(namespace: "brunic", key: "kleurnaam") {
            value
          }
          beschrijving: metafield(namespace: "brunic", key: "beschrijving") {
            value
          }
          specificaties: metafield(namespace: "brunic", key: "specificaties") {
            value
          }
          afbeeldingen: metafield(namespace: "brunic", key: "afbeeldingen") {
            references(first: 12) {
              nodes {
                ... on MediaImage {
                  image {
                    ${IMAGE}
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/** Voor generateStaticParams: welke collecties prerenderen we? */
export const COLLECTION_HANDLES_QUERY = /* GraphQL */ `
  query CollectionHandles($first: Int!) {
    collections(first: $first) {
      nodes {
        handle
      }
    }
  }
`;

/** Alleen de topproducten prerenderen; de rest komt via ISR on-demand. */
export const TOP_PRODUCT_HANDLES_QUERY = /* GraphQL */ `
  query TopProductHandles($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        handle
      }
    }
  }
`;
