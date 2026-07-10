const PRODUCT_CARD = /* GraphQL */ `
  fragment ProductCard on Product {
    id
    handle
    title
    productType
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

export const COLLECTION_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD}
  query Collection($handle: String!, $first: Int!, $filters: [ProductFilter!]) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first, filters: $filters) {
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
          endCursor
        }
      }
    }
  }
`;

export const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      productType
      vendor
      descriptionHtml
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
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 6) {
        nodes {
          url
          altText
          width
          height
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 50) {
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
          breedte: metafield(namespace: "brunic", key: "breedte_cm") {
            value
          }
          lengte: metafield(namespace: "brunic", key: "lengte_cm") {
            value
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
