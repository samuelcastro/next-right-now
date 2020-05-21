import gql from 'graphql-tag';

import { asset } from './asset';

const themeFields = gql`
  fragment themeFields on Theme {
    primaryColor
    logo {
      ...assetFields
    }
  }

  ${asset.assetFields}
`;

// XXX https://www.apollographql.com/docs/react/advanced/fragments
export const theme = {
  themeFields
};
