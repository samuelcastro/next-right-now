import gql from 'graphql-tag';

import { asset } from './asset';

const productFields = gql`
  fragment productFields on Product {
    id
    status
    title
    description
    images {
      ...assetFields
    }
    price
  }

  ${asset.assetFields}
`;

// XXX https://www.apollographql.com/docs/react/advanced/fragments
export const product = {
  productFields
};
