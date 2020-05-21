import gql from 'graphql-tag';

const assetFields = gql`
  fragment assetFields on Asset {
    id
    url
    mimeType
  }
`;

// XXX https://www.apollographql.com/docs/react/advanced/fragments
export const asset = {
  assetFields
};
